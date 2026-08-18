import Link from 'next/link';

// crumbs: [{ label, href? }] — last item has no href (current page)
export default function Breadcrumb({ crumbs = [] }) {
  const items = [{ label: 'Home', href: '/' }, ...crumbs];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none" className="opacity-40 shrink-0">
                <path d="M1 1l4.5 4-4.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {last || !c.href ? (
              <span className="text-gold font-medium">{c.label}</span>
            ) : (
              <Link href={c.href} className="text-white/60 hover:text-white transition-colors">
                {c.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
