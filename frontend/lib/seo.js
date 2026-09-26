// SEO helpers shared by public pages.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mrvpublicschool.com').replace(/\/+$/, '');
export const SITE_NAME = 'M.R. Vivekananda Public School';

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function isHtml(str) {
  return /<\/?[a-z][\s\S]*>/i.test(str || '');
}

export function htmlToText(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(str, max = 160) {
  const s = String(str || '').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20))}…`;
}

// xss-clean on the API escapes "<" in plain-text fields; undo that for display/meta.
export function decodeEntities(str) {
  return String(str || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

// Safe JSON-LD serialisation for a <script> tag.
export function jsonLd(data) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
