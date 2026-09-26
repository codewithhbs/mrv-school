import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';
import { cmsPageMetadata, CmsPageSchema } from '@/lib/pageSeo';

export async function generateMetadata() {
  return cmsPageMetadata('about-chairmans-message', '/about/chairmans-message', "Chairman's Message");
}

export default async function Page() {
  const page = await getPageBySlug('about-chairmans-message');
  const title = page?.title || "Chairman's Message";
  return (
    <>
      <CmsPageSchema page={page} path="/about/chairmans-message" title={title} crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <PageHero title={title} eyebrow="About" crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="A message from our Chairman will be published here." />
      </Section>
    </>
  );
}
