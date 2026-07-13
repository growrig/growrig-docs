import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { resolveCatalogDir } from './catalog-paths';

/** Resolve the catalog species directory. */
function resolveSpeciesRoot(): string {
  return resolveCatalogDir('species', 'GROWRIG_SPECIES_DIR');
}

export interface Stage {
  name: string;
  lightHours: number;
}

export interface CultivarAttribute {
  key: string;
  label: string;
  type: string;
  options?: string[];
  unit?: string;
}

export interface CareAction {
  key: string;
  label: string;
  icon: string;
  fields: string[];
  quick: boolean;
}

export interface FeedingPreset {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  unit?: string;
  productCount: number;
  weekCount: number;
}

export interface Species {
  slug: string;
  label: string;
  stages: Stage[];
  cultivarAttributes: CultivarAttribute[];
  careActions: CareAction[];
  feedingPresets: FeedingPreset[];
  icon: string;
}

export interface SpeciesMeta {
  icon: string;
  tagline: string;
}

// Presentation metadata keyed by species slug; unknown species fall back to a
// neutral sprout. The tagline is a short one-liner shown on the browser cards.
const SPECIES_META: Record<string, SpeciesMeta> = {
  cannabis: { icon: 'cannabis', tagline: 'Photoperiod and autoflowering, seed to cure.' },
  tomato: { icon: 'sprout', tagline: 'Determinate and indeterminate fruiting crops.' },
  basil: { icon: 'leaf', tagline: 'Fast-turnaround leafy herb.' },
};

function speciesMeta(slug: string): SpeciesMeta {
  return SPECIES_META[slug] ?? { icon: 'sprout', tagline: 'GrowRig crop definition.' };
}

let cache: Species[] | null = null;

/** Summarise a `feedings.yaml`'s presets without loading every weekly dose. */
function loadFeedingPresets(dir: string): FeedingPreset[] {
  const feedingsPath = path.join(dir, 'feedings.yaml');
  if (!existsSync(feedingsPath)) return [];
  const data = parseYaml(readFileSync(feedingsPath, 'utf8')) ?? {};
  const presets: any[] = Array.isArray(data.presets) ? data.presets : [];
  return presets.map((preset) => {
    const phases: any[] = Array.isArray(preset.phases) ? preset.phases : [];
    const weekCount = phases.reduce(
      (total, phase) => total + (Array.isArray(phase.weeks) ? phase.weeks.length : 0),
      0,
    );
    return {
      id: String(preset.id),
      name: String(preset.name ?? preset.id),
      brand: preset.brand ? String(preset.brand) : undefined,
      description: preset.description ? String(preset.description).trim() : undefined,
      unit: preset.unit ? String(preset.unit) : undefined,
      productCount: Array.isArray(preset.products) ? preset.products.length : 0,
      weekCount,
    };
  });
}

/** Read every `species/<id>/species.yaml` (+ optional `feedings.yaml`). */
export function loadSpecies(): Species[] {
  if (!import.meta.env.DEV && cache) return cache;

  const root = resolveSpeciesRoot();
  const species: Species[] = [];

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const dir = path.join(root, slug);
    const yamlPath = path.join(dir, 'species.yaml');
    if (!existsSync(yamlPath)) continue;

    const data = parseYaml(readFileSync(yamlPath, 'utf8')) ?? {};

    const stages: Stage[] = (Array.isArray(data.stages) ? data.stages : []).map((stage: any) => ({
      name: String(stage.name),
      lightHours: Number(stage.lightHours ?? 0),
    }));

    const cultivarAttributes: CultivarAttribute[] = (
      Array.isArray(data.cultivarAttributes) ? data.cultivarAttributes : []
    ).map((attr: any) => ({
      key: String(attr.key),
      label: String(attr.label ?? attr.key),
      type: String(attr.type ?? 'text'),
      options: Array.isArray(attr.options) ? attr.options.map(String) : undefined,
      unit: attr.unit ? String(attr.unit) : undefined,
    }));

    const careActions: CareAction[] = (Array.isArray(data.careActions) ? data.careActions : []).map(
      (action: any) => ({
        key: String(action.key),
        label: String(action.label ?? action.key),
        icon: String(action.icon ?? 'list-plus'),
        fields: Array.isArray(action.fields) ? action.fields.map(String) : [],
        quick: Boolean(action.quick),
      }),
    );

    species.push({
      slug,
      label: String(data.label ?? slug),
      stages,
      cultivarAttributes,
      careActions,
      feedingPresets: loadFeedingPresets(dir),
      icon: speciesMeta(slug).icon,
    });
  }

  species.sort((a, b) => a.label.localeCompare(b.label));
  if (!import.meta.env.DEV) cache = species;
  return species;
}

export function findSpecies(slug: string): Species | undefined {
  return loadSpecies().find((s) => s.slug === slug);
}

export function speciesTagline(slug: string): string {
  return speciesMeta(slug).tagline;
}

export function totalSpeciesCount(): number {
  return loadSpecies().length;
}
