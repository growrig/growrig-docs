import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function isDirectory(candidate) {
  try {
    await access(candidate);
    return true;
  } catch {
    return false;
  }
}

export async function resolveSourceDirectory({ envName, siblingPath, fallbackPath, label }) {
  const candidates = [
    process.env[envName],
    path.resolve(repoRoot, siblingPath),
    path.resolve(repoRoot, fallbackPath),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (await isDirectory(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `Cannot find ${label}. Set ${envName} or place the expected repository beside this one. Checked:\n${candidates
      .map((candidate) => `  - ${candidate}`)
      .join('\n')}`,
  );
}

export function relativePosix(from, to) {
  return path.relative(from, to).split(path.sep).join('/');
}
