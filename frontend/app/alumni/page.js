import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import AlumniRegistrationForm from '@/components/AlumniRegistrationForm';
import SealBadge from '@/components/SealBadge';
import { getAlumniStories } from '@/lib/api';
import PageHero from '@/components/PageHero';

export default async function AlumniPage() {
  const stories = await getAlumniStories();

  return (
    <>
      <PageHero
        eyebrow="Alumni"
        title="Once a Student, Always Part of MRVPS"
        description="Stay connected, share your journey, and be part of alumni meets and reunions."
        crumbs={[{ label: 'Alumni' }]}
      />

      <Section bg="white">
        <SectionHeader eyebrow="Where They Are Now" title="Success Stories" />
        {stories?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((s) => (
              <div key={s._id} className="bg-paper rounded-card border border-line p-6">
                <div className="flex items-center gap-3 mb-4">
                  <SealBadge label={s.name?.[0] || 'A'} sublabel={`Batch ${s.batchYear}`} tone="gold" />
                  <div>
                    <div className="font-display font-semibold text-ink">{s.name}</div>
                    {s.currentRole && <div className="text-xs text-slate">{s.currentRole}</div>}
                  </div>
                </div>
                <p className="text-sm text-slate leading-relaxed line-clamp-4">{s.story}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No alumni stories published yet" />
        )}
      </Section>

      <Section bg="paper2">
        <div className="max-w-xl">
          <SectionHeader eyebrow="Reconnect" title="Alumni Registration" />
          <AlumniRegistrationForm />
        </div>
      </Section>
    </>
  );
}
