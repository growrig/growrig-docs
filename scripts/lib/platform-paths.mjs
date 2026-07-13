import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Prefer the sibling growrig-platform repo, then the bundled snapshot. */
export function resolvePlatformRoot() {
  const candidates = [
    process.env.GROWRIG_PLATFORM_DIR,
    path.resolve(repoRoot, '../growrig-platform'),
    path.resolve(repoRoot, 'source/growrig-platform'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isDirectory()) return candidate;
  }

  return null;
}

export function resolvePlatformWatchPaths(platformRoot) {
  return ['devices', 'vendors', 'inventory', 'integrations']
    .map((dir) => path.join(platformRoot, dir))
    .filter((candidate) => existsSync(candidate) && statSync(candidate).isDirectory());
}
