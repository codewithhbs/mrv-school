import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';
import { cmsPageMetadata, CmsPageSchema } from '@/lib/pageSeo';
import { absoluteUrl } from '@/lib/seo';

export async function generateMetadata() {
  return cmsPageMetadata('about-history', '/about/history', 'Our History');
}

export default async function Page() {
  const page = await getPageBySlug('about-history');
  const title = page?.title || 'Our History';
  return (
    <>
      <CmsPageSchema page={page} path="/about/history" title={title} crumbs={[{ label: 'About', href: absoluteUrl('/about') }, { label: title }]} />
      <PageHero title={title} eyebrow="About" crumbs={[{ label: 'About', href: absoluteUrl('/about') }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="The story of how MRVPS was founded and how it has grown over the years will appear here." />
      </Section>
    </>
  );
}
