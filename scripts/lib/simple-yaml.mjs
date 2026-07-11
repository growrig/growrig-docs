// Small fallback parser for the current GrowRig device.yaml shape.
// The installed `yaml` package remains the normal parser; this exists so the
// generator can still be smoke-tested in constrained/offline environments.
export function parseSimpleDeviceYaml(source) {
  const lines = source.replaceAll('\r\n', '\n').split('\n');
  const result = {};
  let index = 0;

  const scalar = (raw) => {
    const value = raw.trim();
    if (value === '""' || value === "''") return '';
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    return value;
  };

  while (index < lines.length) {
    const line = lines[index];
    index += 1;
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (/^\s/.test(line)) continue;

    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();

    if (key === 'provides') {
      const items = [];
      let current;
      while (index < lines.length && (/^\s/.test(lines[index]) || !lines[index].trim())) {
        const nested = lines[index];
        index += 1;
        if (!nested.trim()) continue;
        const itemMatch = nested.match(/^\s*-\s+([^:]+):\s*(.*)$/);
        if (itemMatch) {
          current = { [itemMatch[1].trim()]: scalar(itemMatch[2]) };
          items.push(current);
          continue;
        }
        const propertyMatch = nested.match(/^\s+([^:]+):\s*(.*)$/);
        if (propertyMatch && current) current[propertyMatch[1].trim()] = scalar(propertyMatch[2]);
      }
      result.provides = items;
      continue;
    }

    if (rawValue === '>-' || rawValue === '>' || rawValue === '|-' || rawValue === '|') {
      const block = [];
      while (index < lines.length && (/^\s/.test(lines[index]) || !lines[index].trim())) {
        const nested = lines[index];
        index += 1;
        if (nested.trim()) block.push(nested.trim());
      }
      result[key] = rawValue.startsWith('>') ? block.join(' ') : block.join('\n');
      continue;
    }

    result[key] = scalar(rawValue);
  }

  return result;
}
