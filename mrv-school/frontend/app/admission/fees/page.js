import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import EmptyState from '@/components/EmptyState';
import { getFeeStructure } from '@/lib/api';
import { absoluteUrl, staticPageMeta } from '@/lib/seo';

export const metadata = staticPageMeta('Fee Structure', 'Class-wise fee structure at M.R. Vivekananda Public School, New Delhi.', '/admission/fees');

export default async function FeesPage() {
  const fees = await getFeeStructure();

  return (
    <>
      <PageHero eyebrow="Admission" title="Fee Structure" description="Class-wise fee details for the current academic year." crumbs={[{ label: 'Admission', href: absoluteUrl('/admission') }, { label: 'Fee Structure' }]} />
      <Section bg="white">
      {fees?.length ? (
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="w-full text-sm">
            <thead className="bg-paper2 text-left">
              <tr>
                <th className="px-5 py-3 font-display font-semibold text-ink">Class</th>
                <th className="px-5 py-3 font-display font-semibold text-ink">Academic Year</th>
                <th className="px-5 py-3 font-display font-semibold text-ink">Admission Fee</th>
                <th className="px-5 py-3 font-display font-semibold text-ink">Annual Tuition Fee</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f._id} className="border-t border-line bg-white">
                  <td className="px-5 py-3 font-medium text-ink">{f.classLevel}</td>
                  <td className="px-5 py-3 text-slate font-mono text-xs">{f.academicYear}</td>
                  <td className="px-5 py-3 text-slate">₹{f.admissionFee?.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-slate">₹{f.tuitionFeeAnnual?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="Fee structure not published yet" description="Class-wise fees will be published here once available." />
      )}
      </Section>
    </>
  );
}
