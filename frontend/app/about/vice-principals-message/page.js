import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';
import { cmsPageMetadata, CmsPageSchema } from '@/lib/pageSeo';
import { absoluteUrl } from '@/lib/seo';
import { DEFAULT_PAGE_CONTENT } from '@/lib/defaultPageContent';

export async function generateMetadata() {
  return cmsPageMetadata('about-vice-principals-message', '/about/vice-principals-message', "Vice Principal's Message");
}

export default async function Page() {
  const page = await getPageBySlug('about-vice-principals-message');
  const title = page?.title || "Vice Principal's Message";
  return (
    <>
      <CmsPageSchema page={page} path="/about/vice-principals-message" title={title} crumbs={[{ label: 'About', href: absoluteUrl('/about') }, { label: title }]} />
      <PageHero title={title} eyebrow="About" crumbs={[{ label: 'About', href: absoluteUrl('/about') }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="A message from our Vice Principal will be published here." defaultContent={DEFAULT_PAGE_CONTENT['about-vice-principals-message']} />
      </Section>
    </>
  );
}
