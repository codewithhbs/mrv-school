import Link from 'next/link';
import { mediaUrl } from '@/lib/media';
import { absoluteUrl } from '@/lib/seo';

const TYPE_LABEL = { news: 'News', event: 'Event', circular: 'Circular', holiday: 'Holiday', achievement: 'Achievement' };

export default function NewsCard({ item }) {
  const date = item.eventDate || item.publishedAt || item.createdAt;
  const d = date ? new Date(date) : null;
  const day = d ? d.toLocaleDateString('en-IN', { day: '2-digit' }) : '';
  const mon = d ? d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase() : '';

  return (
    <Link href={absoluteUrl(`/news-events/${item.slug}`)} className="group flex flex-col h-full bg-white rounded-card border border-line overflow-hidden shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-200">
      <div className="relative aspect-[16/10] bg-paper overflow-hidden">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(item.image)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate/50 font-display">MRVPS</div>
        )}
        {d && (
          <div className="absolute left-3 bottom-3 w-12 rounded-lg bg-navy text-white text-center py-1.5 shadow-card">
            <div className="font-display font-bold text-lg leading-none">{day}</div>
            <div className="text-[9px] tracking-wider mt-0.5 text-gold-light">{mon}</div>
          </div>
        )}
        <span className="absolute right-3 top-3 text-[10px] font-semibold uppercase tracking-wider bg-white/90 text-navy px-2.5 py-1 rounded-full">
          {TYPE_LABEL[item.type] || 'Update'}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-[15px] text-navy leading-snug line-clamp-2 group-hover:text-red transition-colors">{item.title}</h3>
        {item.summary && <p className="mt-1.5 text-sm text-slate line-clamp-2">{item.summary}</p>}
        <span className="mt-auto pt-3 text-xs font-semibold text-red">Read More →</span>
      </div>
    </Link>
  );
}
