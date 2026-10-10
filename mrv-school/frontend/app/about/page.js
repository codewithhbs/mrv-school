import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { absoluteUrl, staticPageMeta } from '@/lib/seo';

export const metadata = staticPageMeta('About Us', 'Learn about M.R. Vivekananda Public School — our overview, vision, history, leadership and campus in New Delhi.', '/about');

const SUBPAGES = [
  { label: 'Vision & Mission', href: absoluteUrl('/about/vision-mission'), desc: 'What drives every decision we make.' },
  { label: 'History', href: absoluteUrl('/about/history'), desc: "The story of MRVPS's founding and growth." },
  { label: "Chairman's Message", href: absoluteUrl('/about/chairmans-message'), desc: 'A note from our Chairman.' },
  { label: "Principal's Message", href: absoluteUrl('/about/principals-message'), desc: 'A welcome from our Principal.' },
  { label: 'School Leadership', href: absoluteUrl('/about/leadership'), desc: 'The people guiding MRVPS forward.' },
  { label: 'Infrastructure', href: absoluteUrl('/about/infrastructure'), desc: 'A campus built for learning.' },
  { label: 'School Rules & Policies', href: absoluteUrl('/about/rules-policies'), desc: 'Our code of conduct and policies.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About MRVPS"
        title="Rooted in Values, Focused on Excellence"
        description="M.R. Vivekananda Public School is a CBSE-affiliated institution offering an education that balances academic rigor with character and creativity — from Pre-Primary through Senior Secondary."
        crumbs={[{ label: 'About' }]}
      />

      <Section bg="white" id="overview">
        <SectionHeader eyebrow="Explore" title="Get to Know MRVPS" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUBPAGES.map((s) => (
            <Link key={s.href} href={s.href} className="group bg-paper rounded-card border border-line p-6 hover:shadow-cardHover hover:border-red/30 transition-all">
              <h3 className="font-display font-semibold text-ink group-hover:text-red transition-colors">{s.label}</h3>
              <p className="text-sm text-slate mt-2">{s.desc}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
