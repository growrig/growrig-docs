export function yamlString(value) {
  return JSON.stringify(String(value));
}

export function titleFromMarkdown(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+?)\s*$/m);
  return match?.[1]?.trim() || fallback;
}

export function removeFirstHeading(markdown) {
  return markdown.replace(/^#\s+.+?\s*\n+/, '').trimStart();
}

export function descriptionFromMarkdown(markdown, fallback) {
  const body = removeFirstHeading(markdown);
  const paragraphs = body.split(/\n\s*\n/);

  for (const paragraph of paragraphs) {
    const candidate = paragraph
      .replace(/^```[\s\S]*?```$/m, '')
      .replace(/^[-*]\s+/gm, '')
      .replace(/^#+\s+/gm, '')
      .replace(/[`*_>[\]()]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (candidate.length >= 24) {
      return candidate.length > 180 ? `${candidate.slice(0, 177).trimEnd()}…` : candidate;
    }
  }

  return fallback;
}

export function escapeMarkdownCell(value) {
  if (value === undefined || value === null || value === '') return '—';
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

export function stripGuideTitle(markdown) {
  return markdown.replace(/^#\s+.+?\s*\n+/, '').trim();
}
