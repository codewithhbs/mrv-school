import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';
import { cmsPageMetadata, CmsPageSchema } from '@/lib/pageSeo';

export async function generateMetadata() {
  return cmsPageMetadata('about-vision-mission', '/about/vision-mission', 'Vision & Mission');
}

export default async function Page() {
  const page = await getPageBySlug('about-vision-mission');
  const title = page?.title || 'Vision & Mission';
  return (
    <>
      <CmsPageSchema page={page} path="/about/vision-mission" title={title} crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <PageHero title={title} eyebrow="About" crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="Our vision and mission statements will be published here from the admin panel." />
      </Section>
    </>
  );
}
