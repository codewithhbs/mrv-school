import Hero from '@/components/Hero';
import HeroBanner from '@/components/HeroBanner';
import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import Button from '@/components/Button';
import SealBadge from '@/components/SealBadge';
import NewsCard from '@/components/NewsCard';
import TestimonialCard from '@/components/TestimonialCard';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';
import { mediaUrl } from '@/lib/media';
import {
  getSettings,
  getBanners,
  getAcademicPrograms,
  getNewsEvents,
  getGalleryAlbums,
  getTestimonials,
} from '@/lib/api';
import Image from 'next/image';
import TestimonialsMarquee from '@/components/TestimonialsMarquee';

const WHY_CHOOSE = [
  { title: 'Experienced Faculty', desc: 'Qualified, dedicated educators who mentor every child individually.', icon: '🎓', big: true },
  { title: 'Smart Classrooms', desc: 'Technology-enabled learning spaces that make lessons come alive.', icon: '🖥️' },
  { title: 'Holistic Development', desc: 'Sports, arts, and clubs alongside academics for well-rounded growth.', icon: '🌱' },
  { title: 'Safety First', desc: 'CCTV-monitored campus and a dedicated medical room on site.', icon: '🛡️' },
  { title: 'Proven Results', desc: 'Consistent board exam success with strong academic track record.', icon: '🏆' },
  { title: 'Transport Facility', desc: 'GPS-enabled buses covering major routes for safe daily commute.', icon: '🚌' },
  { title: 'Parent Connect', desc: 'Regular PTMs and a dedicated app to track your child\'s progress.', icon: '📱' },
];

const LEVEL_ORDER = ['pre-primary', 'primary', 'middle', 'secondary', 'senior-secondary'];
const LEVEL_LABEL = {
  'pre-primary': 'Pre-Primary', primary: 'Primary', middle: 'Middle',
  secondary: 'Secondary', 'senior-secondary': 'Senior Secondary',
};

