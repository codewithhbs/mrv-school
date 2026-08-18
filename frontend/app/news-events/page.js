import Section from '@/components/Section';
import EmptyState from '@/components/EmptyState';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import { getNewsEvents } from '@/lib/api';
import PageHero from '@/components/PageHero';

const TABS = [
  { key: '', label: 'All' },
  { key: 'news', label: 'News' },
  { key: 'event', label: 'Events' },
  { key: 'circular', label: 'Circulars' },
  { key: 'holiday', label: 'Holidays' },
  { key: 'achievement', label: 'Achievements' },
];

export default async function NewsEventsPage({ searchParams }) {
  const activeType = searchParams?.type || '';
  const items = await getNewsEvents(activeType || undefined, 24);

  return (
    <>
      <PageHero
        eyebrow="News & Events"
        title="Announcements, Circulars & What's Happening"
        crumbs={[{ label: 'News & Events' }]}
      />

      <Section bg="white">
        <div className="flex flex-wrap gap-2 mb-10">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={t.key ? `/news-events?type=${t.key}` : '/news-events'}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeType === t.key ? 'bg-red text-white border-red' : 'border-line text-slate hover:border-red hover:text-red'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {items?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => <NewsCard key={item._id} item={item} />)}
          </div>
        ) : (
          <EmptyState title="Nothing to show yet" description="Check back soon, or try a different category." />
        )}
      </Section>
    </>
  );
}
