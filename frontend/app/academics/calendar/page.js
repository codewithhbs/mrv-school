import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';
import { cmsPageMetadata, CmsPageSchema } from '@/lib/pageSeo';

export async function generateMetadata() {
  return cmsPageMetadata('academics-calendar', '/academics/calendar', 'Academic Calendar');
}

export default async function Page() {
  const page = await getPageBySlug('academics-calendar');
  const title = page?.title || 'Academic Calendar';
  return (
    <>
      <CmsPageSchema page={page} path="/academics/calendar" title={title} crumbs={[{ label: 'Academics', href: '/academics' }, { label: title }]} />
      <PageHero title={title} eyebrow="Academics" crumbs={[{ label: 'Academics', href: '/academics' }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="The academic calendar will be published here." />
      </Section>
    </>
  );
}
