import SealBadge from './SealBadge';

const ROLE_LABEL = { parent: 'Parent', student: 'Student', alumni: 'Alumnus/Alumna' };

export default function TestimonialCard({ item }) {
  return (
    <div className="bg-white rounded-card border border-line p-7 h-full flex flex-col">
      <div className="flex items-center gap-1 mb-4 text-gold">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={i < (item.rating || 5) ? 'currentColor' : 'none'} stroke="currentColor">
            <path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3.1 1.4-6.3-4.8-4.3 6.4-.6z" />
          </svg>
        ))}
      </div>
      <p className="text-ink leading-relaxed flex-1">&ldquo;{item.content}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3">
        <SealBadge label={item.name?.[0] || 'M'} size="sm" tone="red" />
        <div>
          <div className="font-display font-semibold text-sm text-ink">{item.name}</div>
          <div className="eyebrow text-slate">{ROLE_LABEL[item.role] || item.role}</div>
        </div>
      </div>
    </div>
  );
}
