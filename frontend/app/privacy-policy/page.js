import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import LegalDocument from '@/components/LegalDocument';
import { getSettings } from '@/lib/api';
import { staticPageMeta } from '@/lib/seo';
import { PRIVACY_POLICY, POLICY_LAST_UPDATED, PRIVACY_CLOSING } from '@/lib/legalContent';

export const metadata = staticPageMeta('Privacy Policy', 'How M.R. Vivekananda Public School collects, uses, stores and protects personal information shared through its website.', '/privacy-policy');

export default async function Page() {
  const settings = await getSettings();
  return (
    <>
      <PageHero title="Privacy Policy" eyebrow="Legal" crumbs={[{ label: 'Privacy Policy' }]} />
      <Section bg="white">
        <LegalDocument sections={PRIVACY_POLICY} lastUpdated={POLICY_LAST_UPDATED} settings={settings} closing={PRIVACY_CLOSING} />
      </Section>
    </>
  );
}
