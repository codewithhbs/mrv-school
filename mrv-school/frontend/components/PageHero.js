import Breadcrumb from './Breadcrumb';

export default function PageHero({ title, eyebrow, description, crumbs }) {
  return (
    <div className="relative bg-ink text-white overflow-hidden">
      {/* subtle seal-motif backdrop */}
      <div className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-6 -top-6 w-56 h-56 rounded-full border border-dashed border-white/10" />

      <div className="container-max relative py-10 md:py-14">
        <Breadcrumb crumbs={crumbs} />
        {eyebrow && <div className="eyebrow text-gold mt-5">{eyebrow}</div>}
        <h1 className="font-display font-bold text-3xl md:text-[2.6rem] mt-2 leading-tight max-w-2xl">{title}</h1>
        <div className="w-16 h-1 bg-gold rounded-full mt-5" />
        {description && <p className="mt-5 text-white/70 max-w-xl leading-relaxed">{description}</p>}
      </div>
    </div>
  );
}
