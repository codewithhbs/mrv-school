import Link from 'next/link';
import Image from 'next/image';
import { mediaUrl } from '@/lib/media';

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
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/academics" className="hover:text-white transition-colors">Academics</Link></li>
            <li><Link href="/admission" className="hover:text-white transition-colors">Admission</Link></li>
            <li><Link href="/facilities" className="hover:text-white transition-colors">Facilities</Link></li>
            <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-gold mb-4">Quick Links</div>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href="/parents-corner" className="hover:text-white transition-colors">Parents Corner</Link></li>
            <li><Link href="/students-corner" className="hover:text-white transition-colors">Students Corner</Link></li>
            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="/downloads" className="hover:text-white transition-colors">Downloads</Link></li>
            <li><Link href="/alumni" className="hover:text-white transition-colors">Alumni</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-gold mb-4">Reach Us</div>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>{settings?.address || 'School Address, City, State — PIN'}</li>
            {(settings?.phones || []).map((p) => <li key={p}>{p}</li>)}
            {(settings?.emails || []).map((e) => <li key={e}>{e}</li>)}
          </ul>
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
