import Section from '@/components/Section';
import SectionHeader from '@/components/SectionHeader';
import AdmissionEnquiryForm from '@/components/AdmissionEnquiryForm';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { absoluteUrl, staticPageMeta } from '@/lib/seo';

export const metadata = staticPageMeta('Admission', 'Admission process at M.R. Vivekananda Public School, New Delhi — eligibility, steps and enquiry form.', '/admission');

const STEPS = [
  {
    n: '01',
    title: 'Registration',
    desc: 'Parents are requested to visit the School Admission Office and complete the Pre-Application Form with the required details.',
  },
  {
    n: '02',
    title: 'Pre-Admission Assessment',
    desc: 'Admission is offered on a First Come, First Served basis, subject to the availability of seats. Depending on the class, the child may be required to appear for a written pre-admission assessment and interaction. The date and time will be communicated to the parents by the school.',
  },
  {
    n: '03',
    title: 'Result & Seat Availability',
    desc: "After the assessment and interaction, the admission status will be determined based on the child's performance and the availability of seats.",
  },
  {
    n: '04',
    title: 'Parent Interaction & Campus Visit',
    desc: 'Shortlisted parents/guardians will be invited to visit the school campus and understand the culture, ethos, academic approach, and values of the institution. A meeting with the Vice Principal will also be scheduled for a detailed interaction with the parents.',
  },
  {
    n: '05',
    title: 'Admission Confirmation',
    desc: 'After the interaction, parents will be required to complete the admission formalities, make the applicable fee payment, and submit all required documents at the Admission Desk.',
  },
  {
    n: '06',
    title: 'Document Verification',
    desc: 'All submitted documents will be verified against the original documents. Admission will be confirmed only after successful verification and completion of all required formalities.',
  },
];

const DOCUMENTS = [
  {
    title: "Date of Birth Certificate",
    desc: "Mentioning the child's full name, father's name, and mother's name. Please ensure that all details are accurate, as the same information will be used for the school admission records.",
  },
  {
    title: 'Aadhaar Card / ID',
    desc: 'Of the child and both parents, duly self-attested by the parents. The details on the Aadhaar should match the details mentioned on the Date of Birth Certificate.',
  },
  {
    title: 'School Leaving / Transfer Certificate',
    desc: 'Original copy, wherever applicable.',
  },
  {
    title: 'Academic / Marks Record',
    desc: 'From Class II onwards, wherever applicable.',
  },
  {
    title: 'Photographs',
    desc: 'Two recent passport-size photographs of the child and parents.',
  },
  {
    title: 'Health / Medical Records',
    desc: 'Wherever applicable, if the child has any ongoing medical condition or specific health requirement.',
  },
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
        <p className="text-sm text-slate leading-relaxed max-w-3xl mb-10">
          At MRV Public School, we believe that the admission process should be simple, transparent, and
          parent-friendly. The process is designed to help parents understand our school's culture, values, and
          educational approach while ensuring the right academic fit for every child.
        </p>

        <div className="relative max-w-3xl">
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-line hidden sm:block" />
          <div className="space-y-8">
            {STEPS.map((s) => (
              <div key={s.n} className="relative flex gap-5">
                <div className="hidden sm:flex flex-none w-14 h-14 rounded-full bg-paper2 border border-line items-center justify-center font-display font-bold text-gold z-10 bg-white">
                  {s.n}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-display font-semibold text-ink text-lg">
                    <span className="sm:hidden text-gold mr-2">{s.n}</span>
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
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

            <div className="bg-white rounded-card border border-line p-6 mb-6">
              <h3 className="font-display font-semibold text-ink mb-4">Documents Required for Admission</h3>
              <p className="text-sm text-slate mb-4">Parents are requested to keep the following documents ready:</p>
              <ul className="space-y-4">
                {DOCUMENTS.map((d, i) => (
                  <li key={d.title} className="flex gap-3">
                    <span className="flex-none w-6 h-6 rounded-full bg-red/10 text-red text-xs font-semibold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{d.title}</p>
                      <p className="text-sm text-slate leading-relaxed mt-0.5">{d.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-card border border-line p-6 mb-6">
              <h3 className="font-display font-semibold text-ink mb-2">Important Note</h3>
              <p className="text-sm text-slate leading-relaxed">
                Admission is subject to seat availability, successful completion of the assessment/interaction,
                document verification, and fulfilment of the school's admission requirements. For further
                information or assistance regarding admission, parents may contact the School Admission Office.
              </p>
            </div>

            <div className="flex gap-4 mt-6 flex-wrap">
              <Link href={absoluteUrl('/admission/fees')} className="font-semibold text-sm text-red hover:text-red-dark">Fee Structure →</Link>
              <Link href={absoluteUrl('/admission/scholarships')} className="font-semibold text-sm text-red hover:text-red-dark">Scholarships →</Link>
              <Link href={absoluteUrl('/admission/faq')} className="font-semibold text-sm text-red hover:text-red-dark">FAQs →</Link>
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