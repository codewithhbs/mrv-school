'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdmissionEnquiryForm from '@/components/AdmissionEnquiryForm';

// Floating "Admission Enquiry" button + slide-in panel, available on every public page.
const HIDDEN_ON = ['/portal', '/thank-you'];

export default function FloatingEnquiry() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '/';

  // close the panel on navigation (e.g. after a successful submit)
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admission enquiry form"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-red text-white font-semibold text-sm rounded-full pl-4 pr-5 py-3 shadow-cardHover hover:bg-red-dark transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Admission Enquiry
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Admission enquiry form">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-0 sm:right-5 sm:bottom-5 w-full sm:w-[440px] max-h-[92vh] sm:max-h-[85vh] flex flex-col bg-paper rounded-t-2xl sm:rounded-2xl shadow-cardHover border border-line">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-ink text-white rounded-t-2xl">
              <div>
                <div className="eyebrow text-gold">Get Started</div>
                <div className="font-display font-bold text-base leading-tight">Admission Enquiry Form</div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close enquiry form" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-gold hover:border-gold transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <AdmissionEnquiryForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
