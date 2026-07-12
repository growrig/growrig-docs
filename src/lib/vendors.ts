import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { allProducts } from './devices';

export interface Vendor {
  id: string;
  name: string;
  website?: string;
  logo?: string;
  color?: string;
  background?: string;
  productCount: number;
}

function root(): string {
  const candidates = [process.env.GROWRIG_VENDORS_DIR, path.resolve(process.cwd(), '../growrig-platform/vendors'), path.resolve(process.cwd(), 'source/growrig-platform/vendors')].filter(Boolean) as string[];
  const found = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isDirectory());
  if (!found) throw new Error(`Cannot find the GrowRig vendor catalog. Set GROWRIG_VENDORS_DIR.`);
  return found;
}

export function loadVendors(): Vendor[] {
  const counts = new Map<string, number>();
  for (const product of allProducts()) if (product.vendor) counts.set(product.vendor, (counts.get(product.vendor) ?? 0) + 1);
  return readdirSync(root(), { withFileTypes: true }).filter((entry) => entry.isDirectory()).flatMap((entry) => {
    const dir = path.join(root(), entry.name);
    const metadata = path.join(dir, 'vendor.yaml');
    if (!existsSync(metadata)) return [];
    const data = parseYaml(readFileSync(metadata, 'utf8')) ?? {};
    const logoPath = data.logo ? path.join(dir, data.logo) : undefined;
    const extension = logoPath ? path.extname(logoPath).toLowerCase() : '';
    const mime = extension === '.svg' ? 'image/svg+xml' : extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : undefined;
    const logo = logoPath && mime && existsSync(logoPath) ? `data:${mime};base64,${readFileSync(logoPath).toString('base64')}` : undefined;
    return [{ id: entry.name, name: String(data.name ?? entry.name), website: data.website, logo, color: data.color, background: data.background, productCount: counts.get(entry.name) ?? 0 }];
  }).sort((a, b) => a.name.localeCompare(b.name));
}
