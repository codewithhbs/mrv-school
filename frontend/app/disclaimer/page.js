import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import LegalDocument from '@/components/LegalDocument';
import { getSettings } from '@/lib/api';
import { staticPageMeta } from '@/lib/seo';
import { DISCLAIMER, POLICY_LAST_UPDATED } from '@/lib/legalContent';

export const metadata = staticPageMeta('Disclaimer', 'Website disclaimer of M.R. Vivekananda Public School covering information accuracy, admissions, liability, intellectual property and user conduct.', '/disclaimer');

export default async function Page() {
  const settings = await getSettings();
  return (
    <>
      <PageHero title="Disclaimer" eyebrow="Legal" crumbs={[{ label: 'Disclaimer' }]} />
      <Section bg="white">
        <LegalDocument sections={DISCLAIMER} lastUpdated={POLICY_LAST_UPDATED} settings={settings} />
      </Section>
    </>
  );
}
