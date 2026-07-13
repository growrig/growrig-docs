import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { resolveCatalogDir } from './catalog-paths';

/** Resolve the catalog integrations directory. */
function resolveIntegrationsRoot(): string {
  return resolveCatalogDir('integrations', 'GROWRIG_INTEGRATIONS_DIR');
}

export interface ConfigField {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  secret?: boolean;
  default?: string;
  placeholder?: string;
  help?: string;
}

export interface Integration {
  category: string;
  slug: string; // directory name, unique within its category
  id: string; // machine id from the yaml
  name: string;
  version?: string;
  description?: string;
  capabilities: string[];
  config: ConfigField[];
  runtimeType: string;
  icon?: string;
  readme?: string;
}

export interface IntegrationCategoryMeta {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  order: number;
}

export interface IntegrationCategory extends IntegrationCategoryMeta {
  integrations: Integration[];
}

// Category presentation. `category` in each integration.yaml keys into this;
// unknown categories fall back to a title-cased name.
const CATEGORIES: Record<string, Omit<IntegrationCategoryMeta, 'slug'>> = {
  ai: {
    name: 'AI',
    tagline: 'Chat, vision and model providers powering the built-in assistant.',
    icon: 'bot',
    order: 1,
  },
  data: {
    name: 'Data',
    tagline: 'External observations and forecasts, like local weather.',
    icon: 'cloud',
    order: 2,
  },
  notification: {
    name: 'Notifications',
    tagline: 'Deliver GrowRig alerts to outside channels.',
    icon: 'bell',
    order: 3,
  },
};

function categoryMeta(slug: string): IntegrationCategoryMeta {
  const meta = CATEGORIES[slug] ?? {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    tagline: 'GrowRig external-service integrations.',
    icon: 'plug',
    order: 99,
  };
  return { slug, ...meta };
}

/** Human labels for known capability namespaces; unknown ones are shown raw. */
export const CAPABILITY_LABELS: Record<string, string> = {
  'ai.chat': 'Chat completion',
  'ai.vision': 'Vision messages',
  'ai.models': 'Model discovery',
  'weather.forecast': 'Weather forecast',
  'notification.send': 'Send notification',
};

let cache: IntegrationCategory[] | null = null;

function svgDataUri(dir: string, filename = 'icon.svg'): string | undefined {
  const iconPath = path.join(dir, filename);
  if (!existsSync(iconPath)) return undefined;
  return `data:image/svg+xml;base64,${readFileSync(iconPath).toString('base64')}`;
}

/** Read every `integration.yaml` under integrations/<category>/<id>/. */
export function loadIntegrationCategories(): IntegrationCategory[] {
  if (!import.meta.env.DEV && cache) return cache;

  const root = resolveIntegrationsRoot();
  const categories: IntegrationCategory[] = [];

  for (const categoryEntry of readdirSync(root, { withFileTypes: true })) {
    if (!categoryEntry.isDirectory()) continue;
    const categorySlug = categoryEntry.name;
    const categoryPath = path.join(root, categorySlug);
    const integrations: Integration[] = [];

    for (const entry of readdirSync(categoryPath, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = path.join(categoryPath, entry.name);
      const yamlPath = path.join(dir, 'integration.yaml');
      if (!existsSync(yamlPath)) continue;

      const data = parseYaml(readFileSync(yamlPath, 'utf8')) ?? {};
      const readmePath = path.join(dir, String(data.documentation ?? 'README.md'));

      integrations.push({
        category: categorySlug,
        slug: entry.name,
        id: String(data.id ?? entry.name),
        name: String(data.name ?? entry.name),
        version: data.version ? String(data.version) : undefined,
        description: data.description ? String(data.description).trim() : undefined,
        capabilities: Array.isArray(data.capabilities) ? data.capabilities.map(String) : [],
        config: (Array.isArray(data.config) ? data.config : []).map((field: any) => ({
          key: String(field.key),
          label: String(field.label ?? field.key),
          type: String(field.type ?? 'text'),
          required: Boolean(field.required),
          secret: Boolean(field.secret),
          default: field.default != null ? String(field.default) : undefined,
          placeholder: field.placeholder != null ? String(field.placeholder) : undefined,
          help: field.help != null ? String(field.help) : undefined,
        })),
        runtimeType: String(data.runtime?.type ?? 'builtin'),
        icon: svgDataUri(dir),
        readme: existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : undefined,
      });
    }

    if (integrations.length === 0) continue;
    integrations.sort((a, b) => a.name.localeCompare(b.name));
    categories.push({ ...categoryMeta(categorySlug), integrations });
  }

  categories.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  if (!import.meta.env.DEV) cache = categories;
  return categories;
}

export function allIntegrations(): Integration[] {
  return loadIntegrationCategories().flatMap((c) => c.integrations);
}

export function integrationCount(category: IntegrationCategory): number {
  return category.integrations.length;
}

export function totalIntegrationCount(): number {
  return allIntegrations().length;
}

export function findIntegrationCategory(slug: string): IntegrationCategory | undefined {
  return loadIntegrationCategories().find((c) => c.slug === slug);
}

export function capabilityLabel(capability: string): string {
  return CAPABILITY_LABELS[capability] ?? capability;
}
