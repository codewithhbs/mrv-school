import Section from '@/components/Section';
import EmptyState from '@/components/EmptyState';
import { getDownloads } from '@/lib/api';
import { mediaUrl } from '@/lib/media';
import PageHero from '@/components/PageHero';
import { staticPageMeta } from '@/lib/seo';

export const metadata = staticPageMeta('Downloads', 'Download admission forms, prospectus, holiday list, academic calendar and TC request form.', '/downloads');

const CATEGORY_LABEL = {
  'admission-form': 'Admission Form',
  prospectus: 'School Prospectus',
  'holiday-list': 'Holiday List',
  'academic-calendar': 'Academic Calendar',
  'tc-form': 'TC Form',
  certificate: 'Certificates',
  other: 'Other Downloads',
};

export default async function DownloadsPage() {
  const downloads = await getDownloads();
  const grouped = (downloads || []).filter((d) => d.fileUrl && d.isActive !== false).reduce((acc, d) => {
    acc[d.category] = acc[d.category] || [];
    acc[d.category].push(d);
    return acc;
  }, {});

  return (
    <>
      <PageHero
        eyebrow="Downloads"
        title="Forms & Documents"
        crumbs={[{ label: 'Downloads' }]}
      />

      <Section bg="white">
        {Object.keys(grouped).length ? (
          <div className="space-y-10">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <h2 className="font-display font-semibold text-xl text-ink mb-4">{CATEGORY_LABEL[cat] || cat}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((d) => (
                    <a key={d._id} href={mediaUrl(d.fileUrl)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-paper rounded-card border border-line px-5 py-4 hover:border-red/30 hover:shadow-card transition-all">
                      <span className="font-mono text-xs uppercase bg-red text-white px-2 py-1 rounded">{d.fileType || 'file'}</span>
                      <span className="text-sm font-medium text-ink">{d.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No documents published yet" description="Forms and documents will appear here once uploaded from the admin panel." />
        )}
      </Section>
    </>
  );
}
