import { headers } from 'next/headers';
import { Petrona, Manrope, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSettings } from '@/lib/api';
import { mediaUrl } from '@/lib/media';
import { SITE_URL, SITE_NAME, absoluteUrl, DEFAULT_FAVICON, GOOGLE_SITE_VERIFICATION } from '@/lib/seo';

const petrona = Petrona({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-petrona', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-plex-mono', display: 'swap' });

export async function generateMetadata() {
  const settings = await getSettings();
  const favicon = mediaUrl(settings?.faviconUrl) || DEFAULT_FAVICON;
  const pathname = (await headers()).get('x-pathname') || '/';
  const url = absoluteUrl(pathname);
  const title = settings?.seoDefaultTitle || settings?.schoolName || SITE_NAME;
  const description =
    settings?.seoDefaultDescription ||
    'M.R. Vivekananda Public School (MRVPS) — a CBSE-affiliated school committed to academic excellence, character building, and holistic development.';
  const ogImage = mediaUrl(settings?.ogImageUrl || settings?.logoUrl) || DEFAULT_FAVICON;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: url },
    icons: { icon: favicon, shortcut: favicon, apple: favicon },
    verification: { google: GOOGLE_SITE_VERIFICATION },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: [{ url: ogImage, alt: SITE_NAME }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en" className={`${petrona.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body className="font-body bg-paper text-ink antialiased">
        <Navbar settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
