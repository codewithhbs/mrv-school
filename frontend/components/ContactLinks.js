// Clickable phone / email lists (tel: / mailto:).
export function telHref(p) {
  return `tel:${String(p || '').replace(/[^\d+]/g, '')}`;
}

export function PhoneLinks({ phones = [], fallback = null, separator = ', ', className = 'contact-link' }) {
  const list = (phones || []).filter(Boolean);
  if (!list.length) return fallback;
  return list.map((p, i) => (
    <span key={p}>
      {i > 0 && separator}
      <a href={telHref(p)} className={className}>{p}</a>
    </span>
  ));
}

export function EmailLinks({ emails = [], fallback = null, separator = ', ', className = 'contact-link' }) {
  const list = (emails || []).filter(Boolean);
  if (!list.length) return fallback;
  return list.map((e, i) => (
    <span key={e}>
      {i > 0 && separator}
      <a href={`mailto:${e}`} className={className}>{e}</a>
    </span>
  ));
}
