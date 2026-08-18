import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import ContactForm from '@/components/ContactForm';
import { getSettings } from '@/lib/api';
import PageHero from '@/components/PageHero';

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
              <p><strong className="text-ink">Address:</strong> {settings?.address || 'Address to be updated in admin panel.'}</p>
              <p><strong className="text-ink">Phone:</strong> {(settings?.phones || []).join(', ') || 'Add a phone number in settings.'}</p>
              <p><strong className="text-ink">Email:</strong> {(settings?.emails || []).join(', ') || 'Add an email in settings.'}</p>
              <p><strong className="text-ink">Office Hours:</strong> {settings?.officeHours || '8:00 AM – 3:00 PM, Mon–Sat'}</p>
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
