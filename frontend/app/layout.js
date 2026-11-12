import { headers } from 'next/headers';
import Script from 'next/script';
import { Manrope } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingEnquiry from '@/components/FloatingEnquiry';
import { getSettings } from '@/lib/api';
import { mediaUrl, MEDIA_ORIGIN } from '@/lib/media';
import { SITE_URL, SITE_NAME, absoluteUrl, DEFAULT_FAVICON, GOOGLE_SITE_VERIFICATION } from '@/lib/seo';

const GTM_ID = 'GTM-TXSFG6NM';

const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope', display: 'swap' });

export async function generateMetadata() {
  const settings = await getSettings();
  const favicon = mediaUrl(settings?.faviconUrl) || DEFAULT_FAVICON;
  const pathname = (await headers()).get('x-pathname') || '/';
  const url = absoluteUrl(pathname);
  const title = settings?.seoDefaultTitle || settings?.schoolName || SITE_NAME;
  const description =
    settings?.seoDefaultDescription ||
    'MRV Public School (MRVPS) — a CBSE-affiliated school committed to academic excellence, character building, and holistic development.';
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
    <html lang="en" className={`${manrope.variable}`}>
      <head>
        {/* Banner / uploaded images are served from the API origin — open the connection early */}
        <link rel="preconnect" href={MEDIA_ORIGIN} crossOrigin="" />
        <link rel="dns-prefetch" href={MEDIA_ORIGIN} />
      </head>
      <body className="font-body bg-paper text-ink antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Navbar settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
        <FloatingEnquiry />
        {/* Google Tag Manager — loaded after the page is interactive so it doesn't block rendering */}
        <Script id="gtm" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {/* End Google Tag Manager */}
      </body>
    </html>
  );
}
