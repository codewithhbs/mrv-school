import Section from '@/components/Section';
import EmptyState from '@/components/EmptyState';
import { getGalleryAlbums } from '@/lib/api';
import PageHero from '@/components/PageHero';
import GalleryGrid from '@/components/Gallerygrid';
// import GalleryGrid from '@/components/GalleryGrid';

export default async function GalleryPage() {
  const albums = await getGalleryAlbums();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Life at MRVPS, in Pictures"
        description="Photos and videos from our classrooms, events, and campus."
        crumbs={[{ label: 'Gallery' }]}
      />

      <Section bg="white">
        {albums?.length ? (
          <GalleryGrid albums={albums} />
        ) : (
          <EmptyState title="Gallery coming soon" description="Photo and video albums will appear here once published." />
        )}
      </Section>
    </>
  );
}