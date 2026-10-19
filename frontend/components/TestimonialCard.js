const ROLE_LABEL = { parent: 'Parent', student: 'Student', alumni: 'Alumnus/Alumna' };

export default function TestimonialCard({ item }) {
  return (
    <div className="bg-white rounded-card border border-line p-6 h-full flex gap-4 shadow-card">
      <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark text-white font-display font-bold text-xl flex items-center justify-center ring-4 ring-gold/15">
        {item.name?.[0] || 'M'}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-0.5 mb-2 text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="13" height="13" viewBox="0 0 20 20" fill={i < (item.rating || 5) ? 'currentColor' : 'none'} stroke="currentColor">
              <path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3.1 1.4-6.3-4.8-4.3 6.4-.6z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-ink/80 leading-relaxed flex-1 line-clamp-4">&ldquo;{item.content}&rdquo;</p>
        <div className="mt-4">
          <div className="font-display font-semibold text-sm text-navy">{item.name}</div>
          <div className="text-xs text-red">{ROLE_LABEL[item.role] || item.role}</div>
        </div>
      </div>
    </div>
  );
}
