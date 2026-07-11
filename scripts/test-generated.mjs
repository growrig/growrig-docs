import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot } from './lib/paths.mjs';

const requiredFiles = [
  'src/content/docs/project/reference/concept.md',
  'src/content/docs/project/reference/architecture.md',
  'src/content/docs/project/reference/roadmap.md',
  'src/content/docs/devices/catalog/index.md',
  'src/content/docs/devices/catalog/controller/generic-esphome.md',
  'src/content/docs/devices/catalog/plug/tapo-p110.md',
];

for (const relativePath of requiredFiles) {
  await access(path.join(repoRoot, relativePath));
}

const catalog = await readFile(path.join(repoRoot, 'src/content/docs/devices/catalog/index.md'), 'utf8');
if (!catalog.includes('Tapo P110') || !catalog.includes('Generic ESPHome controller')) {
  throw new Error('Generated catalog is missing expected devices.');
}

const categories = await readdir(path.join(repoRoot, 'src/content/docs/devices/catalog'), {
  withFileTypes: true,
});
const categoryCount = categories.filter((entry) => entry.isDirectory()).length;
if (categoryCount < 5) {
  throw new Error(`Expected at least 5 generated device categories, found ${categoryCount}.`);
}

console.log(`Generated documentation smoke test passed (${categoryCount} categories).`);
