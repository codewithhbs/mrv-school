import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import FAQAccordion from '@/components/FAQAccordion';
import EmptyState from '@/components/EmptyState';
import { getFAQs } from '@/lib/api';
import { absoluteUrl, staticPageMeta } from '@/lib/seo';

export const metadata = staticPageMeta('Admission FAQs', 'Frequently asked questions about admissions at M.R. Vivekananda Public School.', '/admission/faq');

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <>
      <PageHero eyebrow="Admission" title="Frequently Asked Questions" crumbs={[{ label: 'Admission', href: absoluteUrl('/admission') }, { label: 'FAQs' }]} />
      <Section bg="white">
      {faqs?.length ? <FAQAccordion items={faqs} /> : <EmptyState title="No FAQs published yet" />}
      </Section>
    </>
  );
}
