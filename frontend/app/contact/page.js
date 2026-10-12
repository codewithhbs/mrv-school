import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import ContactForm from '@/components/ContactForm';
import { getSettings } from '@/lib/api';
import PageHero from '@/components/PageHero';
import { PhoneLinks, EmailLinks } from '@/components/ContactLinks';
import { SCHOOL_ADDRESS, staticPageMeta } from '@/lib/seo';

export const metadata = staticPageMeta('Contact Us', 'Contact M.R. Vivekananda Public School — 36B, Krishna Park Extn, New Mahavir Nagar, New Delhi 110018. Phone, email and map.', '/contact');

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="We'd Love to Hear From You"
        crumbs={[{ label: 'Contact' }]}
      />

      <Section bg="white">
        <div className="grid lg:grid-cols-2 gap-14">
          <div>
            <SectionHeader eyebrow="Reach Us" title="School Address & Contact Details" />
            <div className="space-y-4 text-slate mb-8">
              <p><strong className="text-ink">Address:</strong> {settings?.address || SCHOOL_ADDRESS}</p>
              <p><strong className="text-ink">Phone:</strong> <PhoneLinks phones={settings?.phones} fallback="Add a phone number in settings." /></p>
              <p><strong className="text-ink">Email:</strong> <EmailLinks emails={settings?.emails} fallback="Add an email in settings." /></p>
              <p><strong className="text-ink">Office Hours:</strong> {settings?.officeHours || '8:00 AM – 3:00 PM, Mon–Sat'}</p>
            </div>
            <div className="flex items-center gap-3 mb-8">
              <a
                href="https://www.instagram.com/mrvpublicschool7"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-slate hover:text-gold hover:border-gold transition-colors"
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
                className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-slate hover:text-gold hover:border-gold transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8h3.1z" />
                </svg>
              </a>
            </div>
            <div className="rounded-card overflow-hidden border border-line aspect-video bg-paper">
              {settings?.mapEmbedUrl ? (
                <iframe src={settings.mapEmbedUrl} className="w-full h-full" loading="lazy" title="School location map" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate/50 font-display">Map will appear here</div>
              )}
            </div>
          </div>
          <div>
            <SectionHeader eyebrow="Send a Message" title="Contact Form" />
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}