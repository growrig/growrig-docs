import { readdir, readFile, rm, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseSimpleDeviceYaml } from './lib/simple-yaml.mjs';

let parseYaml;
try {
  ({ parse: parseYaml } = await import('yaml'));
} catch {
  parseYaml = parseSimpleDeviceYaml;
}
import { repoRoot, resolveSourceDirectory, relativePosix } from './lib/paths.mjs';
import { escapeMarkdownCell, stripGuideTitle, yamlString } from './lib/markdown.mjs';

const outputRoot = path.join(repoRoot, 'src/content/docs/devices/catalog');

const categoryNames = {
  camera: 'Cameras',
  controller: 'Controllers',
  fan: 'Fans',
  light: 'Lights',
  plug: 'Smart plugs',
  sensor: 'Sensors',
  tent: 'Grow tents',
};

const categoryOrder = ['controller', 'sensor', 'fan', 'light', 'plug', 'camera', 'tent'];

const connectionNames = {
  ble: 'Bluetooth LE',
  esphome: 'ESPHome',
  generic: 'Generic / manually bound',
  wifi: 'Wi-Fi',
  'n/a': 'Not applicable',
};

function validateDevice(data, sourcePath) {
  const errors = [];
  for (const key of ['brand', 'model', 'connection']) {
    if (typeof data?.[key] !== 'string' || data[key].trim() === '') {
      errors.push(`\`${key}\` must be a non-empty string`);
    }
  }

  if (data?.provides !== undefined && !Array.isArray(data.provides)) {
    errors.push('`provides` must be an array');
  }

  for (const [index, capability] of (data?.provides ?? []).entries()) {
    for (const key of ['label', 'kind']) {
      if (typeof capability?.[key] !== 'string' || capability[key].trim() === '') {
        errors.push(`\`provides[${index}].${key}\` must be a non-empty string`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid device definition ${sourcePath}:\n- ${errors.join('\n- ')}`);
  }
}

async function collectDefinitions(devicesRoot) {
  const categories = await readdir(devicesRoot, { withFileTypes: true });
  const definitions = [];

  for (const categoryEntry of categories) {
    if (!categoryEntry.isDirectory()) continue;
    const category = categoryEntry.name;
    const categoryPath = path.join(devicesRoot, category);
    const devices = await readdir(categoryPath, { withFileTypes: true });

    for (const deviceEntry of devices) {
      if (!deviceEntry.isDirectory()) continue;
      const slug = deviceEntry.name;
      const directory = path.join(categoryPath, slug);
      const sourcePath = path.join(directory, 'device.yaml');

      try {
        const raw = await readFile(sourcePath, 'utf8');
        const data = parseYaml(raw);
        validateDevice(data, sourcePath);

        let guide;
        try {
          guide = await readFile(path.join(directory, 'guide.md'), 'utf8');
        } catch {
          guide = undefined;
        }

        definitions.push({ category, slug, directory, sourcePath, raw, data, guide });
      } catch (error) {
        if (error?.code === 'ENOENT') continue;
        throw error;
      }
    }
  }

  return definitions.sort((a, b) => {
    const categoryDifference = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    if (categoryDifference !== 0) return categoryDifference;
    return `${a.data.brand} ${a.data.model}`.localeCompare(`${b.data.brand} ${b.data.model}`);
  });
}

function pageTitle(device) {
  return `${device.data.brand} ${device.data.model}`;
}

function deviceDescription(device) {
  return device.data.description ?? `${pageTitle(device)} device definition for GrowRig.`;
}

function devicePage(device, devicesRoot) {
  const title = pageTitle(device);
  const definitionUrl = `https://github.com/growrig/growrig-platform/blob/main/devices/${device.category}/${device.slug}/device.yaml`;
  const categoryLabel = categoryNames[device.category] ?? device.category;
  const capabilities = device.data.provides ?? [];
  const capabilityRows = capabilities.length
    ? capabilities
        .map(
          (capability) =>
            `| ${escapeMarkdownCell(capability.label)} | \`${escapeMarkdownCell(capability.kind)}\` | ${escapeMarkdownCell(capability.measurement)} | ${escapeMarkdownCell(capability.entityDomain)} | ${escapeMarkdownCell(capability.deviceClass)} | ${escapeMarkdownCell(capability.role)} |`,
        )
        .join('\n')
    : '| — | — | — | — | — | — |';

  const integration = device.data.haIntegration
    ? `\`${device.data.haIntegration}\`${device.data.documentation ? ` — [integration documentation](${device.data.documentation})` : ''}`
    : 'No specific Home Assistant integration declared.';

  const guide = device.guide
    ? `\n\n## Setup and notes\n\n${stripGuideTitle(device.guide)}\n`
    : '';

  return `---\ntitle: ${yamlString(title)}\ndescription: ${yamlString(deviceDescription(device))}\nsidebar:\n  label: ${yamlString(title)}\n---\n\n${deviceDescription(device)}\n\n<div class="device-meta">\n  <code>${categoryLabel}</code>\n  <code>${connectionNames[device.data.connection] ?? device.data.connection}</code>\n  <code>${device.slug}</code>\n</div>\n\n## Compatibility metadata\n\n| Field | Value |\n| --- | --- |\n| Category | ${escapeMarkdownCell(categoryLabel)} |\n| Brand | ${escapeMarkdownCell(device.data.brand)} |\n| Model | ${escapeMarkdownCell(device.data.model)} |\n| Connection | ${escapeMarkdownCell(connectionNames[device.data.connection] ?? device.data.connection)} |\n| Definition version | ${escapeMarkdownCell(device.data.version)} |\n| Maintainer | ${escapeMarkdownCell(device.data.author)} |\n| Home Assistant | ${integration} |\n\n## Capabilities\n\n| Label | Kind | Measurement | Entity domain | Device class | Suggested role |\n| --- | --- | --- | --- | --- | --- |\n${capabilityRows}\n\n> A catalog entry means GrowRig has a machine-readable profile for this device or device class. It does not by itself claim electrical certification, agricultural validation, or compatibility with every hardware revision.\n\n[View the source definition](${definitionUrl})${guide}\n`;
}

function categoryIndex(category, devices) {
  const title = categoryNames[category] ?? category;
  const rows = devices
    .map(
      (device) =>
        `| [${escapeMarkdownCell(pageTitle(device))}](/devices/catalog/${category}/${device.slug}/) | ${escapeMarkdownCell(connectionNames[device.data.connection] ?? device.data.connection)} | ${escapeMarkdownCell((device.data.provides ?? []).map((item) => item.label).join(', '))} |`,
    )
    .join('\n');
  const order = Math.max(1, categoryOrder.indexOf(category) + 1);

  return `---\ntitle: ${yamlString(title)}\ndescription: ${yamlString(`${devices.length} GrowRig device definition${devices.length === 1 ? '' : 's'} in this category.`)}\nsidebar:\n  order: ${order}\n---\n\n| Device | Connection | Capabilities |\n| --- | --- | --- |\n${rows}\n`;
}

function catalogIndex(definitions) {
  const groups = Map.groupBy(definitions, (device) => device.category);
  const categoryRows = [...groups.entries()]
    .sort(([a], [b]) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b))
    .map(
      ([category, devices]) =>
        `| [${categoryNames[category] ?? category}](/devices/catalog/${category}/) | ${devices.length} | ${[...new Set(devices.map((device) => connectionNames[device.data.connection] ?? device.data.connection))].join(', ')} |`,
    )
    .join('\n');

  const allRows = definitions
    .map(
      (device) =>
        `| [${escapeMarkdownCell(pageTitle(device))}](/devices/catalog/${device.category}/${device.slug}/) | ${escapeMarkdownCell(categoryNames[device.category] ?? device.category)} | ${escapeMarkdownCell(connectionNames[device.data.connection] ?? device.data.connection)} | ${escapeMarkdownCell((device.data.provides ?? []).map((item) => item.label).join(', '))} |`,
    )
    .join('\n');

  return `---\ntitle: Device catalog\ndescription: Generated reference for device profiles currently defined by GrowRig Platform.\nsidebar:\n  order: 1\n---\n\nGenerated from \`${definitions.length}\` device definitions in \`growrig-platform/devices\`.\n\n## Categories\n\n| Category | Definitions | Connections |\n| --- | ---: | --- |\n${categoryRows}\n\n## All definitions\n\n| Device | Category | Connection | Capabilities |\n| --- | --- | --- | --- |\n${allRows}\n`;
}

export async function generateDeviceDocs() {
  const devicesRoot = await resolveSourceDirectory({
    envName: 'GROWRIG_DEVICES_DIR',
    siblingPath: '../growrig-platform/devices',
    fallbackPath: 'source/growrig-platform/devices',
    label: 'the GrowRig Platform device catalog',
  });
  const definitions = await collectDefinitions(devicesRoot);

  if (definitions.length === 0) {
    throw new Error(`No device definitions found under ${devicesRoot}`);
  }

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  await writeFile(path.join(outputRoot, 'index.md'), catalogIndex(definitions), 'utf8');

  const groups = Map.groupBy(definitions, (device) => device.category);
  for (const [category, devices] of groups.entries()) {
    const categoryDirectory = path.join(outputRoot, category);
    await mkdir(categoryDirectory, { recursive: true });
    await writeFile(path.join(categoryDirectory, 'index.md'), categoryIndex(category, devices), 'utf8');

    for (const device of devices) {
      await writeFile(path.join(categoryDirectory, `${device.slug}.md`), devicePage(device, devicesRoot), 'utf8');
    }
  }

  return {
    devicesRoot,
    count: definitions.length,
    categories: groups.size,
    sourcePaths: definitions.map((device) => relativePosix(devicesRoot, device.sourcePath)),
  };
}
