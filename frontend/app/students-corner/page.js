import Section from '@/components/Section';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

const LINKS = [
  { label: 'Student Login', desc: 'Access your student portal.', href: '/portal/login' },
  { label: 'Assignments', desc: 'View homework and assignments set by your teachers.', href: '/portal/login' },
  { label: 'Study Materials', desc: 'Notes, worksheets, and reference material.', href: '/portal/login' },
  { label: 'Exam Schedule', desc: 'Upcoming test and examination dates.', href: '/portal/login' },
  { label: 'Results', desc: 'Check your term and examination results.', href: '/portal/login' },
  { label: 'Library Resources', desc: 'Browse the school library catalogue.', href: '/facilities' },
  { label: 'Downloads', desc: 'Forms, admit cards, and school documents.', href: '/downloads' },
];

export default function StudentsCornerPage() {
  return (
    <>
      <PageHero
        eyebrow="Students Corner"
        title="Your Learning Hub"
        crumbs={[{ label: 'Students Corner' }]}
      />
      <Section bg="white">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="bg-paper rounded-card border border-line p-6 hover:border-red/30 hover:shadow-card transition-all">
              <h3 className="font-display font-semibold text-ink">{l.label}</h3>
              <p className="text-sm text-slate mt-2">{l.desc}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
