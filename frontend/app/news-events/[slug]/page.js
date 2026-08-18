import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import { getNewsEventBySlug } from '@/lib/api';
import { mediaUrl } from '@/lib/media';
import { notFound } from 'next/navigation';

const TYPE_LABEL = { news: 'News', event: 'Event', circular: 'Circular', holiday: 'Holiday', achievement: 'Achievement' };

export default async function NewsEventDetail({ params }) {
  const item = await getNewsEventBySlug(params.slug);
  if (!item) notFound();

  const date = item.eventDate || item.publishedAt || item.createdAt;
  const dateStr = date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <PageHero
        eyebrow={`${TYPE_LABEL[item.type] || 'Update'}${dateStr ? ` · ${dateStr}` : ''}`}
        title={item.title}
        crumbs={[{ label: 'News & Events', href: '/news-events' }, { label: item.title }]}
      />
      <Section bg="white">
        <div className="max-w-3xl mx-auto">
          {item.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(item.image)} alt={item.title} className="w-full rounded-card border border-line mb-8" />
          )}
          {item.location && <p className="text-sm text-slate mb-4"><strong className="text-ink">Location:</strong> {item.location}</p>}
          <div className="text-slate leading-relaxed whitespace-pre-line">{item.content || item.summary}</div>
          {item.attachmentUrl && (
            <a href={mediaUrl(item.attachmentUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex mt-6 px-6 py-3 rounded-full bg-red text-white font-semibold text-sm hover:bg-red-dark transition-colors">
              Download Attachment
            </a>
          )}
        </div>
      </Section>
    </>
  );
}
