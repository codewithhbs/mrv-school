import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';

export default async function Page() {
  const page = await getPageBySlug('academics-examinations');
  const title = page?.title || 'Examination System';
  return (
    <>
      <PageHero title={title} eyebrow="Academics" crumbs={[{ label: 'Academics', href: '/academics' }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="Details of our examination system will be published here." />
      </Section>
    </>
  );
}
