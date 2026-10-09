import Link from 'next/link';
import Section from '@/components/Section';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';

export const metadata = {
  title: `Thank You | ${SITE_NAME}`,
  description: 'Your submission has been received.',
  alternates: { canonical: absoluteUrl('/thank-you') },
  robots: { index: false, follow: true },
};

const MESSAGES = {
  admission: {
    heading: 'Thank you for your admission enquiry!',
    text: 'We have received your enquiry. Our admissions team will contact you shortly.',
    steps: [
      'Our team reviews your enquiry',
      'We call you to discuss details',
      'Schedule a campus visit',
    ],
  },
  contact: {
    heading: 'Thank you for contacting us!',
    text: 'We have received your message and will get back to you soon.',
    steps: [
      'We read your message',
      'The right team member picks it up',
      'You get a reply on your email or phone',
    ],
  },
  alumni: {
    heading: 'Welcome back to the MRVPS family!',
    text: "Your alumni registration has been received. We'll keep you posted about alumni meets and updates.",
    steps: [
      'We verify your details',
      'You join the alumni network',
      'Get updates on meets and events',
    ],
  },
  career: {
    heading: 'Thank you for applying!',
    text: 'Your application has been received. Our HR team will reach out if there is a match.',
    steps: [
      'HR reviews your application',
      'Shortlisted candidates are contacted',
      'Interview and final selection',
    ],
  },
};

const DEFAULT = {
  heading: 'Thank you!',
  text: 'Your submission has been received. We will get back to you soon.',
  steps: [
    'We review your submission',
    'Our team gets in touch',
    'We help with the next step',
  ],
};

export default function ThankYouPage({ searchParams }) {
  const m = MESSAGES[searchParams?.type] || DEFAULT;

  return (
    <Section bg="white">
      <div className="relative max-w-2xl mx-auto">
        {/* soft background glow */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-red/10 blur-3xl" />

        <div className="relative rounded-3xl border border-line bg-white shadow-xl shadow-black/5 px-6 py-12 sm:px-12 text-center">
          {/* animated check */}
          <div className="relative w-24 h-24 mx-auto">
            <span className="absolute inset-0 rounded-full bg-red/15 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-red/10" />
            <div className="absolute inset-3 rounded-full bg-red text-white flex items-center justify-center shadow-lg shadow-red/30">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>

          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-ink mt-8 leading-tight">
            {m.heading}
          </h1>
          <p className="text-slate mt-4 leading-relaxed max-w-md mx-auto">{m.text}</p>

          {/* what happens next */}
          <div className="mt-10 text-left rounded-2xl bg-red/5 border border-red/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-red mb-4">
              What happens next
            </p>
            <ol className="space-y-4">
              {m.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-red text-white text-sm font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-ink pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href={absoluteUrl('/')}
              className="bg-red text-white font-semibold px-8 py-3 rounded-full shadow-md shadow-red/20 hover:bg-red-dark hover:-translate-y-0.5 transition-all"
            >
              Back to Home
            </Link>
            <Link
              href={absoluteUrl('/contact')}
              className="border border-line text-ink font-semibold px-8 py-3 rounded-full hover:border-red/40 hover:text-red transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}