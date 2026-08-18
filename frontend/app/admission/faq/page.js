import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import FAQAccordion from '@/components/FAQAccordion';
import EmptyState from '@/components/EmptyState';
import { getFAQs } from '@/lib/api';

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <>
      <PageHero eyebrow="Admission" title="Frequently Asked Questions" crumbs={[{ label: 'Admission', href: '/admission' }, { label: 'FAQs' }]} />
      <Section bg="white">
      {faqs?.length ? <FAQAccordion items={faqs} /> : <EmptyState title="No FAQs published yet" />}
      </Section>
    </>
  );
}
