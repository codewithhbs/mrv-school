import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import EmptyState from '@/components/EmptyState';
import { getScholarships } from '@/lib/api';

export default async function ScholarshipsPage() {
  const scholarships = await getScholarships();

  return (
    <>
      <PageHero eyebrow="Admission" title="Scholarship Information" description="MRVPS recognizes and supports merit and need through the following scholarships." crumbs={[{ label: 'Admission', href: '/admission' }, { label: 'Scholarships' }]} />
      <Section bg="white">
      {scholarships?.length ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {scholarships.map((s) => (
            <div key={s._id} className="bg-paper rounded-card border border-line p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display font-semibold text-lg text-ink">{s.title}</h3>
                {s.discountPercent && (
                  <span className="font-mono text-xs bg-gold text-ink px-2.5 py-1 rounded-full shrink-0">{s.discountPercent}% off</span>
                )}
              </div>
              <p className="text-sm text-slate mt-2 leading-relaxed">{s.description}</p>
              {s.eligibility && <p className="text-xs text-slate mt-3"><strong className="text-ink">Eligibility:</strong> {s.eligibility}</p>}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No scholarships published yet" />
      )}
      </Section>
    </>
  );
}
