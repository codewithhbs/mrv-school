'use client';
import { useEffect, useRef, useState } from 'react';
import { mediaUrl } from '@/lib/media';

// Simple full-width banner slider — just the banner image(s), autoplay fade,
// no collage/stats/text. Uses all active banners (sorted by order already
// from the API) as slides.
export default function HeroBanner({ banners }) {
  const list = Array.isArray(banners) ? banners.filter((b) => b.isActive) : [];
  const [active, setActive] = useState(0);
  // Height follows the active slide's own natural aspect ratio instead of a
  // fixed px height, so a taller/shorter banner image isn't cropped/stretched.
  const [ratio, setRatio] = useState(null);
  const imgRefs = useRef([]);

  useEffect(() => {
    if (list.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % list.length), 4500);
    return () => clearInterval(t);
  }, [list.length]);

  // Slide changed to an already-loaded (cached) image — onLoad won't refire,
  // so pull its natural size directly.
  useEffect(() => {
    const el = imgRefs.current[active];
    if (el && el.complete && el.naturalWidth) {
      setRatio(el.naturalWidth / el.naturalHeight);
    }
  }, [active]);

  if (!list.length) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-paper2"
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {list.map((b, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={b._id || i}
          ref={(el) => (imgRefs.current[i] = el)}
          src={mediaUrl(b.imageUrl)}
          alt={b.title || ''}
          onLoad={(e) => {
            if (i === active) setRatio(e.target.naturalWidth / e.target.naturalHeight);
          }}
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
