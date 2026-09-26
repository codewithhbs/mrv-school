import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';
import { cmsPageMetadata, CmsPageSchema } from '@/lib/pageSeo';

export async function generateMetadata() {
  return cmsPageMetadata('about-rules-policies', '/about/rules-policies', 'School Rules & Policies');
}

export default async function Page() {
  const page = await getPageBySlug('about-rules-policies');
  const title = page?.title || 'School Rules & Policies';
  return (
    <>
      <CmsPageSchema page={page} path="/about/rules-policies" title={title} crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <PageHero title={title} eyebrow="About" crumbs={[{ label: 'About', href: '/about' }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="Our school rules and policies will be published here." />
      </Section>
    </>
  );
}
