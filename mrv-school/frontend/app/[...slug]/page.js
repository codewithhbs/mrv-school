// Catch-all for CMS pages created from Admin → Pages.
// URL resolution (static routes always win over this):
//   /about/my-page   → slug "about-my-page" (group prefix) or slug "my-page"
//   /my-page         → slug "my-page"
import { notFound, permanentRedirect } from 'next/navigation';
import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import PageBlocks from '@/components/PageBlocks';
import { getPageBySlug } from '@/lib/api';
import { cmsPageMetadata, CmsPageSchema } from '@/lib/pageSeo';
import { cmsPagePath, absoluteUrl } from '@/lib/seo';

export const revalidate = 30;
export const dynamicParams = true;

const GROUP_LABEL = {
  about: 'About',
  academics: 'Academics',
  admission: 'Admission',
  facilities: 'Facilities',
  'student-life': 'Student Life',
  'parents-corner': 'Parents Corner',
  'students-corner': 'Students Corner',
};

function candidates(parts) {
  const clean = parts.map((p) => decodeURIComponent(p).toLowerCase());
  const joined = clean.join('-');
  const last = clean[clean.length - 1];
  return [...new Set([joined, last, clean.join('/')])];
}

async function resolvePage(parts) {
  for (const slug of candidates(parts)) {
    const page = await getPageBySlug(slug, { revalidate: 30 });
    if (page && page.isPublished !== false) return page;
  }
  return null;
}

export async function generateMetadata({ params }) {
  const parts = params.slug || [];
  const page = await resolvePage(parts);
  if (!page) return { title: 'Page not found', robots: { index: false, follow: true } };
  return cmsPageMetadata(page.slug, cmsPagePath(page), page.title);
}

export default async function CmsPage({ params }) {
  const parts = params.slug || [];
  const page = await resolvePage(parts);
  if (!page) notFound();

  const path = cmsPagePath(page);
  if (path !== `/${parts.map((p) => decodeURIComponent(p).toLowerCase()).join('/')}`) permanentRedirect(path);
  const groupLabel = GROUP_LABEL[page.group];
  const crumbs = [
    ...(groupLabel && path.split('/').length > 2 ? [{ label: groupLabel, href: absoluteUrl(`/${page.group}`) }] : []),
    { label: page.title },
  ];

  return (
    <>
      <CmsPageSchema page={page} path={path} title={page.title} crumbs={crumbs} />
      <PageHero title={page.title} eyebrow={groupLabel} description={page.subtitle} crumbs={crumbs} />
      <Section bg="white">
        <PageBlocks page={page} />
      </Section>
    </>
  );
}
