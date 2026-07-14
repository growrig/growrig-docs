import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { allProducts, productCount, loadCategories } from './devices';
import type { Product } from './devices';
import { resolveCatalogDir } from './catalog-paths';

export interface Vendor {
  id: string;
  name: string;
  website?: string;
  logo?: string;
  color?: string;
  background?: string;
  productCount: number;
}

/** A vendor's supported products, grouped by device category (catalog order). */
export interface VendorCategoryProducts {
  slug: string;
  name: string;
  products: Product[];
}

export function findVendor(id: string): Vendor | undefined {
  return loadVendors().find((vendor) => vendor.id === id);
}

/** Products attributed to a vendor, grouped by category and ordered like the catalog. */
export function vendorProductsByCategory(id: string): VendorCategoryProducts[] {
  return loadCategories().flatMap((category) => {
    const products = category.products.filter((product) => product.vendor === id);
    return products.length > 0 ? [{ slug: category.slug, name: category.name, products }] : [];
  });
}

function root(): string {
  return resolveCatalogDir('vendors', 'GROWRIG_VENDORS_DIR');
}

export function loadVendors(): Vendor[] {
  const counts = new Map<string, number>();
  for (const product of allProducts()) if (product.vendor) counts.set(product.vendor, (counts.get(product.vendor) ?? 0) + productCount(product));
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
