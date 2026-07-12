import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

// Astro runs dev/build from the project root, so cwd is a stable anchor even
// after this module is bundled into dist/ during the build.
const repoRoot = process.cwd();

/** Resolve the platform device directory, preferring the sibling repo. */
function resolveDevicesRoot(): string {
  const candidates = [
    process.env.GROWRIG_DEVICES_DIR,
    path.resolve(repoRoot, '../growrig-platform/devices'),
    path.resolve(repoRoot, 'source/growrig-platform/devices'),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isDirectory()) return candidate;
  }

  throw new Error(
    `Cannot find the GrowRig device catalog. Set GROWRIG_DEVICES_DIR or place growrig-platform beside this repo. Checked:\n${candidates
      .map((c) => `  - ${c}`)
      .join('\n')}`,
  );
}

export interface Capability {
  label: string;
  kind: string;
  measurement?: string;
  entityDomain?: string;
  deviceClass?: string;
  role?: string;
}

/**
 * A concrete supported product, flattened from a driver's `products` list (or
 * the driver itself when it lists none). Driver-level fields (capabilities, HA
 * integration, connection) are inherited so a product page is self-contained.
 */
export interface Product {
  category: string;
  slug: string; // unique within its category
  brand: string;
  vendor?: string;
  model: string;
  title: string;
  description?: string;
  image?: string;
  specs?: Record<string, number>;
  // Inherited from the backing driver:
  connection: string;
  connectionLabel: string;
  haIntegration?: string;
  documentation?: string;
  version?: string;
  author?: string;
  provides: Capability[];
  guide?: string;
  driverSlug: string;
  driverBrand: string;
  driverModel: string;
  /** True when this product is one of several under a generic backing driver. */
  viaDriver: boolean;
}

export interface CategoryMeta {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  order: number;
}

export interface CategoryWithProducts extends CategoryMeta {
  products: Product[];
}

const connectionNames: Record<string, string> = {
  ble: 'Bluetooth LE',
  esphome: 'ESPHome',
  generic: 'Generic',
  wifi: 'Wi-Fi',
  zigbee: 'Zigbee',
  'n/a': 'Manual',
};

/** Human labels + units for known spec keys; unknown keys are title-cased. */
export const SPEC_META: Record<string, { label: string; unit?: string }> = {
  sizeMm: { label: 'Fan size', unit: 'mm' },
  maxRpm: { label: 'Max speed', unit: 'RPM' },
  airflowCfm: { label: 'Airflow', unit: 'CFM' },
  staticPressureMmH2O: { label: 'Static pressure', unit: 'mmH₂O' },
  startingVoltage: { label: 'Starting voltage', unit: 'V' },
  ductSizeInches: { label: 'Duct size', unit: 'in' },
  noiseDba: { label: 'Noise', unit: 'dBA' },
  widthCm: { label: 'Width', unit: 'cm' },
  depthCm: { label: 'Depth', unit: 'cm' },
  heightCm: { label: 'Height', unit: 'cm' },
  wattage: { label: 'Rated power', unit: 'W' },
};

const CATEGORIES: Record<string, Omit<CategoryMeta, 'slug'>> = {
  controller: {
    name: 'Controllers',
    tagline: 'ESP-based devices that drive fans and equipment locally.',
    order: 1,
    icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
  },
  sensor: {
    name: 'Sensors',
    tagline: 'Temperature, humidity, and CO₂ measurement.',
    order: 2,
    icon: '<path d="M12 2a3 3 0 0 0-3 3v8.5a5 5 0 1 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M12 9v5"/>',
  },
  fan: {
    name: 'Fans',
    tagline: 'Exhaust, intake, and circulation airflow.',
    order: 3,
    icon: '<circle cx="12" cy="12" r="2"/><path d="M12 10c0-3 1-6-1-8 4 0 6 3 6 6a4 4 0 0 1-5 2M14 12c3 0 6-1 8 1 0 4-3 6-6 6a4 4 0 0 1-2-5M10 14c0 3-1 6 1 8-4 0-6-3-6-6a4 4 0 0 1 5-2"/>',
  },
  light: {
    name: 'Lights',
    tagline: 'Grow lighting control and scheduling.',
    order: 4,
    icon: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z"/>',
  },
  plug: {
    name: 'Smart plugs',
    tagline: 'Switch power and monitor energy use.',
    order: 5,
    icon: '<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v5"/>',
  },
  camera: {
    name: 'Cameras',
    tagline: 'Visual monitoring of the grow environment.',
    order: 6,
    icon: '<path d="M3 7h3l2-2h8l2 2h3v12H3V7Z"/><circle cx="12" cy="13" r="3.5"/>',
  },
  tent: {
    name: 'Grow tents',
    tagline: 'Reference enclosures and their dimensions.',
    order: 7,
    icon: '<path d="M3 21V6l9-3 9 3v15M3 21h18M12 3v18M7 21v-6l5-2 5 2v6"/>',
  },
};

