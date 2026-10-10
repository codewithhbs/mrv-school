// Post-processes sanitized editor HTML (see backend/src/middleware/richText.js)
// before it is rendered with dangerouslySetInnerHTML.
//  - wraps <table> in a scroll container (mobile)
//  - strips empty paragraphs left behind by Google Docs / Word pastes
//  - strips <colgroup> widths from the editor so tables stay fluid
//  - makes media URLs (/uploads/...) absolute
import { mediaUrl } from '@/lib/media';

export function prepareRichHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<colgroup>[\s\S]*?<\/colgroup>/gi, '')
    .replace(/\s(colwidth|style)="[^"]*min-width[^"]*"/gi, '')
    .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
    .replace(/<table/gi, '<div class="rc-table"><table')
    .replace(/<\/table>/gi, '</table></div>')
    .replace(/(<img[^>]*\ssrc=")(\/[^"]+)"/gi, (_, a, src) => `${a}${mediaUrl(src)}"`);
}

export function richHtmlToText(html) {
  if (!html) return '';
  return String(html)
    .replace(/<\/(p|h[1-6]|li|tr|td|th|div)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function RichContent({ html, className = '' }) {
  const out = prepareRichHtml(html);
  if (!out) return null;
  // Content is sanitized server-side before it is stored.
  return <div className={`rich-content ${className}`} dangerouslySetInnerHTML={{ __html: out }} />;
}
