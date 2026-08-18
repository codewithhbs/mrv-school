import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import SealBadge from '@/components/SealBadge';
import { getFaculty } from '@/lib/api';
import { mediaUrl } from '@/lib/media';
import PageHero from '@/components/PageHero';

const CATEGORY_LABEL = { leadership: 'Leadership', teaching: 'Teaching Staff', administrative: 'Administrative Staff' };

function FacultyGrid({ members }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {members.map((m) => (
        <div key={m._id} className="bg-white rounded-card border border-line p-5 text-center hover:shadow-card transition-shadow">
          <div className="w-20 h-20 rounded-full bg-paper2 mx-auto mb-4 overflow-hidden border-2 border-white shadow-card">
            {m.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaUrl(m.photo)} alt={m.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate/50 text-xs">Photo</div>
            )}
          </div>
          <h3 className="font-display font-semibold text-ink">{m.name}</h3>
          <p className="text-sm text-red font-medium mt-0.5">{m.designation}</p>
          {m.qualification && <p className="text-xs text-slate mt-2 font-mono">{m.qualification}</p>}
        </div>
      ))}
    </div>
  );
}

export default async function FacultyPage() {
  const faculty = await getFaculty();
  const leadership = faculty?.filter((f) => f.category === 'leadership') || [];
  const teaching = faculty?.filter((f) => f.category === 'teaching') || [];
  const admin = faculty?.filter((f) => f.category === 'administrative') || [];

  return (
    <>
      <PageHero
        eyebrow="Faculty"
        title="The People Behind MRVPS"
        description="Qualified, dedicated educators and staff who bring MRVPS's mission to life every day."
        crumbs={[{ label: 'Faculty' }]}
      />

      {!faculty?.length && (
        <Section bg="white"><EmptyState title="Faculty profiles coming soon" /></Section>
      )}

      {leadership.length > 0 && (
        <Section bg="white">
          <SectionHeader eyebrow={CATEGORY_LABEL.leadership} title="Principal & Leadership" />
          <FacultyGrid members={leadership} />
        </Section>
      )}
      {teaching.length > 0 && (
        <Section bg="paper2">
          <SectionHeader eyebrow={CATEGORY_LABEL.teaching} title="Our Teachers" />
          <FacultyGrid members={teaching} />
        </Section>
      )}
      {admin.length > 0 && (
        <Section bg="white">
          <SectionHeader eyebrow={CATEGORY_LABEL.administrative} title="Administrative Staff" />
          <FacultyGrid members={admin} />
        </Section>
      )}
    </>
  );
}
