import Link from 'next/link';
import Image from 'next/image';
import { mediaUrl } from '@/lib/media';
import { absoluteUrl, SCHOOL_ADDRESS } from '@/lib/seo';
import { telHref } from '@/components/ContactLinks';

export default function Footer({ settings }) {
  const year = new Date().getFullYear();
  const logo = mediaUrl(settings?.logoUrl);

  return (
    <footer className="bg-ink text-white">
      <div className="container-max py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {logo ? (
              <Image src={logo} alt={settings?.schoolName || 'School logo'} width={40} height={40} className="w-10 h-10 object-contain rounded-full" unoptimized />
            ) : (
              <div className="seal w-10 h-10 text-gold">
                <span className="font-display font-bold text-gold">M</span>
              </div>
            )}
            <div className="font-display font-bold text-lg">{settings?.schoolName || 'M.R. Vivekananda Public School'}</div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            {settings?.footerText ||
              `A ${settings?.board || 'CBSE'}-affiliated institution dedicated to academic excellence, values, and holistic growth.`}
          </p>
        </div>

        <div>
          <div className="eyebrow text-gold mb-4">Explore</div>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href={absoluteUrl('/about')} className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href={absoluteUrl('/academics')} className="hover:text-white transition-colors">Academics</Link></li>
            <li><Link href={absoluteUrl('/admission')} className="hover:text-white transition-colors">Admission</Link></li>
            <li><Link href={absoluteUrl('/facilities')} className="hover:text-white transition-colors">Facilities</Link></li>
            <li><Link href={absoluteUrl('/gallery')} className="hover:text-white transition-colors">Gallery</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-gold mb-4">Quick Links</div>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href={absoluteUrl('/parents-corner')} className="hover:text-white transition-colors">Parents Corner</Link></li>
            <li><Link href={absoluteUrl('/students-corner')} className="hover:text-white transition-colors">Students Corner</Link></li>
            <li><Link href={absoluteUrl('/careers')} className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href={absoluteUrl('/downloads')} className="hover:text-white transition-colors">Downloads</Link></li>
            <li><Link href={absoluteUrl('/alumni')} className="hover:text-white transition-colors">Alumni</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-gold mb-4">Reach Us</div>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>{settings?.address || SCHOOL_ADDRESS}</li>
            {(settings?.phones || []).map((p) => <li key={p}><a href={telHref(p)} className="hover:text-gold-light transition-colors">{p}</a></li>)}
            {(settings?.emails || []).map((e) => <li key={e}><a href={`mailto:${e}`} className="hover:text-gold-light transition-colors">{e}</a></li>)}
          </ul>
          <div className="flex items-center gap-3 mt-5">
            <a
              href="https://www.instagram.com/mrvpublicschool7"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/mrvschool/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8h3.1z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-max py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {year} {settings?.schoolName || 'M.R. Vivekananda Public School'}. All rights reserved.</span>
          <span className="font-mono">{settings?.affiliationNumber ? `Affiliation No. ${settings.affiliationNumber}` : ''}</span>
        </div>
      </div>
    </footer>
  );
}