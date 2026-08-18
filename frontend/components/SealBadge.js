// Signature medallion motif — used for admissions status, affiliation,
// achievements, and rating displays throughout the site.
export default function SealBadge({ label, sublabel, tone = 'red', size = 'md' }) {
  const toneClass = tone === 'gold' ? 'text-gold border-gold' : 'text-red border-red';
  const sizeClass = size === 'lg' ? 'w-24 h-24' : size === 'sm' ? 'w-12 h-12' : 'w-16 h-16';
  return (
    <div className={`seal ${sizeClass} ${toneClass} bg-white flex-col text-center px-1`}>
      <span className="font-display font-bold leading-none text-sm">{label}</span>
      {sublabel && <span className="font-mono text-[9px] mt-0.5 opacity-80">{sublabel}</span>}
    </div>
  );
}
