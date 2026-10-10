// Metadata + structured data for block-based CMS pages (About, Academics, …).
import { getPageBySlug, getSettings } from '@/lib/api';
import { mediaUrl } from '@/lib/media';
import { SITE_NAME, absoluteUrl, truncate, decodeEntities, jsonLd } from '@/lib/seo';

function blocksToText(blocks) {
  if (!Array.isArray(blocks)) return '';
  return [...blocks]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((b) => b.type === 'paragraph' || b.type === 'quote' || b.type === 'list')
    .map((b) => (b.type === 'list' ? (b.data?.items || []).join('. ') : b.data?.text || ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pageSeo(page, fallbackTitle, fallbackDescription) {
  const title = decodeEntities(page?.seoTitle || (page?.title ? `${page.title} | ${SITE_NAME}` : `${fallbackTitle} | ${SITE_NAME}`));
  const description = truncate(
    decodeEntities(page?.seoDescription || page?.subtitle || blocksToText(page?.blocks) || fallbackDescription || ''),
    160
  );
  const image = mediaUrl(page?.ogImage || page?.heroImage);
  return { title, description, image };
}

export async function cmsPageMetadata(slug, path, fallbackTitle, fallbackDescription) {
  const page = await getPageBySlug(slug);
  const { title, description, image } = pageSeo(page, fallbackTitle, fallbackDescription);
  const url = page?.canonicalUrl ? absoluteUrl(page.canonicalUrl) : absoluteUrl(path);
  const keywords = [...new Set([page?.focusKeyword, ...(page?.metaKeywords || [])].filter(Boolean).map(decodeEntities))];
  const noIndex = !!page?.noIndex || page?.isPublished === false;

  return {
    title,
    description: description || undefined,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    openGraph: {
      type: 'website',
      url,
      title,
      description: description || undefined,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: image ? [{ url: image, width: 1200, height: 630, alt: decodeEntities(page?.title || fallbackTitle) }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description: description || undefined,
      images: image ? [image] : undefined,
    },
  };
}

// WebPage + BreadcrumbList JSON-LD. `crumbs` = [{ label, href? }] as used by PageHero.
export async function CmsPageSchema({ page, path, title, crumbs = [] }) {
  const settings = await getSettings();
  const { description, image } = pageSeo(page, title);
  const url = absoluteUrl(path);
  const org = {
    '@type': 'EducationalOrganization',
    name: settings?.schoolName || SITE_NAME,
    url: absoluteUrl('/'),
    ...(settings?.logoUrl ? { logo: mediaUrl(settings.logoUrl) } : {}),
  };

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: decodeEntities(title),
    url,
    ...(description ? { description } : {}),
    ...(image ? { primaryImageOfPage: image } : {}),
    ...(page?.updatedAt ? { dateModified: page.updatedAt } : {}),
    inLanguage: 'en-IN',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl('/') },
    about: org,
  };

  const items = [{ label: 'Home', href: '/' }, ...crumbs];
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: decodeEntities(c.label),
      item: absoluteUrl(c.href || path),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(webPage)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
    </>
  );
}
