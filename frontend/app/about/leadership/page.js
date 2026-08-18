import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';

export default async function Page() {
  const page = await getPageBySlug('about-leadership');
  const title = page?.title || 'School Leadership';
  return (
    <>
      <PageHero title={title} eyebrow="About" crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="Profiles of our school leadership and management committee will appear here." />
      </Section>
    </>
  );
}
