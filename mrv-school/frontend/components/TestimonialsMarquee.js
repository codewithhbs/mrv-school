'use client';

import TestimonialCard from './TestimonialCard';

export default function TestimonialsMarquee({ items }) {
  // duplicate list so the scroll loop looks seamless
  const looped = [...items, ...items];

  return (
    <div className="relative overflow-hidden group">
      {/* fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="flex gap-6 w-max animate-marquee group-hover:[animation-play-state:paused]">
        {looped.map((t, i) => (
          <div key={`${t._id}-${i}`} className="w-[320px] shrink-0">
            <TestimonialCard item={t} />
          </div>
        ))}
      </div>
    </div>
  );
}