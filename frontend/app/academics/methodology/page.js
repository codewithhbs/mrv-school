import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';
import { cmsPageMetadata, CmsPageSchema } from '@/lib/pageSeo';
import { absoluteUrl } from '@/lib/seo';

export async function generateMetadata() {
  return cmsPageMetadata('academics-methodology', '/academics/methodology', 'Teaching Methodology');
}

export default async function Page() {
  const page = await getPageBySlug('academics-methodology');
  const title = page?.title || 'Teaching Methodology';
  return (
    <>
      <CmsPageSchema page={page} path="/academics/methodology" title={title} crumbs={[{ label: 'Academics', href: absoluteUrl('/academics') }, { label: title }]} />
      <PageHero title={title} eyebrow="Academics" crumbs={[{ label: 'Academics', href: absoluteUrl('/academics') }, { label: title }]} />
      <Section bg="white">
        <PageBlocks page={page} fallbackText="Details of our teaching methodology will be published here." />
      </Section>
    </>
  );
}
