import Section from '@/components/Section';
import EmptyState from '@/components/EmptyState';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import { getBlogs } from '@/lib/api';
import PageHero from '@/components/PageHero';
import { SITE_NAME, absoluteUrl } from '@/lib/seo';
import { BLOG_CATEGORIES, categorySlug, categoryFromSlug } from '@/lib/blog';

const TABS = [{ key: '', label: 'All' }, ...BLOG_CATEGORIES.map((c) => ({ key: categorySlug(c), label: c }))];

export async function generateMetadata({ searchParams }) {
  const category = categoryFromSlug(searchParams?.category);
  const title = category ? `${category} Blog | ${SITE_NAME}` : `Blog | ${SITE_NAME}`;
  const description = category
    ? `${category} articles and stories from the ${SITE_NAME} blog.`
    : `Read the ${SITE_NAME} blog — school stories, achievements, celebrations, academics, parenting tips and announcements.`;
  const url = absoluteUrl(category ? `/blog?category=${categorySlug(category)}` : '/blog');
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description, siteName: SITE_NAME, locale: 'en_IN' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function BlogPage({ searchParams }) {
  const category = categoryFromSlug(searchParams?.category);
  const activeKey = category ? categorySlug(category) : '';
  const posts = (await getBlogs(category || undefined, 24)) || [];

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Stories, Insights & Updates from MRVPS"
        crumbs={[{ label: 'Blog' }]}
      />

      <Section bg="white">
        <div className="flex flex-wrap gap-2 mb-10">
          {TABS.map((t) => (
            <Link
              key={t.key || 'all'}
              href={t.key ? `/blog?category=${t.key}` : '/blog'}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeKey === t.key ? 'bg-red text-white border-red' : 'border-line text-slate hover:border-red hover:text-red'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {posts.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((item) => <BlogCard key={item._id} item={item} />)}
          </div>
        ) : (
          <EmptyState title="No blog posts yet" description="Check back soon, or try a different category." />
        )}
      </Section>
    </>
  );
}
