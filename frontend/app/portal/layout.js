import { PortalAuthProvider } from '@/context/PortalAuthContext';

// Nested layout for the /portal route group. The root layout (app/layout.js)
// still wraps this with the public site's Navbar/Footer, so a parent can
// always navigate back to the main site — this layer just adds the portal's
// own auth context around the login page and dashboard.
export const metadata = {
  title: 'Parent & Student Portal — MRVPS',
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }) {
  return <PortalAuthProvider>{children}</PortalAuthProvider>;
}
