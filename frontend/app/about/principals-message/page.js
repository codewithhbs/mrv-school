import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';
import { cmsPageMetadata, CmsPageSchema } from '@/lib/pageSeo';

export async function generateMetadata() {
  return cmsPageMetadata('about-principals-message', '/about/principals-message', "Principal's Message");
}

export default async function Page() {
  const page = await getPageBySlug('about-principals-message');
  const title = page?.title || "Principal's Message";
  return (
    <>
      <CmsPageSchema page={page} path="/about/principals-message" title={title} crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <PageHero title={title} eyebrow="About" crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="A message from our Principal will be published here." />
      </Section>
    </>
  );
}
