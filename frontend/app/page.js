import Hero from '@/components/Hero';
import HeroBanner from '@/components/HeroBanner';
import NewsCard from '@/components/NewsCard';
import EmptyState from '@/components/EmptyState';
import TestimonialsMarquee from '@/components/TestimonialsMarquee';
import TestimonialCard from '@/components/TestimonialCard';
import ProgramsSlider from '@/components/ProgramsSlider';
import Link from 'next/link';
import { mediaUrl } from '@/lib/media';
import { absoluteUrl } from '@/lib/seo';
import {
  getSettings,
  getBanners,
  getAcademicPrograms,
  getNewsEvents,
  getGalleryAlbums,
  getTestimonials,
} from '@/lib/api';

const VALUES = [
  { t: 'Integrity', d: 'Do what is right always', c: 'bg-accent-sky/10 text-accent-sky', i: 'M12 2L4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1.2 14.2L7 12.4l1.4-1.4 2.4 2.4 4.8-4.8L17 10l-6.2 6.2z' },
  { t: 'Empathy', d: 'Care for others and the world', c: 'bg-accent-pink/10 text-accent-pink', i: 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 2 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z' },
  { t: 'Discipline', d: 'Build habits for success', c: 'bg-gold/15 text-gold-dark', i: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
  { t: 'Responsibility', d: 'Be accountable for your actions', c: 'bg-accent-teal/10 text-accent-teal', i: 'M17 8C8 10 5.9 16.2 3.8 21.3l1.9.7.9-2.3c.5.2 1 .3 1.4.3C19 20 22 3 22 3c-1 2-8 2.3-13 3.3S2 11.5 2 13.5 3.8 17.3 3.8 17.3C7 8 17 8 17 8z' },
];

const WHY = [
  { t: 'Experienced Faculty', d: 'Our teachers are dedicated, qualified and passionate.', c: 'bg-gold/15 text-gold-dark', i: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z' },
  { t: 'Modern Infrastructure', d: 'Smart classrooms, well-equipped labs and a safe campus.', c: 'bg-accent-pink/10 text-accent-pink', i: 'M4 21V3h10v4h6v14H4zm2-2h2v-2H6v2zm0-4h2v-2H6v2zm0-4h2V9H6v2zm0-4h2V5H6v2zm4 12h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V9h-2v2zm0-4h2V5h-2v2zm4 12h4V9h-4v10z' },
  { t: 'Holistic Development', d: 'We focus on academics, sports, arts and personality growth.', c: 'bg-accent-sky/10 text-accent-sky', i: 'M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.3l-4.8 2.6.9-5.4L4.2 7.7l5.4-.8L12 2zM5 20h14v2H5z' },
  { t: 'Safety First', d: "Your child's safety is our top priority, with 24/7 CCTV security.", c: 'bg-accent-pink/10 text-accent-pink', i: 'M12 2L4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z' },
  { t: 'Value-Based Education', d: 'We instill ethics, discipline and respect in every student.', c: 'bg-accent-teal/10 text-accent-teal', i: 'M12 21l-1.4-1.3C5.4 15 2 12 2 8.3 2 5.4 4.4 3 7.3 3c1.7 0 3.3.8 4.7 2.1C13.4 3.8 15 3 16.7 3 19.6 3 22 5.4 22 8.3c0 3.7-3.4 6.7-8.6 11.4L12 21z' },
  { t: 'Parent Connect', d: "Stay involved with your child's progress through PTMs and the portal.", c: 'bg-accent-pink/10 text-accent-pink', i: 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 2 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z' },
];

const LEVEL_ORDER = ['pre-primary', 'primary', 'middle', 'secondary', 'senior-secondary'];
const LEVEL_FALLBACK = [
  { level: 'pre-primary', title: 'Early Years (Nursery - KG)', sub: 'Play • Learn • Grow' },
  { level: 'primary', title: 'Primary School (I - V)', sub: 'Strong Foundation' },
  { level: 'middle', title: 'Middle School (VI - VIII)', sub: 'Explore • Discover • Excel' },
  { level: 'senior-secondary', title: 'Senior Secondary (IX - XII)', sub: 'Prepare for a Brighter Future' },
  { level: 'co-curricular', title: 'Co-Curricular Activities', sub: 'Sports • Arts • Clubs • More', href: '/student-life' },
];

function Icon({ d, className = 'w-5 h-5' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d={d} /></svg>;
}

function Kicker({ children, light }) {
  return <div className={`text-[11px] font-bold uppercase tracking-[0.14em] mb-2 ${light ? 'text-gold' : 'text-accent-pink'}`}>{children}</div>;
}

function Title({ children, light }) {
  return <h2 className={`font-display font-bold text-3xl md:text-[2.4rem] leading-tight ${light ? 'text-white' : 'text-navy'}`}>{children}</h2>;
}

function ViewAll({ href, children }) {
  return (
    <Link href={absoluteUrl(href)} className="text-sm font-semibold text-accent-pink hover:text-red inline-flex items-center gap-1.5 whitespace-nowrap">
      {children} <span aria-hidden>→</span>
    </Link>
  );
}

export default async function HomePage() {
  const [settings, banners, programs, news, events, circulars, gallery, testimonials] = await Promise.all([
    getSettings(),
    getBanners(),
    getAcademicPrograms(),
    getNewsEvents('news', 4),
    getNewsEvents('event', 4),
    getNewsEvents('circular', 4),
    getGalleryAlbums(),
    getTestimonials(),
  ]);

  const programItems = programs?.length
    ? [...programs]
        .sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level))
        .map((p) => ({ key: p._id, title: p.title, sub: p.ageGroup || p.description, image: mediaUrl(p.image), href: absoluteUrl('/academics') }))
    : LEVEL_FALLBACK.map((p) => ({ key: p.level, title: p.title, sub: p.sub, image: null, href: absoluteUrl(p.href || '/academics') }));

  const updates = [...(news || []), ...(events || []), ...(circulars || [])]
    .sort((a, b) => new Date(b.eventDate || b.publishedAt || b.createdAt) - new Date(a.eventDate || a.publishedAt || a.createdAt))
    .slice(0, 4);

  return (
    <>
      {banners?.[0]?.heroType === 'banner' ? <HeroBanner banners={banners} /> : <Hero banners={banners} settings={settings} />}

      {/* ABOUT / PRINCIPAL */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center">
          <div className="relative pl-0 sm:pl-10">
            <div className="rounded-[1.5rem] overflow-hidden shadow-cardHover aspect-[16/12] bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/principal-photo.png" alt="Principal, MRVPS" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-48 bg-white rounded-card shadow-cardHover p-5">
              <div className="font-display text-4xl text-accent-pink leading-none">&ldquo;</div>
              <p className="text-xs text-slate leading-relaxed mt-1">Education is not just about gaining knowledge, it&apos;s about building character and confidence for life.</p>
              <div className="mt-3 font-script text-xl text-navy">Principal</div>
              <div className="text-[10px] text-slate">MRV Public School</div>
            </div>
            <Link href={absoluteUrl('/about/principals-message')} className="absolute right-4 bottom-4 bg-navy text-white rounded-full px-5 py-2.5 text-xs font-semibold shadow-card hover:bg-red transition-colors">
              Principal&apos;s Message <span className="text-gold ml-1">Know More →</span>
            </Link>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute right-0 bottom-0 font-script text-3xl text-accent-pink leading-tight text-right rotate-[-6deg]">Learn<br />Grow<br />Achieve</div>
            <Kicker>About MRV Public School</Kicker>
            <Title>Every Child Carries<br />a Unique Spark</Title>
            <p className="mt-5 text-slate leading-relaxed max-w-xl">
              AtMRV Public School, we believe that education is not just about academics, but about building confident, kind and responsible citizens.
              Our school provides a nurturing environment where students are encouraged to explore, learn and grow. With a dedicated faculty, modern infrastructure and a value-based approach,
              we prepare our students for a brighter future.
            </p>
            <Link href={absoluteUrl('/about')} className="mt-7 inline-flex items-center gap-2 bg-navy text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-card hover:bg-red transition-colors">
              Know More About Us <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="relative bg-gradient-to-br from-paper2 via-white to-[#FDEFF3] py-16 md:py-24 overflow-hidden">
        <div className="container-max grid lg:grid-cols-[1.25fr_1fr] gap-12 items-center">
          <div>
            <Kicker>Our Core Values</Kicker>
            <Title>Building Better Humans</Title>
            <p className="mt-4 text-slate leading-relaxed max-w-xl">
              At MRV Public School, we instill values that last a lifetime. We nurture integrity, empathy, discipline and a sense of responsibility in every student.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {VALUES.map((v) => (
                <div key={v.t} className="bg-white rounded-card border border-line p-5 text-center shadow-card hover:-translate-y-1 hover:shadow-cardHover transition-all">
                   <span className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${v.c}`}><Icon d={v.i} /></span>
                  <div className="mt-3 font-display font-semibold text-sm text-navy">{v.t}</div>
                  <div className="mt-1 text-[11px] text-slate leading-snug">{v.d}</div>
                </div>
              ))}
            </div>
            <Link href={absoluteUrl('/about/vision-mission')} className="mt-8 inline-flex items-center gap-2 bg-navy text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-red transition-colors">
              Our Values <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 blob-mask-2 border-[8px] border-gold/80 border-t-transparent border-l-transparent" />
            <div className="relative blob-mask-2 overflow-hidden aspect-[5/4] shadow-cardHover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/students-photo.webp" alt="MRVPS students" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max grid lg:grid-cols-[1.6fr_1fr] gap-12 items-center">
          <div>
            <Kicker>Why Choose Us</Kicker>
            <Title>Why MRV Public School?</Title>
            <p className="mt-3 text-slate">We provide a perfect blend of academics, co-curricular activities and character building.</p>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
              {WHY.map((w) => (
                <div key={w.t} className="flex gap-4">
                  <span className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center ${w.c}`}><Icon d={w.i} /></span>
                  <div>
                    <div className="font-display font-semibold text-sm text-navy">{w.t}</div>
                    <p className="text-xs text-slate mt-1 leading-relaxed">{w.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-2 right-0 z-10 font-script text-3xl text-navy leading-tight text-right rotate-[-4deg] bg-white/80 rounded-xl px-3 py-1">Great Minds<br />Grow Here</div>
            <div className="rounded-[2rem] overflow-hidden aspect-[4/5] bg-paper shadow-cardHover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/campus-photo.webp" alt="Student at MRVPS" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS — navy panel */}
      <section className="bg-white pb-16 md:pb-24">
        <div className="container-max">
          <div className="relative rounded-[2rem] bg-navy doodle-bg text-white px-6 sm:px-10 py-12 shadow-cardHover">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-9">
              <div>
                <Kicker light>Our Programs</Kicker>
                <Title light>Programs Across Every Stage</Title>
                <p className="mt-3 text-white/70 max-w-xl text-sm">From early years to senior secondary, we provide a comprehensive learning experience that builds confidence, creativity and character.</p>
              </div>
              <Link href={absoluteUrl('/academics')} className="self-start md:self-auto inline-flex items-center gap-2 border border-white/40 text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-white hover:text-navy transition-colors">
                View All Programs <span aria-hidden>→</span>
              </Link>
            </div>
            <ProgramsSlider items={programItems} />
          </div>
        </div>
      </section>

      {/* NEWS & EVENTS */}
      <section className="bg-paper py-16 md:py-20">
        <div className="container-max">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <Kicker>Latest Updates</Kicker>
              <Title>News &amp; Events</Title>
              <p className="mt-2 text-slate text-sm">Stay informed about our latest achievements, events and activities.</p>
            </div>
            <ViewAll href="/news-events">View All News &amp; Events</ViewAll>
          </div>
          {updates.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {updates.map((item) => <NewsCard key={item._id} item={item} />)}
            </div>
          ) : (
            <EmptyState title="No announcements yet" description="Check back soon for the latest school news and events." />
          )}
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-max">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <Kicker>Our Gallery</Kicker>
              <Title>Moments That Matter</Title>
              <p className="mt-2 text-slate text-sm">Snapshots of our vibrant campus life, achievements and celebrations.</p>
            </div>
            <ViewAll href="/gallery">View All Photos</ViewAll>
          </div>
          <div className="grid lg:grid-cols-[170px_1fr] gap-6 items-center">
            <div className="hidden lg:block font-script text-3xl text-navy leading-tight -rotate-6">Happy<br />Students<br /><span className="text-accent-pink">Happy Future</span></div>
            {gallery?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.slice(0, 4).map((album) => (
                  <Link key={album._id} href={absoluteUrl('/gallery')} className="group relative rounded-card overflow-hidden aspect-[4/3] bg-paper shadow-card">
                    {album.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaUrl(album.coverImage)} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate/50 text-xs font-display p-2 text-center">{album.title}</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent p-3 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md bg-white/90 text-navy flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z" />
                      </span>
                      <span className="text-white text-xs font-semibold line-clamp-1">{album.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="Gallery coming soon" description="Photos and videos from school life will appear here." />
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — navy band */}
      <section className="relative bg-navy doodle-bg py-16 md:py-20 overflow-hidden">
        <div className="container-max">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <Kicker light>Testimonials</Kicker>
              <Title light>What Our Community Says</Title>
              <p className="mt-2 text-white/65 text-sm">Real stories from parents, students and well-wishers who are a part of MRV Public School.</p>
            </div>
            <div className="hidden md:block font-script text-3xl text-gold -rotate-6 text-right leading-tight">Trusted by<br />Hundreds of Families ♡</div>
          </div>
          {testimonials?.length ? (
            testimonials.length > 3 ? (
              <TestimonialsMarquee items={testimonials} fade="from-navy" />
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((t) => <TestimonialCard key={t._id} item={t} />)}
              </div>
            )
          ) : (
            <p className="text-white/60 text-sm">No testimonials yet.</p>
          )}
        </div>
      </section>

      {/* JOIN CTA — yellow band */}
      <section className="relative bg-gradient-to-r from-gold via-gold-light to-gold overflow-hidden">
        <div className="container-max py-12 grid md:grid-cols-[1fr_1.3fr] gap-8 items-center">
          <div className="font-script text-4xl md:text-5xl text-navy leading-tight -rotate-3">Let&apos;s Build<br />A Brighter Future<br />Together!</div>
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-navy">Join Our MRV Family</h2>
            <p className="mt-2 text-navy/80 text-sm max-w-lg">Admissions are now open for 2026–27. Be a part of MRV Public School where learning meets excellence.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={absoluteUrl('/admission')} className="inline-flex items-center gap-2 bg-navy text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-card hover:bg-red transition-colors">
                Apply Now <span aria-hidden>→</span>
              </Link>
              <Link href={absoluteUrl('/contact')} className="inline-flex items-center gap-2 border-2 border-navy text-navy font-semibold text-sm px-6 py-3 rounded-full hover:bg-navy hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        <svg className="pointer-events-none absolute right-6 top-6 w-16 text-navy/40 hidden lg:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinejoin="round" /></svg>
      </section>
    </>
  );
}
