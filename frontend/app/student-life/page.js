import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import { getNewsEvents } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import PageHero from '@/components/PageHero';

const AREAS = [
  { title: 'Clubs & Activities', desc: 'Debate, science, art, and coding clubs meet weekly to nurture interests beyond the classroom.' },
  { title: 'Sports', desc: 'Athletics, cricket, basketball, and yoga programs build discipline and teamwork.' },
  { title: 'Cultural Events', desc: 'Music, dance, and drama give every student a stage to express themselves.' },
  { title: 'Competitions', desc: 'Inter-school and inter-house competitions in academics, sports, and the arts.' },
  { title: 'Educational Tours', desc: 'Curated trips that turn textbook learning into real-world experience.' },
  { title: 'Annual Function', desc: 'A full-school celebration showcasing a year of talent and hard work.' },
  { title: 'Celebrations', desc: 'Festivals and national days observed with school-wide programs.' },
  { title: 'Student Council', desc: 'Elected student leaders who represent their peers and organize school life.' },
];

export default async function StudentLifePage() {
  const events = await getNewsEvents('event', 3);

  return (
    <>
      <PageHero
        eyebrow="Student Life"
        title="Beyond the Classroom"
        description="Academics is only one part of the MRVPS experience. Here's how students grow through sports, arts, clubs, and leadership."
        crumbs={[{ label: 'Student Life' }]}
      />

      <Section bg="white">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AREAS.map((a) => (
            <div key={a.title} className="rounded-card border border-line p-6 bg-paper hover:border-red/30 hover:shadow-card transition-all">
              <h3 className="font-display font-semibold text-ink">{a.title}</h3>
              <p className="text-sm text-slate mt-2 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="paper2">
        <SectionHeader eyebrow="Coming Up" title="Upcoming Events" />
        {events?.length ? (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((item) => <NewsCard key={item._id} item={item} />)}
          </div>
        ) : (
          <EmptyState title="No events scheduled yet" />
        )}
      </Section>
    </>
  );
}
