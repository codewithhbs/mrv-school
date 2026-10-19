import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { absoluteUrl, staticPageMeta } from '@/lib/seo';

export const metadata = staticPageMeta('About Us', 'Learn aboutMRV Public School — our overview, vision, history, leadership and campus in New Delhi.', '/about');

const PILLARS = [
  { title: 'Holistic Growth', desc: 'Integrating academics with sports, arts, cultural activities, and value education.' },
  { title: 'Experiential Learning', desc: 'Encouraging students to question, explore, and engage actively with concepts rather than relying solely on rote memorization.' },
  { title: 'Values and Discipline', desc: 'Fostering mutual respect, empathy, and social responsibility within a structured yet nurturing environment.' },
];

const SUBPAGES = [
  { label: 'Vision & Mission', href: absoluteUrl('/about/vision-mission'), desc: 'What drives every decision we make.' },
  { label: 'History', href: absoluteUrl('/about/history'), desc: "The story of MRVPS's founding and growth." },
  { label: "Chairman's Message", href: absoluteUrl('/about/chairmans-message'), desc: 'A note from our Chairman.' },
  { label: "Principal's Message", href: absoluteUrl('/about/principals-message'), desc: 'A welcome from our Principal.' },
  { label: "Manager's Message", href: absoluteUrl('/about/managers-message'), desc: 'A note from our Manager.' },
  { label: "Vice Principal's Message", href: absoluteUrl('/about/vice-principals-message'), desc: 'A message from our Vice Principal.' },
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
        description="MRV Public School is a CBSE-affiliated institution offering an education that balances academic rigor with character and creativity — from Pre-Primary through Senior Secondary."
        crumbs={[{ label: 'About' }]}
      />

      <Section bg="white" id="overview">
        <SectionHeader eyebrow="School Overview" title="Overview ofMRV Public School" />
        <p className="text-slate leading-relaxed max-w-3xl">
         MRV Public School, located in West Delhi, is a prominent co-educational institution affiliated with the
          Central Board of Secondary Education (CBSE). Founded on the core principles of curiosity, discipline, and care, the
          school has evolved from a small neighbourhood institution into a well-established campus equipped with modern
          educational infrastructure and comprehensive academic programs.
        </p>
      </Section>

      <Section bg="paper2" id="philosophy">
        <SectionHeader eyebrow="How We Teach" title="Core Philosophy and Approach" />
        <p className="text-slate leading-relaxed max-w-3xl mb-8">
          The institution places a strong emphasis on a <strong className="text-ink">child-centric philosophy</strong> designed to
          balance intellectual rigor with personal character development. Key pillars of its educational framework include:
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((p) => (
            <div key={p.title} className="bg-white rounded-card border border-line p-6">
              <h3 className="font-display font-semibold text-ink">{p.title}</h3>
              <p className="text-sm text-slate mt-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="white" id="explore">
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
