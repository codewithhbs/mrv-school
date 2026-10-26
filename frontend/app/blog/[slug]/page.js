import Link from 'next/link';
import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import BlogCard from '@/components/BlogCard';
import { getBlogBySlug, getBlogs, getSettings } from '@/lib/api';
import { mediaUrl } from '@/lib/media';
import RichContent from '@/lib/richHtml';
import { SITE_NAME, absoluteUrl, isHtml, htmlToText, truncate, decodeEntities, jsonLd } from '@/lib/seo';
import { blogDate, blogPath, categorySlug, formatBlogDate, readingTime } from '@/lib/blog';
import { notFound } from 'next/navigation';

function canonicalFor(item) {
  const c = (item.canonicalUrl || '').trim();
  if (c) return absoluteUrl(c);
  return absoluteUrl(blogPath(item));
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

function keywordsFor(item) {
  return [...new Set([item.focusKeyword, ...(item.metaKeywords || []), ...(item.tags || [])].filter(Boolean).map(decodeEntities))];
}

export async function generateMetadata({ params }) {
  const item = await getBlogBySlug(params.slug);
  if (!item || item.isPublished === false) {
    return { title: 'Not found', robots: { index: false, follow: false } };
  }

  const { title, description, image } = seoFields(item);
  const url = canonicalFor(item);
  const keywords = keywordsFor(item);
  const images = image ? [{ url: image, width: 1200, height: 630, alt: decodeEntities(item.imageAlt || item.title) }] : undefined;

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    authors: item.author ? [{ name: item.author }] : undefined,
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
      publishedTime: blogDate(item),
      modifiedTime: item.updatedAt,
      authors: item.author ? [item.author] : undefined,
      section: item.category,
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
  const pageUrl = absoluteUrl(blogPath(item));
  const keywords = keywordsFor(item);
  const org = {
    '@type': 'EducationalOrganization',
    name: settings?.schoolName || SITE_NAME,
    url: absoluteUrl('/'),
    ...(settings?.logoUrl ? { logo: { '@type': 'ImageObject', url: mediaUrl(settings.logoUrl) } } : {}),
  };

  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: truncate(title, 110),
    description,
    ...(image ? { image: [image] } : {}),
    datePublished: blogDate(item),
    dateModified: item.updatedAt || blogDate(item),
    author: item.author && item.author !== 'MRVPS Team' ? { '@type': 'Person', name: item.author } : org,
    publisher: org,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    ...(item.category ? { articleSection: item.category } : {}),
    ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
      { '@type': 'ListItem', position: 3, name: decodeEntities(item.title), item: pageUrl },
    ],
  };

  return [article, breadcrumb];
}

export default async function BlogDetail({ params }) {
  const [item, settings] = await Promise.all([getBlogBySlug(params.slug), getSettings()]);
  if (!item || item.isPublished === false) notFound();

  const sameCategory = item.category ? (await getBlogs(item.category, 4)) || [] : [];
  let related = sameCategory.filter((p) => p.slug !== item.slug);
  if (related.length < 3) {
    const latest = (await getBlogs(undefined, 6)) || [];
    const seen = new Set([item.slug, ...related.map((p) => p.slug)]);
    related = [...related, ...latest.filter((p) => !seen.has(p.slug))];
  }
  related = related.slice(0, 3);

  const date = blogDate(item);
  const dateStr = formatBlogDate(date);
  const body = item.content || item.summary || '';
  const mins = readingTime(body);

  return (
    <>
      {buildSchema(item, settings).map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      ))}

      <PageHero
        eyebrow={`${item.category || 'Blog'}${dateStr ? ` · ${dateStr}` : ''}`}
        title={decodeEntities(item.title)}
        crumbs={[{ label: 'Blog', href: absoluteUrl('/blog') }, { label: decodeEntities(item.title) }]}
      />
      <Section bg="white">
        <article className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate mb-6">
            {item.author && <span>By <strong className="text-ink">{item.author}</strong></span>}
            {date && <><span aria-hidden>·</span><time dateTime={new Date(date).toISOString()}>{dateStr}</time></>}
            <span aria-hidden>·</span>
            <span>{mins} min read</span>
            {item.category && (
              <Link href={`/blog?category=${categorySlug(item.category)}`} className="ml-auto text-xs font-semibold uppercase tracking-wider bg-paper text-navy px-3 py-1 rounded-full hover:text-red">
                {item.category}
              </Link>
            )}
          </div>

          {item.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl(item.image)}
              alt={decodeEntities(item.imageAlt || item.title)}
              className="w-full rounded-card border border-line mb-8"
            />
          )}

          {isHtml(body) ? (
            // Content is sanitized server-side (backend/src/middleware/richText.js) before it is stored.
            <RichContent html={body} />
          ) : (
            <div className="text-slate leading-relaxed whitespace-pre-line">{decodeEntities(body)}</div>
          )}

          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-line">
              {item.tags.map((t) => (
                <span key={t} className="text-xs text-slate bg-paper border border-line px-3 py-1 rounded-full">#{t}</span>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Link href="/blog" className="text-sm font-semibold text-red hover:text-red-dark">← Back to all blogs</Link>
          </div>
        </article>
      </Section>

      {related.length > 0 && (
        <Section bg="paper2">
          <h2 className="font-display font-bold text-2xl text-navy mb-8">You May Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => <BlogCard key={p._id} item={p} />)}
          </div>
        </Section>
      )}
    </>
  );
}
