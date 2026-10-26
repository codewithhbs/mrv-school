import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import { getBlogs } from '@/lib/api';
import BlogCard from '@/components/BlogCard';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { absoluteUrl, staticPageMeta } from '@/lib/seo';

export const metadata = staticPageMeta('Parents Corner', 'Resources, portal access and blog updates for MRVPS parents.', '/parents-corner');

const LINKS = [
  { label: 'Parent Login', desc: 'Access the parent portal for attendance, homework, exam schedule, results, and fee status.', href: absoluteUrl('/portal/login') },
  { label: 'Fee Status', desc: "Check your child's fee status and payment history.", href: absoluteUrl('/portal/login') },
  { label: 'Attendance', desc: "Track your child's daily attendance record.", href: absoluteUrl('/portal/login') },
  { label: 'Homework', desc: 'View daily homework and assignments.', href: absoluteUrl('/portal/login') },
  { label: 'School Calendar', desc: 'Term dates, holidays, and exam schedule.', href: absoluteUrl('/academics/calendar') },
  { label: 'PTM Schedule', desc: 'Upcoming Parent-Teacher Meeting dates — also available in the portal.', href: absoluteUrl('/portal/login') },
  { label: 'Download Forms', desc: 'Leave applications, TC requests, and more.', href: absoluteUrl('/downloads') },
];

export default async function ParentsCornerPage() {
  const parenting = (await getBlogs('Parenting', 6)) || [];
  const posts = parenting.length ? parenting : (await getBlogs(undefined, 6)) || [];

  return (
    <>
      <PageHero
        eyebrow="Parents Corner"
        title="Everything Parents Need, in One Place"
        crumbs={[{ label: 'Parents Corner' }]}
      />

      <Section bg="white">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="bg-paper rounded-card border border-line p-6 hover:border-red/30 hover:shadow-card transition-all">
              <h3 className="font-display font-semibold text-ink">{l.label}</h3>
              <p className="text-sm text-slate mt-2">{l.desc}</p>
              {l.note && <p className="text-xs text-gold-dark font-mono mt-2">{l.note}</p>}
            </Link>
          ))}
        </div>
      </Section>

      <Section bg="paper2">
        <SectionHeader eyebrow="From Our Blog" title={parenting.length ? 'Tips & Reads for Parents' : 'Latest Blogs'} />
        {posts.length ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((c) => <BlogCard key={c._id} item={c} />)}
            </div>
            <div className="mt-8 text-center">
              <Link href={absoluteUrl('/blog')} className="text-sm font-semibold text-red hover:text-red-dark">View All Blogs →</Link>
            </div>
          </>
        ) : (
          <EmptyState title="No blog posts published yet" />
        )}
      </Section>
    </>
  );
}
