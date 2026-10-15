// Social media icons. `active: false` renders the icon greyed-out and non-clickable.
// After beta testing: set `active: true` and fill in the `href` to switch a link on.
const SOCIALS = [
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/mrvpublicschool7', active: true,
    icon: (<><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="currentColor" /></>) },
  { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/mrvschool/', active: true,
    icon: <path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8h3.1z" /> },
  { key: 'whatsapp', label: 'WhatsApp', href: '', active: false,
    icon: (<><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.4L3 21z" /><path fill="currentColor" d="M9 8.5c0 3.3 2.7 6 6 6l1-1.4-1.9-.9-.8.6a4 4 0 0 1-1.7-1.7l.6-.8-.9-1.9L9 8.5z" /></>) },
  { key: 'youtube', label: 'YouTube', href: '', active: false,
    icon: (<><rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth="2" /><path fill="currentColor" d="M10 9.2v5.6l5-2.8-5-2.8z" /></>) },
  { key: 'twitter', label: 'X (Twitter)', href: '', active: false,
    icon: <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 4l16 16M20 4L4 20" /> },
  { key: 'linkedin', label: 'LinkedIn', href: '', active: false,
    icon: (<><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><path fill="currentColor" d="M7 10h2v7H7zM8 6.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM11 10h1.9v1c.4-.7 1.2-1.2 2.3-1.2 2 0 2.8 1.2 2.8 3.2V17h-2v-3.5c0-.9-.3-1.6-1.2-1.6-.9 0-1.8.6-1.8 1.8V17h-2z" /></>) },
];

const base = 'w-9 h-9 rounded-full border flex items-center justify-center';

export default function SocialIcons({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {SOCIALS.map((s) => {
        const svg = <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">{s.icon}</svg>;
        if (s.active && s.href) {
          return (
            <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
              className={`${base} border-white/20 text-white/70 hover:text-gold hover:border-gold transition-colors`}>
              {svg}
            </a>
          );
        }
        return (
          <span key={s.key} role="img" aria-label={`${s.label} (coming soon)`} aria-disabled="true" title="Coming soon"
            className={`${base} border-white/10 text-white/30 cursor-not-allowed select-none`}>
            {svg}
          </span>
        );
      })}
    </div>
  );
}
