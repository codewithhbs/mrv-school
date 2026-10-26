// Keep in sync with backend/src/models/Blog.js (BLOG_CATEGORIES).
export const BLOG_CATEGORIES = [
  'General', 'Academics', 'Achievements', 'Sports', 'Events', 'Celebrations',
  'Admissions', 'Parenting', 'Student Life', 'Announcements',
];

export const categorySlug = (c) => String(c || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const categoryFromSlug = (slug) => BLOG_CATEGORIES.find((c) => categorySlug(c) === slug) || null;

export const blogPath = (post) => `/blog/${post.slug}`;

export const blogDate = (post) => post.publishedAt || post.createdAt;

export function formatBlogDate(date) {
  return date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
}

export function readingTime(html) {
  const words = String(html || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
