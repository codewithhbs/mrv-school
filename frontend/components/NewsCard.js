import Link from 'next/link';
import { mediaUrl } from '@/lib/media';
import { absoluteUrl } from '@/lib/seo';

const TYPE_LABEL = { news: 'News', event: 'Event', circular: 'Circular', holiday: 'Holiday', achievement: 'Achievement' };

export default function NewsCard({ item }) {
  const date = item.eventDate || item.publishedAt || item.createdAt;
  const dateStr = date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  return (
    <Link href={absoluteUrl(`/news-events/${item.slug}`)} className="group block bg-white rounded-card border border-line overflow-hidden hover:shadow-cardHover transition-shadow duration-200">
      <div className="aspect-[16/10] bg-paper2 overflow-hidden">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(item.image)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate/50 font-display">MRVPS</div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="eyebrow text-red">{TYPE_LABEL[item.type] || 'Update'}</span>
          {dateStr && <span className="font-mono text-[11px] text-slate">&middot; {dateStr}</span>}
        </div>
        <h3 className="font-display font-semibold text-lg text-ink leading-snug group-hover:text-red transition-colors">
          {item.title}
        </h3>
        {item.summary && <p className="mt-2 text-sm text-slate line-clamp-2">{item.summary}</p>}
      </div>
    </Link>
  );
}
