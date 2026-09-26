// Public website origin — used for SEO previews (Google snippet, canonical defaults).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mrvpublicschool.com').replace(/\/+$/, '');

export function slugify(str) {
  return String(str || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function htmlToText(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const esc = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Block-based page content → HTML, only so the SEO analyser can read it.
export function blocksToHtml(blocks) {
  if (!Array.isArray(blocks)) return '';
  return [...blocks]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(({ type, data = {} }) => {
      switch (type) {
        case 'heading': return `<h2>${esc(data.text)}</h2>`;
        case 'paragraph': return `<p>${esc(data.text)}</p>`;
        case 'quote': return `<blockquote>${esc(data.text)}</blockquote>`;
        case 'list': return `<ul>${(data.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
        case 'image': return `<img src="${esc(data.url)}" alt="${esc(data.alt || data.caption)}">`;
        case 'table':
          return `<table>${[data.headers || [], ...(data.rows || [])]
            .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
            .join('')}</table>`;
        case 'cta': return `<p>${esc(data.label)}</p>`;
        default: return '';
      }
    })
    .join('');
}

// CMS page slug → public URL path, e.g. "about-history" (group "about") → "/about/history".
export function cmsPagePath(slug, group) {
  const s = String(slug || '');
  if (group && s.startsWith(`${group}-`)) return `/${group}/${s.slice(group.length + 1)}`;
  return `/${s || 'your-page'}`;
}
