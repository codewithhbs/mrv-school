import { Petrona, Manrope, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSettings } from '@/lib/api';
import { mediaUrl } from '@/lib/media';

const petrona = Petrona({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-petrona', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-plex-mono', display: 'swap' });

export async function generateMetadata() {
  const settings = await getSettings();
  const favicon = mediaUrl(settings?.faviconUrl);
  return {
    title: settings?.seoDefaultTitle || settings?.schoolName || 'M.R. Vivekananda Public School',
    description:
      settings?.seoDefaultDescription ||
      'M.R. Vivekananda Public School (MRVPS) — a CBSE-affiliated school committed to academic excellence, character building, and holistic development.',
    icons: favicon ? { icon: favicon, shortcut: favicon, apple: favicon } : undefined,
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