export default async function HomePage() {
  const [settings, banners, programs, news, events, gallery, testimonials] = await Promise.all([
    getSettings(),
    getBanners(),
    getAcademicPrograms(),
    getNewsEvents('news', 3),
    getNewsEvents('event', 3),
    getGalleryAlbums(),
    getTestimonials(),
  ]);

  return (
    <>
      {banners?.[0]?.heroType === 'banner' ? <HeroBanner banners={banners} /> : <Hero banners={banners} settings={settings} />}

      {/* Admission Open CTA strip */}
      <div className="bg-gradient-to-r from-red to-red-dark text-white">
        <div className="container-max py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display text-base sm:text-lg">
            Admissions for <span className="text-gold-light font-semibold">2026–27</span> are now open — Pre-Primary to Senior Secondary.
          </p>
          <Button href="/admission" variant="gold">Enquire Now</Button>
        </div>
      </div>

      {/* Principal's Welcome Message — editorial split with oversized quote mark */}
      <Section bg="white">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-14 items-center">
          <div className="relative">
            <div className="w-full aspect-[16/12] rounded-card bg-paper2 border-4 border-white shadow-cardHover overflow-hidden">
              <Image
                src="/images/principal-photo.png"
                alt="Principal, MRVPS"
                width={625}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-ink text-white rounded-card px-5 py-4 shadow-cardHover">
              <div className="font-display font-bold text-sm">Principal's Desk</div>
              <div className="text-xs text-white/60 mt-0.5">MRVPS Leadership</div>
            </div>
          </div>
          <div>
            <span className="font-display text-7xl text-gold/40 leading-none block -mb-6">&ldquo;</span>
            <div className="eyebrow text-red mb-3">A Warm Welcome</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink leading-tight mb-5">
              Every Child Carries a Unique Spark
            </h2>
            <p className="text-slate leading-relaxed text-lg">
              At M.R. Vivekananda Public School, our role is to nurture that spark of curiosity, confidence, and creativity in every child. We believe that true education goes beyond textbooks and examinations — it is about helping students discover their strengths, develop strong values, and become responsible, compassionate, and confident individuals.
              Through rigorous academics, caring mentorship, innovative learning experiences, and a supportive school environment, we strive to provide every student with the right opportunities to learn, explore, question, and grow. Our dedicated faculty works closely with students to encourage independent thinking while ensuring that each child receives the guidance and encouragement they need to reach their full potential.
            </p>
            <Button href="/about/principals-message" variant="ghost" className="mt-6 px-0">
              Read the full message →
            </Button>
          </div>
        </div>
      </Section>

      {/* About School Overview */}
      <Section bg="paper2">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <SectionHeader
              eyebrow="About MRVPS"
              title="A Legacy of Learning, Built on Values"
              description="M.R. Vivekananda Public School is a CBSE-affiliated institution offering education from Pre-Primary through Senior Secondary, shaped by academic rigor and strong personal values."
            />
            <ul className="space-y-3 mb-8 -mt-4">
              {['Child-centric, technology-enabled classrooms', 'Focus on values alongside academics', 'Dedicated faculty mentorship for every student'].map((li) => (
                <li key={li} className="flex items-start gap-3 text-sm text-slate">
                  <span className="w-5 h-5 rounded-full bg-red/10 text-red flex items-center justify-center shrink-0 mt-0.5 text-xs">✓</span>
                  {li}
                </li>
              ))}
            </ul>
            <Button href="/about">Learn More About Us</Button>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-card bg-white border border-line overflow-hidden">
                <Image
                  src="/images/campus-photo.webp"
                  alt="MRVPS Campus"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-card bg-white border border-line overflow-hidden mt-8">
                <Image
                  src="/images/students-photo.webp"
                  alt="MRVPS Students"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Desktop/tablet: floating badge on corner */}
            <div className="hidden sm:block absolute -bottom-6 -left-6 bg-ink text-white rounded-card p-5 shadow-cardHover w-40">
              <SealBadge label="25+" sublabel="YEARS" tone="gold" size="sm" />
              <div className="text-xs text-white/70 mt-3 leading-snug">of academic excellence in West Delhi</div>
            </div>

            {/* Mobile: static strip below the photos, not overlapping */}
            <div className="sm:hidden mt-4 bg-ink text-white rounded-card p-4 flex items-center gap-4">
              <SealBadge label="25+" sublabel="YEARS" tone="gold" size="sm" />
              <div className="text-xs text-white/70 leading-snug">of academic excellence in West Delhi</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Highlights & Achievements + Why Choose Us — bento grid */}
      <Section bg="white">
        <SectionHeader eyebrow="Why MRVPS" title="Why Families Choose Us" align="center" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE.map((w) => (
            <div
              key={w.title}
              className={`rounded-card border p-6 transition-all ${w.big
                ? 'lg:col-span-2 lg:row-span-1 bg-ink text-white border-ink hover:shadow-cardHover'
                : 'border-line hover:border-red/30 hover:shadow-card'
                }`}
            >
              <div className="text-3xl mb-4">{w.icon}</div>
              <h3 className={`font-display font-semibold ${w.big ? 'text-white text-lg' : 'text-ink'}`}>{w.title}</h3>
              <p className={`text-sm mt-2 leading-relaxed ${w.big ? 'text-white/70' : 'text-slate'}`}>{w.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Academic Programs — numbered editorial row */}
      <Section bg="paper2">
        <SectionHeader eyebrow="Academics" title="Programs Across Every Stage" description="From first steps to board examinations, a curriculum designed for each stage of growth." />
        {programs?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[...programs].sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)).map((p, i) => (
              <Link key={p._id} href="/academics" className="group bg-white rounded-card border border-line p-6 hover:shadow-cardHover hover:-translate-y-1 transition-all">
                <div className="font-mono text-xs text-gold-dark mb-3">0{i + 1}</div>
                <div className="eyebrow text-red mb-2">{p.ageGroup || p.level}</div>
                <h3 className="font-display font-semibold text-ink group-hover:text-red transition-colors">{p.title}</h3>
                <p className="text-sm text-slate mt-2 line-clamp-3">{p.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {LEVEL_ORDER.map((lvl, i) => (
              <Link key={lvl} href="/academics" className="group bg-white rounded-card border border-line p-6 hover:shadow-cardHover hover:-translate-y-1 transition-all">
                <div className="font-mono text-xs text-gold-dark mb-3">0{i + 1}</div>
                <h3 className="font-display font-semibold text-ink group-hover:text-red transition-colors">{LEVEL_LABEL[lvl]}</h3>
                <p className="text-sm text-slate mt-2">Curriculum details available on the Academics page.</p>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Latest News & Announcements + Upcoming Events */}
      <Section bg="white">
        <div className="flex items-end justify-between mb-2">
          <SectionHeader eyebrow="Stay Updated" title="News & Upcoming Events" />
          <Button href="/news-events" variant="ghost" className="hidden sm:inline-flex mb-12">View all →</Button>
        </div>
        {(news?.length || events?.length) ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...(news || []), ...(events || [])].slice(0, 3).map((item) => <NewsCard key={item._id} item={item} />)}
          </div>
        ) : (
          <EmptyState title="No announcements yet" description="Check back soon for the latest school news and events." />
        )}
      </Section>

      {/* Photo Gallery Preview — masonry-style */}
      <Section bg="paper2">
        <div className="flex items-end justify-between mb-2">
          <SectionHeader eyebrow="Campus Life" title="Moments from MRVPS" />
          <Button href="/gallery" variant="ghost" className="hidden sm:inline-flex mb-12">View gallery →</Button>
        </div>
        {gallery?.length ? (
          <div className="columns-2 md:columns-4 gap-4 [&>*]:mb-4">
            {gallery.slice(0, 8).map((album, i) => (
              <Link
                key={album._id}
                href="/gallery"
                className={`group relative rounded-card overflow-hidden bg-white border border-line block break-inside-avoid ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}
              >
                {album.coverImage ? (
                  <img src={mediaUrl(album.coverImage)} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate/50 text-xs font-display text-center p-2">{album.title}</div>
                )}

                {album.coverImage && (
                  <div className="absolute inset-0 z-[999999] bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <span className="text-white/70 text-[10px] uppercase tracking-wide font-display">{album.category}</span>
                    <span className="text-white text-sm font-semibold font-display line-clamp-1">{album.title}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="Gallery coming soon" description="Photos and videos from school life will appear here." />
        )}
      </Section>

      {/* Testimonials */}
      <Section bg="white">
        <SectionHeader eyebrow="Voices of MRVPS" title="What Our Community Says" align="center" />
        {testimonials?.length ? (
          testimonials.length > 3 ? (
            <TestimonialsMarquee items={testimonials} />
          ) : (
            <>
            <TestimonialsMarquee items={testimonials} />
            {/* <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => <TestimonialCard key={t._id} item={t} />)}
            </div> */}
            </>
          )
        ) : (
          <EmptyState title="No testimonials yet" />
        )}
      </Section>

      {/* Quick Links */}
      <Section bg="ink">
        <SectionHeader eyebrow="Quick Access" title="Everything You Need, One Click Away" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Admission Enquiry', href: '/admission' },
            { label: 'Fee Structure', href: '/admission/fees' },
            { label: 'Academic Calendar', href: '/academics/calendar' },
            { label: 'Downloads', href: '/downloads' },
            { label: 'Parents Corner', href: '/parents-corner' },
            { label: 'Students Corner', href: '/students-corner' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact Us', href: '/contact' },
          ].map((q) => (
            <Link key={q.label} href={q.href} className="flex items-center justify-between rounded-card border border-white/15 px-5 py-4 hover:border-gold hover:bg-white/5 transition-colors">
              <span className="font-medium text-sm">{q.label}</span>
              <span className="text-gold">→</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Contact Information + Map */}
      <Section bg="paper">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <SectionHeader eyebrow="Visit Us" title="Find MRVPS" />
            <div className="space-y-4 text-slate">
              <p><strong className="text-ink">Address:</strong> {settings?.address || 'Address to be updated in admin panel.'}</p>
              <p><strong className="text-ink">Phone:</strong> {(settings?.phones || []).join(', ') || 'Add a phone number in settings.'}</p>
              <p><strong className="text-ink">Email:</strong> {(settings?.emails || []).join(', ') || 'Add an email in settings.'}</p>
              <p><strong className="text-ink">Office Hours:</strong> {settings?.officeHours || '8:00 AM – 3:00 PM, Mon–Sat'}</p>
            </div>
            <Button href="/contact" className="mt-6">Get in Touch</Button>
          </div>
          <div className="rounded-card overflow-hidden border border-line aspect-video bg-white">
            {settings?.mapEmbedUrl ? (
              <iframe src={settings.mapEmbedUrl} className="w-full h-full" loading="lazy" title="School location map" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate/50 font-display">Map will appear here</div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
