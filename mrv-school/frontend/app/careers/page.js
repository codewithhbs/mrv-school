import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import CareerOpeningCard from '@/components/CareerOpeningCard';
import { getCareerOpenings } from '@/lib/api';
import PageHero from '@/components/PageHero';
import { staticPageMeta } from '@/lib/seo';

export const metadata = staticPageMeta('Careers', 'Current teaching and staff openings at M.R. Vivekananda Public School. Apply online.', '/careers');

export default async function CareersPage() {
  const openings = await getCareerOpenings();

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build Your Career at MRVPS"
        description="We're always looking for passionate educators and staff who share our commitment to student growth."
        crumbs={[{ label: 'Careers' }]}
      />

      <Section bg="white">
        <SectionHeader eyebrow="Current Openings" title="Open Positions" />
        {openings?.length ? (
          <div className="space-y-4 max-w-3xl">
            {openings.map((o) => <CareerOpeningCard key={o._id} opening={o} />)}
          </div>
        ) : (
          <EmptyState title="No open positions right now" description="Check back soon, or send your resume for future consideration." />
        )}
      </Section>
    </>
  );
}
