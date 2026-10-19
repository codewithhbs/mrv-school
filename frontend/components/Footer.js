import Link from 'next/link';
import { mediaUrl } from '@/lib/media';
import { absoluteUrl, SCHOOL_ADDRESS } from '@/lib/seo';
import { telHref } from '@/components/ContactLinks';
import SocialIcons from '@/components/SocialIcons';

const QUICK = [
  ['Home', '/'], ['About Us', '/about'], ['Academics', '/academics'], ['Admissions', '/admission'],
  ['Gallery', '/gallery'], ['News & Events', '/news-events'], ['Contact', '/contact'],
];
const PROGRAMS = [
  ['Parents Corner', '/parents-corner'], ['Students Corner', '/students-corner'], ['Careers', '/careers'],
  ['Senior Secondary (IX - XII)', '/academics'], ['Student Life', '/student-life'], ['Downloads', '/downloads'],
];

function Ico({ d }) {
  return (
    <span className="w-7 h-7 shrink-0 rounded-full bg-gold/15 text-gold flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d={d} /></svg>
    </span>
  );
}

export default function Footer({ settings }) {
  const year = new Date().getFullYear();
  const logo = settings?.logoUrl ? mediaUrl(settings.logoUrl) : '/images/logo.png';
  const name = settings?.schoolName || 'MRV Public School';

  return (
    <footer className="bg-navy-deep text-white relative overflow-hidden">
      <div className="absolute inset-0 doodle-bg pointer-events-none" />
      <div className="container-max relative py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.1fr_1.3fr] gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={name} className="w-14 h-14 object-contain rounded-full bg-white p-0.5" />
            <div className="leading-tight">
              <div className="font-display font-bold text-lg uppercase">MRV Public School</div>
              <div className="text-[11px] text-white/60">{settings?.tagline || 'Knowledge • Character • Excellence'}</div>
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed max-w-xs">
            {settings?.footerText || `A ${settings?.board || 'CBSE'}-affiliated institution dedicated to academic excellence, values and holistic growth.`}
          </p>
          <SocialIcons className="mt-5" />
        </div>

        <div>
          <div className="font-display font-semibold mb-4">Quick Links</div>
          <ul className="space-y-2 text-sm text-white/65">
            {QUICK.map(([l, h]) => (
              <li key={l}><Link href={absoluteUrl(h)} className="hover:text-gold transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-display font-semibold mb-4">Our Programs</div>
          <ul className="space-y-2 text-sm text-white/65">
            {PROGRAMS.map(([l, h]) => (
              <li key={l}><Link href={absoluteUrl(h)} className="hover:text-gold transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-display font-semibold mb-4">Contact Us</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3"><Ico d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />{settings?.address || SCHOOL_ADDRESS}</li>
            {(settings?.phones || []).map((p) => (
              <li key={p} className="flex gap-3 items-center"><Ico d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" /><a href={telHref(p)} className="hover:text-gold transition-colors">{p}</a></li>
            ))}
            {(settings?.emails || []).map((e) => (
              <li key={e} className="flex gap-3 items-center"><Ico d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /><a href={`mailto:${e}`} className="hover:text-gold transition-colors break-all">{e}</a></li>
            ))}
            <li className="flex gap-3 items-center"><Ico d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 11h-5v-2h3V6h2v7z" />{settings?.officeHours || '8:00 AM – 3:00 PM (Mon – Sat)'}</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-max py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {year} {name}. All Rights Reserved.{settings?.affiliationNumber ? ` · Affiliation No. ${settings.affiliationNumber}` : ''}</span>
          <span className="flex items-center gap-4">
            <Link href={absoluteUrl('/privacy-policy')} className="hover:text-white">Privacy Policy</Link>
            <span className="opacity-40">|</span>
            <Link href={absoluteUrl('/cookie-policy')} className="hover:text-white">Cookie Policy</Link>
            <span className="opacity-40">|</span>
            <Link href={absoluteUrl('/disclaimer')} className="hover:text-white">Disclaimer</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
