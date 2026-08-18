import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';

export default async function Page() {
  const page = await getPageBySlug('about-history');
  const title = page?.title || 'Our History';
  return (
    <>
      <PageHero title={title} eyebrow="About" crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="The story of how MRVPS was founded and how it has grown over the years will appear here." />
      </Section>
    </>
  );
}
