import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';

export default async function Page() {
  const page = await getPageBySlug('academics-calendar');
  const title = page?.title || 'Academic Calendar';
  return (
    <>
      <PageHero title={title} eyebrow="Academics" crumbs={[{ label: 'Academics', href: '/academics' }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="The academic calendar will be published here." />
      </Section>
    </>
  );
}
