'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { mediaUrl } from '@/lib/media';

const NAV = [
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'School Overview', href: '/about#overview' },
      { label: 'Vision & Mission', href: '/about/vision-mission' },
      { label: 'History', href: '/about/history' },
      { label: "Chairman's Message", href: '/about/chairmans-message' },
      { label: "Principal's Message", href: '/about/principals-message' },
      { label: 'School Leadership', href: '/about/leadership' },
      { label: 'Infrastructure', href: '/about/infrastructure' },
      { label: 'School Rules & Policies', href: '/about/rules-policies' },
    ],
  },
  {
    label: 'Academics',
    href: '/academics',
    children: [
      { label: 'Curriculum & Levels', href: '/academics' },
      { label: 'Teaching Methodology', href: '/academics/methodology' },
      { label: 'Examination System', href: '/academics/examinations' },
      { label: 'Academic Calendar', href: '/academics/calendar' },
    ],
  },
  {
    label: 'Admission',
    href: '/admission',
    children: [
      { label: 'Admission Process', href: '/admission#process' },
      { label: 'Fee Structure', href: '/admission/fees' },
      { label: 'Scholarships', href: '/admission/scholarships' },
      { label: 'FAQs', href: '/admission/faq' },
    ],
  },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Student Life', href: '/student-life' },
  { label: 'Faculty', href: '/faculty' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'News & Events', href: '/news-events' },
  {
    label: 'More',
    href: '/parents-corner',
    children: [
      { label: 'Parents Corner', href: '/parents-corner' },
      { label: 'Students Corner', href: '/students-corner' },
      { label: 'Alumni', href: '/alumni' },
      { label: 'Careers', href: '/careers' },
      { label: 'Downloads', href: '/downloads' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({ settings }) {
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const phone = settings?.phones?.[1] || '+91 00000 00000';
  const email = settings?.emails?.[0] || 'info@mrvps.org';
  const logo = mediaUrl(settings?.logoUrl);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-red text-white">
        <div className="container-max flex items-center justify-between py-1.5 text-xs">
          <div className="flex items-center gap-4 font-body">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-gold-light transition-colors">
              {phone}
            </a>
            <span className="hidden sm:inline opacity-50">|</span>
            <a href={`mailto:${email}`} className="hidden sm:inline hover:text-gold-light transition-colors">
              {email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="eyebrow hidden md:inline">{settings?.board || 'CBSE'} Affiliated</span>
            <Link href="/admission" className="font-mono text-[11px] tracking-wide bg-gold text-ink px-2.5 py-0.5 rounded-full hover:bg-gold-light transition-colors">
              Admission Open
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white/95 backdrop-blur border-b border-line shadow-sm">
        <div className="container-max flex items-center justify-between py-1">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {logo ? (
              <Image src={'/images/logo.png'} alt={settings?.schoolName || 'School logo'} width={44} height={44} className="w-24 h-24 object-contain rounded-full" unoptimized />
            ) : (
              <div className="seal w-11 h-11 text-red bg-paper2">
                <span className="font-display font-bold text-lg text-red">M</span>
              </div>
            )}
            {/* <div className="leading-tight hidden sm:block">
              <div className="font-display font-bold text-lg text-ink">{settings?.schoolName || 'M.R. Vivekananda Public School'}</div>
              <div className="eyebrow text-slate">{settings?.tagline || 'Excellence in Education'}</div>
            </div> */}
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpen(item.label)}
                onMouseLeave={() => setOpen(null)}
              >
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-ink hover:text-red transition-colors inline-flex items-center gap-1"
                >
                  {item.label}
                  {item.children && (
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="opacity-60">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </Link>
                {item.children && open === item.label && (
                  <div className="absolute left-0 top-full pt-2 w-64">
                    <div className="bg-white rounded-card shadow-cardHover border border-line py-2">
                      {item.children.map((c) => (
                        <Link
                          key={c.label}
                          href={c.href}
                          className="block px-4 py-2 text-sm text-ink hover:bg-paper2 hover:text-red transition-colors"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className={`block w-6 h-0.5 bg-ink transition-transform ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-6 h-0.5 bg-ink transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-ink transition-transform ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-line bg-white max-h-[75vh] overflow-y-auto">
            {NAV.map((item) => (
              <div key={item.label} className="border-b border-line last:border-0">
                <Link href={item.href} className="block px-5 py-3 font-medium text-ink" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pb-2">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="block px-8 py-2 text-sm text-slate"
                        onClick={() => setMobileOpen(false)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
