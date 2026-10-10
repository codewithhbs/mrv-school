'use client';

import { useState, useCallback, useEffect } from 'react';
import { mediaUrl } from '@/lib/media';

export default function GalleryGrid({ albums }) {
  const [lightbox, setLightbox] = useState(null); // { item, album }

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, close]);

  return (
    <>
      <div className="space-y-14">
        {albums.map((album) => (
          <div key={album._id}>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display font-bold text-2xl text-ink">{album.title}</h2>
              {album.category && <span className="eyebrow text-red">{album.category}</span>}
            </div>
            {album.items?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {album.items.map((it) => (
                  <button
                    key={it._id}
                    type="button"
                    onClick={() => setLightbox({ item: it, album })}
                    className="aspect-square rounded-card overflow-hidden bg-paper2 border border-line block text-left"
                  >
                    {it.type === 'video' ? (
                      <video src={mediaUrl(it.url)} className="w-full h-full object-cover pointer-events-none" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaUrl(it.url)} alt={it.caption || album.title} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate">No media added to this album yet.</p>
            )}
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>

          <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {lightbox.item.type === 'video' ? (
              <video
                src={mediaUrl(lightbox.item.url)}
                controls
                autoPlay
                className="max-w-full max-h-[75vh] rounded-card"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaUrl(lightbox.item.url)}
                alt={lightbox.item.caption || lightbox.album.title}
                className="max-w-full max-h-[75vh] object-contain rounded-card"
              />
            )}

            <div className="mt-4 text-center">
              {lightbox.album.category && (
                <span className="eyebrow text-red block mb-1">{lightbox.album.category}</span>
              )}
              <h3 className="font-display font-semibold text-white text-lg">{lightbox.album.title}</h3>
              {lightbox.item.caption && (
                <p className="text-white/70 text-sm mt-1">{lightbox.item.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}