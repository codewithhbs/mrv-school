import Section from '@/components/Section';
import EmptyState from '@/components/EmptyState';
import { getGalleryAlbums } from '@/lib/api';
import { mediaUrl } from '@/lib/media';
import PageHero from '@/components/PageHero';

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
          <div className="space-y-14">
            {albums.map((album) => (
              <div key={album._id}>
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-display font-bold text-2xl text-ink">{album.title}</h2>
                  {album.category && <span className="eyebrow text-red">{album.category}</span>}
                </div>
                {album.items?.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {album.items.map((it) => (
                      <div key={it._id} className="aspect-square rounded-card overflow-hidden bg-paper2 border border-line">
                        {it.type === 'video' ? (
                          <video src={mediaUrl(it.url)} controls className="w-full h-full object-cover" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={mediaUrl(it.url)} alt={it.caption || album.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate">No media added to this album yet.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Gallery coming soon" description="Photo and video albums will appear here once published." />
        )}
      </Section>
    </>
  );
}
