import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';
import { cmsPageMetadata, CmsPageSchema } from '@/lib/pageSeo';
import { absoluteUrl } from '@/lib/seo';

export async function generateMetadata() {
  return cmsPageMetadata('about-infrastructure', '/about/infrastructure', 'Infrastructure');
}

export default async function Page() {
  const page = await getPageBySlug('about-infrastructure');
  const title = page?.title || 'Infrastructure';
  return (
    <>
      <CmsPageSchema page={page} path="/about/infrastructure" title={title} crumbs={[{ label: 'About', href: absoluteUrl('/about') }, { label: title }]} />
      <PageHero title={title} eyebrow="About" crumbs={[{ label: 'About', href: absoluteUrl('/about') }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="An overview of our campus infrastructure will be published here." />
      </Section>
    </>
  );
}
