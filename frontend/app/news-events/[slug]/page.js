import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import { getNewsEventBySlug, getSettings } from '@/lib/api';
import { mediaUrl } from '@/lib/media';
import RichContent from '@/lib/richHtml';
import { SITE_NAME, absoluteUrl, isHtml, htmlToText, truncate, decodeEntities, jsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';

const TYPE_LABEL = { news: 'News', event: 'Event', circular: 'Circular', holiday: 'Holiday', achievement: 'Achievement' };

function canonicalFor(item) {
  const c = (item.canonicalUrl || '').trim();
  if (c) return absoluteUrl(c);
  return absoluteUrl(`/news-events/${item.slug}`);
}

function seoFields(item) {
  const title = decodeEntities(item.metaTitle || item.title);
  const description = truncate(
    decodeEntities(item.metaDescription || item.summary || htmlToText(item.content)),
    160
  );
  const image = mediaUrl(item.ogImage || item.image);
  return { title, description, image };
}

export async function generateMetadata({ params }) {
  const item = await getNewsEventBySlug(params.slug);
  if (!item || item.isPublished === false) {
    return { title: 'Not found', robots: { index: false, follow: false } };
  }

  const { title, description, image } = seoFields(item);
  const url = canonicalFor(item);
  const keywords = [...new Set([item.focusKeyword, ...(item.metaKeywords || [])].filter(Boolean).map(decodeEntities))];
  const images = image ? [{ url: image, width: 1200, height: 630, alt: decodeEntities(item.imageAlt || item.title) }] : undefined;

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    robots: item.noIndex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images,
      publishedTime: item.publishedAt || item.createdAt,
      modifiedTime: item.updatedAt,
      section: TYPE_LABEL[item.type],
      tags: keywords.length ? keywords : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function buildSchema(item, settings) {
  const { title, description, image } = seoFields(item);
  const pageUrl = absoluteUrl(`/news-events/${item.slug}`);
  const org = {
    '@type': 'EducationalOrganization',
    name: settings?.schoolName || SITE_NAME,
    url: absoluteUrl('/'),
    ...(settings?.logoUrl ? { logo: mediaUrl(settings.logoUrl) } : {}),
  };

  const main =
    item.type === 'event' && item.eventDate
      ? {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: title,
          description,
          startDate: item.eventDate,
          ...(item.eventEndDate ? { endDate: item.eventEndDate } : {}),
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: item.location || settings?.schoolName || SITE_NAME,
            ...(settings?.address ? { address: settings.address } : {}),
          },
          ...(image ? { image: [image] } : {}),
          organizer: org,
          url: pageUrl,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: truncate(title, 110),
          description,
          ...(image ? { image: [image] } : {}),
          datePublished: item.publishedAt || item.createdAt,
          dateModified: item.updatedAt || item.publishedAt || item.createdAt,
          author: org,
          publisher: org,
          mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
          ...(item.focusKeyword || item.metaKeywords?.length
            ? { keywords: [item.focusKeyword, ...(item.metaKeywords || [])].filter(Boolean).join(', ') }
            : {}),
        };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'News & Events', item: absoluteUrl('/news-events') },
      { '@type': 'ListItem', position: 3, name: decodeEntities(item.title), item: pageUrl },
    ],
  };

  return [main, breadcrumb];
}

export default async function NewsEventDetail({ params }) {
  const [item, settings] = await Promise.all([getNewsEventBySlug(params.slug), getSettings()]);
  if (!item || item.isPublished === false) notFound();

  const date = item.eventDate || item.publishedAt || item.createdAt;
  const dateStr = date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
  const body = item.content || item.summary || '';

  return (
    <>
      {buildSchema(item, settings).map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      ))}

      <PageHero
        eyebrow={`${TYPE_LABEL[item.type] || 'Update'}${dateStr ? ` · ${dateStr}` : ''}`}
        title={decodeEntities(item.title)}
        crumbs={[{ label: 'News & Events', href: absoluteUrl('/news-events') }, { label: decodeEntities(item.title) }]}
      />
      <Section bg="white">
        <article className="max-w-3xl mx-auto">
          {item.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl(item.image)}
              alt={decodeEntities(item.imageAlt || item.title)}
              className="w-full rounded-card border border-line mb-8"
            />
          )}
          {date && <time dateTime={new Date(date).toISOString()} className="sr-only">{dateStr}</time>}
          {item.location && <p className="text-sm text-slate mb-4"><strong className="text-ink">Location:</strong> {item.location}</p>}

          {isHtml(body) ? (
            // Content is sanitized server-side (backend/src/middleware/richText.js) before it is stored.
            <RichContent html={body} />
          ) : (
            <div className="text-slate leading-relaxed whitespace-pre-line">{decodeEntities(body)}</div>
          )}

          {item.attachmentUrl && (
            <a href={mediaUrl(item.attachmentUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex mt-6 px-6 py-3 rounded-full bg-red text-white font-semibold text-sm hover:bg-red-dark transition-colors">
              Download Attachment
            </a>
          )}
        </article>
      </Section>
    </>
  );
}
