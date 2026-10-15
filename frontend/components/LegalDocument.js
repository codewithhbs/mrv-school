import { EmailLinks, PhoneLinks } from '@/components/ContactLinks';
import { SCHOOL_ADDRESS } from '@/lib/seo';

// Renders a legal document (Cookie Policy, Privacy Policy, Disclaimer) from lib/legalContent.js.
export default function LegalDocument({ sections, lastUpdated, settings, closing }) {
  const idOf = (title) => 'sec-' + title.split(/[.\s]/)[0];

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-14">
      <nav aria-label="On this page" className="hidden lg:block">
        <div className="sticky top-28">
          <div className="eyebrow text-red mb-3">On this page</div>
          <ul className="space-y-2 text-sm border-l border-line">
            {sections.map((s) => (
              <li key={s.title}>
                <a href={`#${idOf(s.title)}`} className="block pl-4 -ml-px border-l border-transparent text-slate hover:text-red hover:border-red transition-colors">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <article className="max-w-3xl">
        {lastUpdated && <p className="text-sm text-slate-light mb-8">Last updated: {lastUpdated}</p>}

        {sections.map((s) => (
          <section key={s.title} id={idOf(s.title)} className="mb-10 scroll-mt-28">
            <h2 className="font-display font-bold text-xl md:text-2xl text-ink pb-3 mb-4 border-b border-line flex items-baseline gap-3">
              <span className="w-2 h-2 rounded-full bg-red shrink-0 -translate-y-0.5" />
              {s.title}
            </h2>
            <div className="space-y-4">
              {s.blocks.map((b, i) => {
                if (b.t === 'p') return <p key={i} className="text-slate leading-relaxed">{b.text}</p>;
                if (b.t === 'h3') return <h3 key={i} className="font-display font-semibold text-lg text-red pt-2">{b.text}</h3>;
                if (b.t === 'ul') {
                  return (
                    <ul key={i} className="space-y-2.5">
                      {b.items.map((it, j) => (
                        <li key={j} className="flex items-start gap-3 text-slate leading-relaxed">
                          <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-red shrink-0" />
                          <span>{it.lead && <strong className="text-ink">{it.lead} </strong>}{it.text}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (b.t === 'contact') {
                  return (
                    <div key={i} className="bg-paper2 border border-line rounded-card p-5 text-sm text-slate space-y-1.5">
                      <p className="font-semibold text-ink">{settings?.schoolName || 'M.R. Vivekananda Public School'}</p>
                      <p>{settings?.address || SCHOOL_ADDRESS}</p>
                      {settings?.phones?.length > 0 && <p><strong className="text-ink">Phone:</strong> <PhoneLinks phones={settings.phones} /></p>}
                      <p><strong className="text-ink">Email:</strong> <EmailLinks emails={settings?.emails?.length ? settings.emails : ['info@mrvps.org']} /></p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </section>
        ))}

        {closing && (
          <div className="mt-12 bg-ink text-white rounded-card p-6">
            <div className="font-display font-bold text-lg text-gold">{closing.title}</div>
            <p className="text-white/70 mt-2 leading-relaxed">{closing.text}</p>
          </div>
        )}
      </article>
    </div>
  );
}
