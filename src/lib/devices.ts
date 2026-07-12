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

export interface Device {
  category: string;
  slug: string;
  brand: string;
  model: string;
  title: string;
  connection: string;
  connectionLabel: string;
  description?: string;
  version?: string;
  author?: string;
  haIntegration?: string;
  documentation?: string;
  provides: Capability[];
  guide?: string;
}

export interface CategoryMeta {
  slug: string;
  name: string;
  /** Short one-line summary shown on the category card. */
  tagline: string;
  /** Inline SVG icon markup (no wrapping element). */
  icon: string;
  order: number;
}

export interface CategoryWithDevices extends CategoryMeta {
  devices: Device[];
}

const connectionNames: Record<string, string> = {
  ble: 'Bluetooth LE',
  esphome: 'ESPHome',
  generic: 'Generic',
  wifi: 'Wi-Fi',
  zigbee: 'Zigbee',
  'n/a': 'Manual',
};

/**
 * Category metadata. `icon` is inline SVG path content sized for a 24x24
 * viewBox with `currentColor` strokes, matching the Home-Assistant-style grid.
 */
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
    tagline: 'Reference enclosures and their layouts.',
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

let cache: CategoryWithDevices[] | null = null;

/** Read every `device.yaml`, grouped by category, sorted for display. */
export function loadCategories(): CategoryWithDevices[] {
  if (cache) return cache;

  const devicesRoot = resolveDevicesRoot();
  const categories: CategoryWithDevices[] = [];

  for (const categoryEntry of readdirSync(devicesRoot, { withFileTypes: true })) {
    if (!categoryEntry.isDirectory()) continue;
    const categorySlug = categoryEntry.name;
    const categoryPath = path.join(devicesRoot, categorySlug);
    const devices: Device[] = [];

    for (const deviceEntry of readdirSync(categoryPath, { withFileTypes: true })) {
      if (!deviceEntry.isDirectory()) continue;
      const slug = deviceEntry.name;
      const yamlPath = path.join(categoryPath, slug, 'device.yaml');
      if (!existsSync(yamlPath)) continue;

      const data = parseYaml(readFileSync(yamlPath, 'utf8')) ?? {};
      const guidePath = path.join(categoryPath, slug, 'guide.md');
      const guide = existsSync(guidePath) ? readFileSync(guidePath, 'utf8') : undefined;

      const connection = String(data.connection ?? 'n/a');
      devices.push({
        category: categorySlug,
        slug,
        brand: String(data.brand ?? '').trim(),
        model: String(data.model ?? '').trim(),
        title: `${data.brand ?? ''} ${data.model ?? ''}`.trim(),
        connection,
        connectionLabel: connectionNames[connection] ?? connection,
        description: data.description?.trim() || undefined,
        version: data.version ? String(data.version) : undefined,
        author: data.author,
        haIntegration: data.haIntegration,
        documentation: data.documentation,
        provides: Array.isArray(data.provides) ? data.provides : [],
        guide,
      });
    }

    if (devices.length === 0) continue;
    devices.sort((a, b) => a.title.localeCompare(b.title));
    categories.push({ ...categoryMeta(categorySlug), devices });
  }

  categories.sort((a, b) => a.order - b.order);
  cache = categories;
  return categories;
}

export function allDevices(): Device[] {
  return loadCategories().flatMap((c) => c.devices);
}

export function findCategory(slug: string): CategoryWithDevices | undefined {
  return loadCategories().find((c) => c.slug === slug);
}
