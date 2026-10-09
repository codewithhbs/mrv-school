import Link from 'next/link';
import PageHero from '@/components/PageHero';
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
  },
  contact: {
    heading: 'Thank you for contacting us!',
    text: "We have received your message and will get back to you soon.",
  },
  alumni: {
    heading: 'Welcome back to the MRVPS family!',
    text: "Your alumni registration has been received. We'll keep you posted about alumni meets and updates.",
  },
  career: {
    heading: 'Thank you for applying!',
    text: 'Your application has been received. Our HR team will reach out if there is a match.',
  },
};

export default function ThankYouPage({ searchParams }) {
  const m = MESSAGES[searchParams?.type] || {
    heading: 'Thank you!',
    text: 'Your submission has been received. We will get back to you soon.',
  };

  return (
    <>
      <PageHero title="Thank You" eyebrow="Submission Received" crumbs={[{ label: 'Thank You' }]} />
      <Section bg="white">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red/10 text-red flex items-center justify-center">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="font-display font-semibold text-2xl text-ink mt-6">{m.heading}</h2>
          <p className="text-slate mt-3 leading-relaxed">{m.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={absoluteUrl('/')} className="bg-red text-white font-semibold px-6 py-3 rounded-full hover:bg-red-dark transition-colors">
              Back to Home
            </Link>
            <Link href={absoluteUrl('/contact')} className="border border-line text-ink font-semibold px-6 py-3 rounded-full hover:border-red/40 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
