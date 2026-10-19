import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import LegalDocument from '@/components/LegalDocument';
import { getSettings } from '@/lib/api';
import { staticPageMeta } from '@/lib/seo';
import { COOKIE_POLICY, POLICY_LAST_UPDATED } from '@/lib/legalContent';

export const metadata = staticPageMeta('Cookie Policy', 'HowMRV Public School uses cookies and similar technologies on its website, and how you can manage your preferences.', '/cookie-policy');

export default async function Page() {
  const settings = await getSettings();
  return (
    <>
      <PageHero title="Cookie Policy" eyebrow="Legal" crumbs={[{ label: 'Cookie Policy' }]} />
      <Section bg="white">
        <LegalDocument sections={COOKIE_POLICY} lastUpdated={POLICY_LAST_UPDATED} settings={settings} />
      </Section>
    </>
  );
}