function categoryMeta(slug: string): CategoryMeta {
  const meta = CATEGORIES[slug] ?? {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    tagline: 'GrowRig device definitions.',
    order: 99,
    icon: '<rect x="4" y="4" width="16" height="16" rx="2"/>',
  };
  return { slug, ...meta };
}

interface Variant {
  id: string;
  brand?: string;
  vendor?: string;
  model?: string;
  description?: string;
  image?: string;
  specs?: Record<string, number>;
}

let cache: CategoryWithProducts[] | null = null;

/** Read every driver `device.yaml`, flatten to products, grouped by category. */
export function loadCategories(): CategoryWithProducts[] {
  if (cache) return cache;

  const devicesRoot = resolveDevicesRoot();
  const categories: CategoryWithProducts[] = [];

  for (const categoryEntry of readdirSync(devicesRoot, { withFileTypes: true })) {
    if (!categoryEntry.isDirectory()) continue;
    const categorySlug = categoryEntry.name;
    const categoryPath = path.join(devicesRoot, categorySlug);
    const products: Product[] = [];

    for (const driverEntry of readdirSync(categoryPath, { withFileTypes: true })) {
      if (!driverEntry.isDirectory()) continue;
      const driverSlug = driverEntry.name;
      const yamlPath = path.join(categoryPath, driverSlug, 'device.yaml');
      if (!existsSync(yamlPath)) continue;

      const data = parseYaml(readFileSync(yamlPath, 'utf8')) ?? {};
      const guidePath = path.join(categoryPath, driverSlug, 'guide.md');
      const guide = existsSync(guidePath) ? readFileSync(guidePath, 'utf8') : undefined;

      const connection = String(data.connection ?? 'n/a');
      const driverBrand = String(data.brand ?? '').trim();
      const driverModel = String(data.model ?? '').trim();
      const shared = {
        category: categorySlug,
        connection,
        connectionLabel: connectionNames[connection] ?? connection,
        haIntegration: data.haIntegration as string | undefined,
        documentation: data.documentation as string | undefined,
        version: data.version ? String(data.version) : undefined,
        author: data.author as string | undefined,
        provides: (Array.isArray(data.provides) ? data.provides : []) as Capability[],
        guide,
        driverSlug,
        driverBrand,
        driverModel,
      };

      const imageData = (filename?: string): string | undefined => {
        if (!filename) return undefined;
        const imagePath = path.join(categoryPath, driverSlug, filename);
        if (!existsSync(imagePath)) return undefined;
        const ext = path.extname(filename).toLowerCase();
        const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : undefined;
        return mime ? `data:${mime};base64,${readFileSync(imagePath).toString('base64')}` : undefined;
      };

      const variants: Variant[] = Array.isArray(data.products) ? data.products : [];
      if (variants.length > 0) {
        for (const v of variants) {
          const brand = (v.brand ?? driverBrand).trim();
          const model = (v.model ?? driverModel).trim();
          products.push({
            ...shared,
            slug: v.id,
            brand,
            vendor: v.vendor ?? data.vendor,
            model,
            image: imageData(v.image ?? data.image),
            title: `${brand} ${model}`.trim(),
            description: v.description?.trim() || data.description?.trim() || undefined,
            specs: v.specs,
            viaDriver: true,
          });
        }
      } else {
        products.push({
          ...shared,
          slug: driverSlug,
          brand: driverBrand,
          vendor: data.vendor,
          model: driverModel,
          image: imageData(data.image),
          title: `${driverBrand} ${driverModel}`.trim(),
          description: data.description?.trim() || undefined,
          specs: undefined,
          viaDriver: false,
        });
      }
    }

    if (products.length === 0) continue;
    products.sort((a, b) => a.title.localeCompare(b.title));
    categories.push({ ...categoryMeta(categorySlug), products });
  }

  categories.sort((a, b) => a.order - b.order);
  cache = categories;
  return categories;
}

export function allProducts(): Product[] {
  return loadCategories().flatMap((c) => c.products);
}

export function findCategory(slug: string): CategoryWithProducts | undefined {
  return loadCategories().find((c) => c.slug === slug);
}
