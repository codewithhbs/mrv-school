import Link from 'next/link';
import { mediaUrl } from '@/lib/media';
import { absoluteUrl } from '@/lib/seo';

const FEATURES = [
  { label: 'Academic Excellence', color: 'bg-navy text-white', icon: <path d="M12 3L1 9l11 6 9-4.9V17h2V9L12 3zM5 13.2v4L12 21l7-3.8v-4L12 17l-7-3.8z" fill="currentColor" /> },
  { label: 'Strong Values', color: 'bg-accent-pink/10 text-accent-pink', icon: <path d="M12 21l-1.4-1.3C5.4 15 2 12 2 8.3 2 5.4 4.4 3 7.3 3c1.7 0 3.3.8 4.7 2.1C13.4 3.8 15 3 16.7 3 19.6 3 22 5.4 22 8.3c0 3.7-3.4 6.7-8.6 11.4L12 21z" fill="currentColor" /> },
  { label: 'Modern Facilities', color: 'bg-accent-teal/10 text-accent-teal', icon: <path d="M3 21V9l9-6 9 6v12h-6v-6H9v6H3z" fill="currentColor" /> },
  { label: 'Holistic Development', color: 'bg-gold/15 text-gold-dark', icon: <path d="M17 8C8 10 5.9 16.2 3.8 21.3l1.9.7.9-2.3c.5.2 1 .3 1.4.3C19 20 22 3 22 3c-1 2-8 2.3-13 3.3S2 11.5 2 13.5 3.8 17.3 3.8 17.3C7 8 17 8 17 8z" fill="currentColor" /> },
];

export default function Hero({ banners, settings }) {
  const list = Array.isArray(banners) ? banners.filter((b) => b.isActive) : [];
  const banner = list[0];

  const title = banner?.title || 'Nurturing Today, Leading Tomorrow';
  const subtitle =
    banner?.subtitle ||
    'Where every child learns, grows and achieves their dreams. We provide a safe, supportive and future-ready environment for holistic development.';
  const image = mediaUrl(banner?.imageUrl) || '/images/campus-photo.webp';

  // Highlight last word(s) after comma in gold, like "Leading <Tomorrow>"
  const words = title.split(' ');
  const last = words.pop();
  const lead = words.join(' ');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-paper to-[#EAF2FF]">
      {/* decorative */}
      <div className="pointer-events-none absolute -left-20 bottom-0 w-72 h-40 rounded-[50%] bg-gradient-to-tr from-red/80 to-accent-sky/40 blur-[2px] opacity-70 -rotate-12 translate-y-16" />
      <svg className="pointer-events-none absolute left-[42%] top-16 w-16 text-navy/30 hidden lg:block" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 40c10-18 26-24 44-20M44 14l8 6-9 4" strokeLinecap="round" strokeDasharray="4 5" />
      </svg>

      <div className="container-max relative grid lg:grid-cols-[1fr_1.05fr] gap-10 items-center pt-12 md:pt-16 pb-16 lg:pb-20">
        <div className="relative z-10">
          <div className="font-script text-2xl md:text-[28px] text-navy flex items-center gap-2">
            Building Bright Futures
            <svg className="w-6 h-6 text-navy/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinejoin="round" /></svg>
          </div>
          <h1 className="mt-2 font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] text-navy">
            {lead}{lead && ' '}<span className="text-gold">{last}</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-slate leading-relaxed max-w-lg">{subtitle}</p>

          <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5">
                <span className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${f.color}`}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5">{f.icon}</svg>
                </span>
                <span className="text-xs font-semibold text-navy leading-tight">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link href={banner?.ctaLink || absoluteUrl('/about')} className="inline-flex items-center gap-2 bg-gold text-ink font-semibold text-sm px-7 py-3.5 rounded-full shadow-card hover:bg-gold-dark hover:text-white transition-colors">
              {banner?.ctaText || 'Explore Our School'} <span aria-hidden>→</span>
            </Link>
            <Link href={absoluteUrl('/admission')} className="inline-flex items-center gap-2 border-2 border-navy/20 text-navy font-semibold text-sm px-6 py-3 rounded-full bg-white hover:border-navy transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
              Admissions Open
            </Link>
          </div>
        </div>

        <div className="relative">
          {/* gold swoosh */}
          <div className="absolute -inset-3 md:-inset-5 blob-mask border-[10px] border-gold/90 border-l-transparent border-b-transparent rotate-6" />
          <div className="relative blob-mask overflow-hidden aspect-[5/4] shadow-cardHover bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={settings?.schoolName || 'MRV Public School campus'} className="w-full h-full object-cover" />
          </div>
          {/* 25+ badge */}
          <div className="absolute -bottom-4 right-2 md:right-6 w-28 h-28 md:w-32 md:h-32 rounded-full bg-navy text-white border-4 border-gold/80 shadow-cardHover flex flex-col items-center justify-center text-center">
            <div className="font-display font-extrabold text-3xl md:text-4xl leading-none">25+</div>
            <div className="text-[10px] md:text-[11px] mt-1 leading-tight text-white/80">Years<br />of Excellence</div>
          </div>
        </div>
      </div>
    </section>
  );
}
