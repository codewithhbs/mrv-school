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

export const DEFAULT_FAVICON = 'https://api.mrvpublicschool.com/uploads/1786537169042-f9dad1a72b9f289e.png';
export const SCHOOL_ADDRESS = '36B, Krishna Park Extn, New Mahavir Nagar, New Delhi, Delhi 110018';
export const GOOGLE_SITE_VERIFICATION = 'google49b6e607940dee24';

// Public URL of a CMS page: "about-history" (group "about") → "/about/history", else "/<slug>".
export function cmsPagePath(p) {
  if (!p?.slug) return '/';
  if (p.group && p.slug.startsWith(`${p.group}-`)) return `/${p.group}/${p.slug.slice(p.group.length + 1)}`;
  return `/${p.slug}`;
}

const DEFAULT_OG_IMAGE = 'https://api.mrvpublicschool.com/uploads/1786537169042-f9dad1a72b9f289e.png';

// Full metadata (title, description, self canonical, OG, Twitter) for static pages.
export function staticPageMeta(title, description, path, { noIndex = false } = {}) {
  const url = absoluteUrl(path);
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: 'website',
      url,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [DEFAULT_OG_IMAGE] },
  };
}
