import Button from './Button';
import { mediaUrl } from '@/lib/media';
import SealBadge from './SealBadge';

const STATS = [
  { n: '25+', l: 'Years' },
  { n: '2000+', l: 'Students' },
  { n: '100+', l: 'Faculty' },
  { n: '98%', l: 'Board Results' },
];

export default function Hero({ banners, settings }) {
  const list = Array.isArray(banners) ? banners.filter((b) => b.isActive) : [];
  // All three collage photos come from the ONE active banner (the lowest-
  // order active record) — not three separate banners. Keeps "one banner"
  // and "the 3 photos in its hero tile" the same editable unit in the admin
  // panel, instead of splicing together unrelated banner records.
  const banner = list[0];

  const title = banner?.title || settings?.schoolName || 'M.R. Vivekananda Public School';
  const subtitle = banner?.subtitle || 'Nurturing Character, Curiosity, and Confidence — the MRVPS Way.';
  const image = mediaUrl(banner?.imageUrl);
  const image2 = mediaUrl(banner?.imageUrl2);
  const image3 = mediaUrl(banner?.imageUrl3);

  return (
    <div className="relative overflow-hidden bg-paper2">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #A31621 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      <div className="pointer-events-none absolute -left-24 -top-24 w-80 h-80 rounded-full border border-red/10" />
      <div className="pointer-events-none absolute -left-10 -top-10 w-56 h-56 rounded-full border border-dashed border-gold/20" />

      <div className="container-max relative grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center pt-14 md:pt-20 pb-10">
        <div>
          <div className="eyebrow text-red mb-5 flex items-center gap-2">
            <span className="w-8 h-px bg-red inline-block" />
            {settings?.board || 'CBSE'} Affiliated &middot; New Delhi
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.06] text-ink">
            {title}
          </h1>
          <p className="mt-6 text-lg text-slate leading-relaxed max-w-lg">{subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href={banner?.ctaLink || '/admission'}>{banner?.ctaText || 'Apply for Admission'}</Button>
            <Button href="/about" variant="outline">Explore the School</Button>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-5 grid-rows-6 gap-3 h-[420px] md:h-[460px]">
            <div className="col-span-3 row-span-4 rounded-card overflow-hidden border-4 border-white shadow-cardHover bg-white">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red/10 to-gold/10">
                  <span className="font-display text-slate/60 text-sm text-center px-4">Campus / Students photo</span>
                </div>
              )}
            </div>
            <div className="col-span-2 row-span-3 rounded-card overflow-hidden border-4 border-white shadow-card bg-white">
              {image2 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image2} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/15 to-red/5">
                  <span className="font-display text-slate/50 text-xs text-center px-2">Activity photo</span>
                </div>
              )}
            </div>
            <div className="col-span-2 row-span-3 rounded-card overflow-hidden border-4 border-white shadow-card bg-white">
              {image3 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image3} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red/10 to-gold/15">
                  <span className="font-display text-slate/50 text-xs text-center px-2">Classroom photo</span>
                </div>
              )}
            </div>
            <div className="col-span-3 row-span-2 rounded-card overflow-hidden border border-line bg-ink flex items-center px-5">
              <SealBadge label="ADM" sublabel="2026-27" tone="gold" />
              <div className="ml-3">
                <div className="font-display font-bold text-white text-sm">Admissions Open</div>
                <div className="text-xs text-white/60">Pre-Primary to Senior Secondary</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline stat strip */}
      <div className="border-t border-line bg-white/60">
        <div className="container-max grid grid-cols-2 sm:grid-cols-4 divide-x divide-line">
          {STATS.map((s) => (
            <div key={s.l} className="text-center py-5">
              <div className="font-display font-bold text-2xl md:text-3xl text-red">{s.n}</div>
              <div className="eyebrow text-slate mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
