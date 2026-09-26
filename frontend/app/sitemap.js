import { getAllNewsEventsForSitemap, getAllPagesForSitemap } from '@/lib/api';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

const STATIC_ROUTES = [
  '/', '/about', '/about/history', '/about/vision-mission', '/about/chairmans-message', '/about/principals-message',
  '/about/leadership', '/about/infrastructure', '/about/rules-policies',
  '/academics', '/academics/methodology', '/academics/examinations', '/academics/calendar',
  '/admission', '/admission/fees', '/admission/scholarships', '/admission/faq',
  '/facilities', '/faculty', '/gallery', '/news-events', '/student-life', '/students-corner', '/parents-corner',
  '/downloads', '/careers', '/alumni', '/contact',
];

// "about-history" (group "about") → "/about/history"
function cmsPagePath(p) {
  if (p.group && p.slug?.startsWith(`${p.group}-`)) return `/${p.group}/${p.slug.slice(p.group.length + 1)}`;
  return `/${p.slug}`;
}

export default async function sitemap() {
  const now = new Date();
  const cmsPages = (await getAllPagesForSitemap()) || [];
  const cmsByPath = new Map(cmsPages.map((p) => [cmsPagePath(p), p]));
  const excluded = (p) =>
    p && (p.noIndex || p.isPublished === false || (p.canonicalUrl && absoluteUrl(p.canonicalUrl) !== absoluteUrl(cmsPagePath(p))));

  const staticEntries = STATIC_ROUTES.filter((path) => !excluded(cmsByPath.get(path))).map((path) => ({
    url: absoluteUrl(path),
    lastModified: cmsByPath.get(path)?.updatedAt ? new Date(cmsByPath.get(path).updatedAt) : now,
    changeFrequency: path === '/' || path === '/news-events' ? 'daily' : 'monthly',
    priority: path === '/' ? 1 : path === '/admission' || path === '/news-events' ? 0.9 : 0.7,
  }));

  const news = (await getAllNewsEventsForSitemap())
    .filter((n) => n.slug && !n.noIndex && (!n.canonicalUrl || absoluteUrl(n.canonicalUrl) === absoluteUrl(`/news-events/${n.slug}`)))
    .map((n) => ({
      url: absoluteUrl(`/news-events/${n.slug}`),
      lastModified: new Date(n.updatedAt || n.publishedAt || n.createdAt || now),
      changeFrequency: 'weekly',
      priority: n.isFeatured ? 0.8 : 0.6,
    }));

  return [...staticEntries, ...news];
}
