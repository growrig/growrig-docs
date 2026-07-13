import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Prefer the sibling growrig-catalog checkout, then the platform's catalog
 * submodule, then the bundled snapshot, then the pre-split platform layout.
 */
export function resolveCatalogRoot() {
  const candidates = [
    process.env.GROWRIG_CATALOG_DIR,
    path.resolve(repoRoot, '../growrig-catalog'),
    path.resolve(repoRoot, '../growrig/catalog'),
    path.resolve(repoRoot, 'source/growrig-catalog'),
    path.resolve(repoRoot, '../growrig'),
    path.resolve(repoRoot, 'source/growrig'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isDirectory()) return candidate;
  }

  return null;
}

export function resolveCatalogWatchPaths(catalogRoot) {
  return ['devices', 'vendors', 'inventory', 'integrations', 'species']
    .map((dir) => path.join(catalogRoot, dir))
    .filter((candidate) => existsSync(candidate) && statSync(candidate).isDirectory());
}
