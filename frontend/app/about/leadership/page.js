import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';
import { cmsPageMetadata, CmsPageSchema } from '@/lib/pageSeo';

export async function generateMetadata() {
  return cmsPageMetadata('about-leadership', '/about/leadership', 'School Leadership');
}

export default async function Page() {
  const page = await getPageBySlug('about-leadership');
  const title = page?.title || 'School Leadership';
  return (
    <>
      <CmsPageSchema page={page} path="/about/leadership" title={title} crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <PageHero title={title} eyebrow="About" crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="Profiles of our school leadership and management committee will appear here." />
      </Section>
    </>
  );
}
