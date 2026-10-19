'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { mediaUrl } from '@/lib/media';
import { absoluteUrl } from '@/lib/seo';

const NAV = [
  {
    label: 'About',
    href: absoluteUrl('/about'),
    children: [
      { label: 'School Overview', href: absoluteUrl('/about#overview') },
      { label: 'Vision & Mission', href: absoluteUrl('/about/vision-mission') },
      { label: 'History', href: absoluteUrl('/about/history') },
      { label: "Chairman's Message", href: absoluteUrl('/about/chairmans-message') },
      { label: "Principal's Message", href: absoluteUrl('/about/principals-message') },
      { label: "Manager's Message", href: absoluteUrl('/about/managers-message') },
      { label: "Vice Principal's Message", href: absoluteUrl('/about/vice-principals-message') },
      { label: 'School Leadership', href: absoluteUrl('/about/leadership') },
      { label: 'Infrastructure', href: absoluteUrl('/about/infrastructure') },
      { label: 'School Rules & Policies', href: absoluteUrl('/about/rules-policies') },
    ],
  },
  {
    label: 'Academics',
    href: absoluteUrl('/academics'),
    children: [
      { label: 'Curriculum & Levels', href: absoluteUrl('/academics') },
      { label: 'Teaching Methodology', href: absoluteUrl('/academics/methodology') },
      { label: 'Examination System', href: absoluteUrl('/academics/examinations') },
      { label: 'Academic Calendar', href: absoluteUrl('/academics/calendar') },
    ],
  },
  {
    label: 'Admission',
    href: absoluteUrl('/admission'),
    children: [
      { label: 'Admission Process', href: absoluteUrl('/admission#process') },
      { label: 'Fee Structure', href: absoluteUrl('/admission/fees') },
      { label: 'Scholarships', href: absoluteUrl('/admission/scholarships') },
      { label: 'FAQs', href: absoluteUrl('/admission/faq') },
    ],
  },
  { label: 'Facilities', href: absoluteUrl('/facilities') },
  { label: 'Student Life', href: absoluteUrl('/student-life') },
  { label: 'Faculty', href: absoluteUrl('/faculty') },
  { label: 'Gallery', href: absoluteUrl('/gallery') },
  { label: 'News & Events', href: absoluteUrl('/news-events') },
  {
    label: 'More',
    href: absoluteUrl('/parents-corner'),
    children: [
      { label: 'Parents Corner', href: absoluteUrl('/parents-corner') },
      { label: 'Students Corner', href: absoluteUrl('/students-corner') },
      { label: 'Alumni', href: absoluteUrl('/alumni') },
      { label: 'Careers', href: absoluteUrl('/careers') },
      { label: 'Downloads', href: absoluteUrl('/downloads') },
    ],
  },
  { label: 'Contact', href: absoluteUrl('/contact') },
];

export default function Navbar({ settings }) {
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() || '/';

  const email = settings?.emails?.[0] || 'info@mrvpublicschool.com';
  const address = settings?.shortAddress || 'New Mahavir Nagar, New Delhi';
  const logo = settings?.logoUrl ? mediaUrl(settings.logoUrl) : '/images/logo.png';
  const name = settings?.schoolName || 'M.R. Vivekananda Public School';

  const isActive = (href) => {
    try {
      const path = new URL(href, 'http://x').pathname;
      return path === '/' ? pathname === '/' : pathname.startsWith(path);
    } catch { return false; }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-navy text-white">
        <div className="container-max flex items-center justify-between py-2 text-xs">
          <div className="flex items-center gap-5">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
              {address}
            </span>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-gold-light transition-colors">
              <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
              {email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href={absoluteUrl('/portal/login')} className="hidden md:inline hover:text-gold-light transition-colors">Student Login</Link>
            <Link href={absoluteUrl('/portal/login')} className="hidden md:inline hover:text-gold-light transition-colors">Parent Login</Link>
            <Link href={absoluteUrl('/admission')} className="inline-flex items-center gap-1.5 bg-gold text-ink font-semibold px-4 py-1.5 rounded-full hover:bg-gold-light transition-colors">
              Apply Now <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white/95 backdrop-blur border-b border-line shadow-sm">
        <div className="container-max flex items-center justify-between gap-4 py-2">
          <Link href={absoluteUrl('/')} className="flex items-center gap-3 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={name} className="w-14 h-14 object-contain rounded-full" />
            <div className="leading-tight hidden sm:block">
              <div className="font-display font-bold text-[17px] text-navy uppercase tracking-wide">MRV Public School</div>
              <div className="text-[11px] text-slate">{settings?.tagline || 'Knowledge • Character • Excellence'}</div>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center">
            {[{ label: 'Home', href: absoluteUrl('/') }, ...NAV].map((item) => {
              const active = isActive(item.href);
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpen(item.label)}
                  onMouseLeave={() => setOpen(null)}
                >
                  <Link
                    href={item.href}
                    className={`relative px-2.5 py-5 text-[13px] font-semibold inline-flex items-center gap-1 transition-colors ${active ? 'text-gold-dark' : 'text-ink hover:text-red'}`}
                  >
                    {item.label}
                    {item.children && (
                      <svg width="9" height="6" viewBox="0 0 10 6" fill="none" className="opacity-60">
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                    {active && <span className="absolute left-2.5 right-2.5 bottom-3 h-0.5 rounded-full bg-gold" />}
                  </Link>
                  {item.children && open === item.label && (
                    <div className="absolute left-0 top-full w-64">
                      <div className="bg-white rounded-card shadow-cardHover border border-line py-2">
                        {item.children.map((c) => (
                          <Link key={c.label} href={c.href} className="block px-4 py-2 text-sm text-ink hover:bg-paper hover:text-red transition-colors">
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            
            <button
              className="xl:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className={`block w-6 h-0.5 bg-navy transition-transform ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block w-6 h-0.5 bg-navy transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-navy transition-transform ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="xl:hidden border-t border-line bg-white max-h-[75vh] overflow-y-auto">
            {[{ label: 'Home', href: absoluteUrl('/') }, ...NAV].map((item) => (
              <div key={item.label} className="border-b border-line last:border-0">
                <Link href={item.href} className={`block px-5 py-3 font-semibold ${isActive(item.href) ? 'text-gold-dark' : 'text-ink'}`} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pb-2">
                    {item.children.map((c) => (
                      <Link key={c.label} href={c.href} className="block px-8 py-2 text-sm text-slate" onClick={() => setMobileOpen(false)}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-3 px-5 py-4">
              <Link href={absoluteUrl('/portal/login')} className="flex-1 text-center text-sm font-semibold border border-line rounded-full py-2" onClick={() => setMobileOpen(false)}>Student / Parent Login</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
