// Publishes the catalog JSON Schemas at /schema/catalog/<name>.json so the
// $id and `# yaml-language-server: $schema=` URLs resolve on growrig.dev.
//
// The schemas are authored in YAML in the platform repo (growrig/schema/catalog/).
// This reads them, converts to JSON, and writes them into public/ before the
// Astro build copies public/ verbatim into the site.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const repoRoot = process.cwd();

function resolveSchemaDir() {
  const candidates = [
    process.env.GROWRIG_SCHEMA_DIR,
    path.resolve(repoRoot, '../growrig/schema/catalog'),
    path.resolve(repoRoot, '../growrig-platform/schema/catalog'),
    path.resolve(repoRoot, 'source/growrig/schema/catalog'),
  ].filter(Boolean);
  return candidates.find((c) => existsSync(c) && statSync(c).isDirectory());
}

const srcDir = resolveSchemaDir();
if (!srcDir) {
  console.warn('[build-schemas] catalog schema dir not found; skipping /schema/catalog publish');
  process.exit(0);
}

const outDir = path.resolve(repoRoot, 'public/schema/catalog');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

let count = 0;
for (const file of readdirSync(srcDir)) {
  if (!file.endsWith('.schema.yaml')) continue;
  const schema = parseYaml(readFileSync(path.join(srcDir, file), 'utf8'));
  const outName = file.replace(/\.schema\.yaml$/, '.json'); // device.schema.yaml -> device.json
  writeFileSync(path.join(outDir, outName), JSON.stringify(schema, null, 2) + '\n');
  count++;
}
console.log(`[build-schemas] published ${count} schema(s) to public/schema/catalog/`);
