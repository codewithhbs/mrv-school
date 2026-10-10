import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import Link from 'next/link';
import { getAcademicPrograms } from '@/lib/api';
import PageHero from '@/components/PageHero';
import { absoluteUrl, staticPageMeta } from '@/lib/seo';

export const metadata = staticPageMeta('Academics', 'CBSE curriculum at MRVPS from Pre-Primary to Senior Secondary — levels, subjects and teaching approach.', '/academics');

const LEVEL_LABEL = {
  'pre-primary': 'Pre-Primary',
  primary: 'Primary School',
  middle: 'Middle School',
  secondary: 'Secondary School',
  'senior-secondary': 'Senior Secondary',
};

export default async function AcademicsPage() {
  const programs = await getAcademicPrograms();

  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="A Curriculum for Every Stage of Growth"
        description="Our academic program is structured across five stages, each designed around how children actually learn at that age — building foundations early, then depth and rigor as students progress toward the boards."
        crumbs={[{ label: 'Academics' }]}
      />

      <Section bg="white">
        {programs?.length ? (
          <div className="space-y-6">
            {programs.map((p) => (
              <div key={p._id} className="grid md:grid-cols-[220px_1fr] gap-6 bg-paper rounded-card border border-line p-7">
                <div>
                  <div className="eyebrow text-red mb-2">{p.ageGroup || LEVEL_LABEL[p.level]}</div>
                  <h3 className="font-display font-bold text-xl text-ink">{LEVEL_LABEL[p.level] || p.title}</h3>
                </div>
                <div>
                  <p className="text-slate leading-relaxed">{p.description}</p>
                  {p.highlights?.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="font-mono text-[11px] bg-white border border-line px-2.5 py-1 rounded-full text-slate">{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Programs coming soon" description="Details for each academic stage will be published from the admin panel." />
        )}
      </Section>

      <Section bg="paper2">
        <SectionHeader eyebrow="More on Academics" title="Dive Deeper" />
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { label: 'Teaching Methodology', href: absoluteUrl('/academics/methodology') },
            { label: 'Examination System', href: absoluteUrl('/academics/examinations') },
            { label: 'Academic Calendar', href: absoluteUrl('/academics/calendar') },
          ].map((s) => (
            <Link key={s.href} href={s.href} className="bg-white rounded-card border border-line p-6 hover:shadow-cardHover hover:border-red/30 transition-all font-display font-semibold text-ink">
              {s.label} →
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Button href={absoluteUrl('/admission')}>Apply for Admission</Button>
        </div>
      </Section>
    </>
  );
}
