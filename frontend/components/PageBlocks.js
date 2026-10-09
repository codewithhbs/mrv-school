// Renders the flexible `blocks` array from the Page model (backend).
// Block types: heading, paragraph, image, list, quote, table, cta
import { mediaUrl } from '@/lib/media';

export default function PageBlocks({ page, fallbackText }) {
  if (!page || !page.blocks?.length) {
    return (
      <div className="max-w-3xl">
        <p className="text-slate leading-relaxed text-lg">
          {fallbackText || 'Content for this page will be added from the admin panel soon.'}
        </p>
      </div>
    );
  }

  const sorted = [...page.blocks].sort((a, b) => (a.order || 0) - (b.order || 0));
  const heroImage = mediaUrl(page.heroImage);

  return (
    <div className="">
      {heroImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={heroImage}
          alt={page.title}
          className="w-full object-cover rounded-card mb-10 border border-line shadow-card"
        />
      )}

      <div className="space-y-6">
        {sorted.map((block, i) => {
          switch (block.type) {
            case 'heading':
              return (
                <h2
                  key={i}
                  className="font-display font-semibold text-2xl text-ink mt-12 pb-3 border-b border-line flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-red shrink-0" />
                  {block.data?.text}
                </h2>
              );

            case 'paragraph':
              return (
                <p key={i} className="text-slate leading-relaxed text-[15px] md:text-base">
                  {block.data?.text}
                </p>
              );

            case 'quote':
              return (
                <blockquote
                  key={i}
                  className="relative bg-paper2 border-l-4 border-gold rounded-r-card px-6 py-5 my-2"
                >
                  <p className="italic text-ink text-lg leading-relaxed">&ldquo;{block.data?.text}&rdquo;</p>
                  {block.data?.attribution && (
                    <cite className="block not-italic eyebrow text-slate mt-3">— {block.data.attribution}</cite>
                  )}
                </blockquote>
              );

            case 'list':
              return (
                <ul key={i} className="space-y-3">
                  {(block.data?.items || []).map((it, j) => (
                    <li key={j} className="flex items-start gap-3 text-slate leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              );

            case 'image':
              return (
                <figure key={i} className="my-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(block.data?.url)}
                    alt={block.data?.caption || ''}
                    className="w-full rounded-card border border-line shadow-card"
                  />
                  {block.data?.caption && (
                    <figcaption className="text-center text-sm text-slate-light mt-2">{block.data.caption}</figcaption>
                  )}
                </figure>
              );

            case 'table':
              return (
                <div key={i} className="overflow-x-auto rounded-card border border-line">
                  <table className="w-full text-sm">
                    {block.data?.headers && (
                      <thead>
                        <tr className="bg-ink text-white">
                          {block.data.headers.map((h, hi) => (
                            <th key={hi} className="text-left font-display font-semibold px-4 py-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {(block.data?.rows || []).map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-paper2'}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-4 py-3 text-slate border-t border-line">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );

            case 'cta':
              return (
                <a
                  key={i}
                  href={block.data?.href || '#'}
                  className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-full bg-red text-white font-semibold text-sm hover:bg-red-dark transition-colors shadow-card"
                >
                  {block.data?.label || 'Learn more'}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
