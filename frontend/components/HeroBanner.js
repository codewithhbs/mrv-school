'use client';
import { useEffect, useState } from 'react';
import { mediaUrl } from '@/lib/media';

// Simple full-width banner slider — just the banner image(s), autoplay fade,
// no collage/stats/text. Uses all active banners (sorted by order already
// from the API) as slides.
export default function HeroBanner({ banners }) {
  const list = Array.isArray(banners) ? banners : [];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (list.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % list.length), 4500);
    return () => clearInterval(t);
  }, [list.length]);

  if (!list.length) return null;

  return (
    <div className="relative w-full h-[260px] sm:h-[380px] lg:h-[480px] overflow-hidden bg-paper2">
      {list.map((b, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={b._id || i}
          src={mediaUrl(b.imageUrl)}
          alt={b.title || ''}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      {list.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {list.map((b, i) => (
            <button
              key={b._id || i}
              onClick={() => setActive(i)}
              className={`w-2.5 h-2.5 rounded-full ${i === active ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
