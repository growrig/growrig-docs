import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

// Astro runs dev/build from the project root, so cwd is a stable anchor even
// after this module is bundled into dist/ during the build.
const repoRoot = process.cwd();

/**
 * Candidate catalog roots, most-preferred first. The default content catalog
 * lives in its own repository, https://github.com/growrig/growrig-catalog,
 * which the platform also mounts as a git submodule at `growrig/catalog/`.
 *
 *   1. the sibling `growrig-catalog` checkout (local dev),
 *   2. the platform's `catalog/` submodule,
 *   3. a bundled snapshot in `source/growrig-catalog/` (used by CI),
 *   4. the pre-split platform layout, kept as a last-resort fallback.
 */
const CATALOG_ROOTS = [
  process.env.GROWRIG_CATALOG_DIR,
  path.resolve(repoRoot, '../growrig-catalog'),
  path.resolve(repoRoot, '../growrig/catalog'),
  path.resolve(repoRoot, 'source/growrig-catalog'),
  path.resolve(repoRoot, '../growrig'),
  path.resolve(repoRoot, 'source/growrig'),
].filter(Boolean) as string[];

function isDir(candidate: string): boolean {
  return existsSync(candidate) && statSync(candidate).isDirectory();
}

/**
 * Resolve a catalog content directory (e.g. `devices`, `species`). A per-kind
 * environment variable (e.g. `GROWRIG_DEVICES_DIR`) overrides discovery, so an
 * individual directory can be pointed anywhere.
 */
export function resolveCatalogDir(dir: string, envVar?: string): string {
  const override = envVar ? process.env[envVar] : undefined;
  const candidates = [override, ...CATALOG_ROOTS.map((root) => path.join(root, dir))].filter(
    Boolean,
  ) as string[];

  const found = candidates.find(isDir);
  if (found) return found;

  throw new Error(
    `Cannot find the GrowRig ${dir} catalog. Set ${envVar ?? 'GROWRIG_CATALOG_DIR'} or place growrig-catalog beside this repo. Checked:\n${candidates
      .map((c) => `  - ${c}`)
      .join('\n')}`,
  );
}
