import Section from '@/components/Section';
import EmptyState from '@/components/EmptyState';
import { getFacilities } from '@/lib/api';
import { mediaUrl } from '@/lib/media';
import PageHero from '@/components/PageHero';

export default async function FacilitiesPage() {
  const facilities = await getFacilities();

  return (
    <>
      <PageHero
        eyebrow="Facilities"
        title="A Campus Built for Learning"
        description="From smart classrooms to science labs, sports grounds to a dedicated medical room — every corner of MRVPS is designed to support how students learn, play, and grow."
        crumbs={[{ label: 'Facilities' }]}
      />

      <Section bg="white">
        {facilities?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f) => (
              <div key={f._id} className="bg-paper rounded-card border border-line overflow-hidden hover:shadow-cardHover transition-shadow">
                <div className="aspect-[16/10] bg-paper2">
                  {f.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl(f.images[0])} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate/50 font-display">{f.name}</div>
                  )}
                </div>
                <div className="p-5">
                  {f.category && <div className="eyebrow text-red mb-1.5">{f.category}</div>}
                  <h3 className="font-display font-semibold text-lg text-ink">{f.name}</h3>
                  <p className="text-sm text-slate mt-2 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Facility details coming soon" description="Facility information will be published from the admin panel." />
        )}
      </Section>
    </>
  );
}
