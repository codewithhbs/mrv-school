import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import AdmissionEnquiryForm from '@/components/AdmissionEnquiryForm';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

const STEPS = [
  { n: '01', title: 'Enquiry', desc: 'Submit the admission enquiry form below with your details.' },
  { n: '02', title: 'Document Verification', desc: 'Our team reviews the required documents for eligibility.' },
  { n: '03', title: 'Interaction', desc: 'A short interaction with the student and parents is scheduled.' },
  { n: '04', title: 'Offer & Fee Payment', desc: 'On selection, complete admission by paying the fee.' },
  { n: '05', title: 'Confirmed Admission', desc: 'Welcome to MRVPS — orientation details are shared.' },
];

const DOCUMENTS = [
  'Birth certificate (original + copy)',
  "Previous school's transfer certificate (for Class 2 and above)",
  'Report card / mark sheet of the previous class',
  "Aadhaar card of the student and parents",
  'Passport-size photographs (student and parents)',
  'Address proof',
];

export default function AdmissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Admission 2026–27"
        title="Begin Your Child's Journey at MRVPS"
        description="We welcome applications for Pre-Primary through Senior Secondary. Explore the process below, or reach straight for the enquiry form when you're ready."
        crumbs={[{ label: 'Admission' }]}
      />

      <Section bg="white" id="process">
        <SectionHeader eyebrow="How It Works" title="Admission Process" />
        <div className="grid md:grid-cols-5 gap-5">
          {STEPS.map((s) => (
            <div key={s.n} className="relative">
              <div className="font-display font-bold text-3xl text-gold/70">{s.n}</div>
              <h3 className="font-display font-semibold text-ink mt-2">{s.title}</h3>
              <p className="text-sm text-slate mt-1.5 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="paper2">
        <div className="grid lg:grid-cols-2 gap-14">
          <div>
            <SectionHeader eyebrow="Before You Apply" title="Eligibility & Documents Required" />
            <div className="bg-white rounded-card border border-line p-6 mb-6">
              <h3 className="font-display font-semibold text-ink mb-2">Eligibility Criteria</h3>
              <p className="text-sm text-slate leading-relaxed">
                Age criteria follow CBSE and state education department norms for each class. Specific age-cutoff
                dates for the upcoming session are shared during the enquiry process.
              </p>
            </div>
            <div className="bg-white rounded-card border border-line p-6">
              <h3 className="font-display font-semibold text-ink mb-3">Documents Required</h3>
              <ul className="space-y-2">
                {DOCUMENTS.map((d) => (
                  <li key={d} className="flex gap-2.5 text-sm text-slate">
                    <span className="text-red mt-0.5">✓</span>{d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4 mt-6 flex-wrap">
              <Link href="/admission/fees" className="font-semibold text-sm text-red hover:text-red-dark">Fee Structure →</Link>
              <Link href="/admission/scholarships" className="font-semibold text-sm text-red hover:text-red-dark">Scholarships →</Link>
              <Link href="/admission/faq" className="font-semibold text-sm text-red hover:text-red-dark">FAQs →</Link>
            </div>
          </div>

          <div>
            <SectionHeader eyebrow="Get Started" title="Admission Enquiry Form" />
            <AdmissionEnquiryForm />
          </div>
        </div>
      </Section>
    </>
  );
}
