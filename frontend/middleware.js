import { NextResponse } from 'next/server';

// 1) www → non-www (301) for backlinks/SEO.
// 2) Pass the request pathname to server components (self-referencing canonical + og:url).
export function middleware(req) {
  const host = (req.headers.get('host') || '').toLowerCase();
  if (host.startsWith('www.')) {
    const url = req.nextUrl.clone();
    url.host = host.slice(4);
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url, 301);
  }
  const headers = new Headers(req.headers);
  headers.set('x-pathname', req.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml)$).*)'],
};
