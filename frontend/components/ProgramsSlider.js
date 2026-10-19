'use client';

import Link from 'next/link';
import { useRef } from 'react';

const ICON_BG = ['bg-accent-sky', 'bg-[#7B5CF0]', 'bg-red', 'bg-accent-teal', 'bg-[#8E44C9]'];

export default function ProgramsSlider({ items }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth / 2), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button onClick={() => scroll(-1)} aria-label="Previous" className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white text-navy shadow-card items-center justify-center hover:bg-gold transition-colors">‹</button>
      <div ref={ref} className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1">
        {items.map((p, i) => (
          <Link
            key={p.key}
            href={p.href}
            className="group snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-[calc(25%-16px)] bg-white rounded-card p-2.5 hover:-translate-y-1 transition-transform"
          >
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-paper">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-50 to-paper2" />
                )}
              </div>
              <span className={`absolute left-3 bottom-0 translate-y-1/2 w-10 h-10 rounded-full ${ICON_BG[i % ICON_BG.length]} text-white ring-4 ring-white flex items-center justify-center`}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.9V17h2V9L12 3zM5 13.2v4L12 21l7-3.8v-4L12 17l-7-3.8z" /></svg>
              </span>
            </div>
            <div className="px-1.5 pt-7 pb-2">
              <h3 className="font-display font-semibold text-sm text-navy group-hover:text-red transition-colors">{p.title}</h3>
              <p className="text-xs text-slate mt-1 line-clamp-1">{p.sub}</p>
            </div>
          </Link>
        ))}
      </div>
      <button onClick={() => scroll(1)} aria-label="Next" className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white text-navy shadow-card items-center justify-center hover:bg-gold transition-colors">›</button>
    </div>
  );
}