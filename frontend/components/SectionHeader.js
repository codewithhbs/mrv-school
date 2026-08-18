export default function SectionHeader({ eyebrow, title, description, align = 'left' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : '';
  return (
    <div className={`max-w-2xl mb-12 ${alignClass}`}>
      {eyebrow && <div className="eyebrow text-red mb-3">{eyebrow}</div>}
      <h2 className={`font-display font-bold text-3xl md:text-4xl leading-tight ${title == 'Everything You Need, One Click Away' ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {description && <p className="mt-4 text-slate leading-relaxed">{description}</p>}
    </div>
  );
}
