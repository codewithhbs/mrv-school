'use client';

import { useState } from 'react';
import { X, Wand2, CheckCircle2, AlertCircle, XCircle, Search } from 'lucide-react';
import { SITE_URL, slugify, htmlToText, blocksToHtml } from '@/lib/site';

// ---------- Character counter used under SEO text inputs ----------
export function CharCounter({ value, min, max }) {
  const len = (value || '').length;
  let tone = 'text-slate';
  if (len > 0 && len < min) tone = 'text-gold-dark';
  if (len >= min && len <= max) tone = 'text-green-700';
  if (len > max) tone = 'text-red';
  const pct = Math.min(100, Math.round((len / max) * 100));
  const bar = len > max ? 'bg-red' : len >= min ? 'bg-green-600' : 'bg-gold';
  return (
    <div className="mt-1.5">
      <div className="h-1 rounded-full bg-line overflow-hidden">
        <div className={`h-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <p className={`text-[11px] mt-1 ${tone}`}>
        {len} / {max} characters · ideal {min}–{max}
      </p>
    </div>
  );
}

// ---------- Tag / keyword chips (stored as string[]) ----------
export function TagsInput({ field, value, onChange }) {
  const [draft, setDraft] = useState('');
  const tags = Array.isArray(value) ? value : [];

  function addTags(raw) {
    const parts = raw.split(',').map((t) => t.trim()).filter(Boolean);
    if (!parts.length) return;
    const lower = new Set(tags.map((t) => t.toLowerCase()));
    const next = [...tags];
    parts.forEach((p) => {
      if (!lower.has(p.toLowerCase())) {
        next.push(p);
        lower.add(p.toLowerCase());
      }
    });
    onChange(next.slice(0, field.maxTags || 20));
    setDraft('');
  }

  return (
    <div>
      <label className="label">{field.label}</label>
      <div className="input !p-1.5 flex flex-wrap gap-1.5 min-h-[44px] focus-within:border-red focus-within:ring-1 focus-within:ring-red">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-md bg-red-50 text-red text-xs font-medium pl-2 pr-1 py-1">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:bg-red/10 rounded p-0.5">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          placeholder={tags.length ? '' : field.placeholder || 'Type and press Enter or comma'}
          className="flex-1 min-w-[140px] px-1.5 text-sm outline-none bg-transparent"
          onChange={(e) => {
            if (e.target.value.includes(',')) addTags(e.target.value);
            else setDraft(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTags(draft);
            } else if (e.key === 'Backspace' && !draft && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          onBlur={() => draft && addTags(draft)}
        />
      </div>
      {field.hint && <p className="text-xs text-slate mt-1">{field.hint}</p>}
    </div>
  );
}

// ---------- Slug with "generate from title" ----------
export function SlugField({ field, value, values, onChange }) {
  const source = values?.[field.source || 'title'] || '';
  return (
    <div>
      <label className="label">
        {field.label} {field.required && <span className="text-red">*</span>}
      </label>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center rounded-lg border border-line bg-white focus-within:border-red focus-within:ring-1 focus-within:ring-red overflow-hidden">
          {field.prefix && <span className="pl-3 text-xs text-slate-light whitespace-nowrap">{field.prefix}</span>}
          <input
            type="text"
            className="flex-1 px-2 py-2.5 text-sm outline-none bg-transparent"
            value={value ?? ''}
            required={field.required}
            onChange={(e) => onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            onBlur={(e) => onChange(slugify(e.target.value))}
          />
        </div>
        <button type="button" className="btn-secondary !px-3" title="Generate from title" onClick={() => onChange(slugify(source))} disabled={!source}>
          <Wand2 className="w-4 h-4" />
        </button>
      </div>
      {field.hint && <p className="text-xs text-slate mt-1">{field.hint}</p>}
    </div>
  );
}

// ---------- Section heading inside the form ----------
export function FormHeading({ field }) {
  return (
    <div className="pt-4 mt-2 border-t border-line">
      <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
        {field.icon === 'seo' && <Search className="w-4 h-4 text-red" />}
        {field.label}
      </h3>
      {field.hint && <p className="text-xs text-slate mt-0.5">{field.hint}</p>}
    </div>
  );
}

// ---------- Google preview + SEO checklist ----------
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countMatches(text, kw) {
  if (!kw) return 0;
  const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(kw)}(?=$|[^\\p{L}\\p{N}])`, 'giu');
  return (text.match(re) || []).length;
}

function includesKw(text, kw) {
  return !!kw && (text || '').toLowerCase().includes(kw.toLowerCase());
}

// `n` is a normalized view of the form (see SeoPreview) so the same checks
// work for any resource regardless of its field names.
function runChecks(n, cfg) {
  const kw = (n.focusKeyword || '').trim();
  const title = n.title;
  const desc = n.desc;
  const html = n.html || '';
  const text = htmlToText(html);
  const words = text ? text.split(' ').length : 0;
  const firstPara = htmlToText((html.match(/<p[^>]*>[\s\S]*?<\/p>/i) || [html.slice(0, 600)])[0]);
  const subHeadings = (html.match(/<h[2-4][^>]*>[\s\S]*?<\/h[2-4]>/gi) || []).map(htmlToText).join(' ');
  const imgs = html.match(/<img[^>]*>/gi) || [];
  const imgsNoAlt = imgs.filter((t) => !/alt="[^"]+"/i.test(t)).length;
  const kwWords = kw ? kw.split(/\s+/).length : 1;
  const density = kw && words ? ((countMatches(text, kw) * kwWords) / words) * 100 : 0;
  const canonical = (n.canonicalUrl || '').trim();

  const c = [];
  const push = (status, label) => c.push({ status, label });

  push(kw ? 'good' : 'bad', kw ? `Focus keyword set: "${kw}"` : 'Add a focus keyword');
  push(
    title.length >= cfg.title[0] && title.length <= cfg.title[1] ? 'good' : title.length ? 'warn' : 'bad',
    `SEO title length: ${title.length} chars (ideal ${cfg.title[0]}–${cfg.title[1]})`
  );
  push(
    desc.length >= cfg.desc[0] && desc.length <= cfg.desc[1] ? 'good' : desc.length ? 'warn' : 'bad',
    `Meta description length: ${desc.length} chars (ideal ${cfg.desc[0]}–${cfg.desc[1]})`
  );
  if (kw) {
    push(includesKw(title, kw) ? 'good' : 'bad', 'Focus keyword in SEO title');
    push(title.toLowerCase().startsWith(kw.toLowerCase()) ? 'good' : 'warn', 'Focus keyword near the start of SEO title');
    push(includesKw(desc, kw) ? 'good' : 'bad', 'Focus keyword in meta description');
    if (n.checkSlug) push(includesKw((n.slug || '').replace(/-/g, ' '), kw) ? 'good' : 'warn', 'Focus keyword in URL slug');
    push(includesKw(firstPara, kw) ? 'good' : 'warn', 'Focus keyword in the first paragraph');
    push(includesKw(subHeadings, kw) ? 'good' : 'warn', 'Focus keyword in a sub-heading');
    push(
      density >= 0.5 && density <= 2.5 ? 'good' : words ? 'warn' : 'bad',
      `Keyword density: ${density.toFixed(1)}% (ideal 0.5–2.5%)`
    );
  }
  push(words >= 300 ? 'good' : words >= 150 ? 'warn' : 'bad', `Content length: ${words} words (300+ recommended)`);
  push(n.image ? 'good' : 'warn', n.image ? 'Featured / social image added' : 'Add an image (used for social shares)');
  if (n.image && n.hasImageAlt !== undefined) push(n.hasImageAlt ? 'good' : 'warn', 'Featured image has alt text');
  if (imgs.length) push(imgsNoAlt ? 'warn' : 'good', imgsNoAlt ? `${imgsNoAlt} content image(s) missing alt text / caption` : 'All content images have alt text');
  push(
    !canonical || /^(https?:\/\/|\/)/i.test(canonical) ? 'good' : 'bad',
    canonical ? 'Custom canonical URL set' : 'Canonical: auto (this page’s own URL)'
  );
  if (n.noIndex) push('warn', 'Page is set to NOINDEX — Google will not show it');
  return c;
}

const ICON = {
  good: <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />,
  warn: <AlertCircle className="w-3.5 h-3.5 text-gold-dark shrink-0 mt-0.5" />,
  bad: <XCircle className="w-3.5 h-3.5 text-red shrink-0 mt-0.5" />,
};

// Field config options (all optional):
//   titleField / descField     – where the SEO title & description live (default metaTitle / metaDescription)
//   summaryField               – description fallback (default summary)
//   contentField, contentType  – 'html' (default), 'blocks', or 'page' (html content + blocks)
//   imageField, imageAltField  – featured image (+ alt) used for the image checks
//   path(values)               – public URL path; default `${basePath}/${slug}`
//   checkSlug                  – include "keyword in slug" check (default true)
export function SeoPreview({ field, values }) {
  const v = values || {};
  const rawContent = v[field.contentField || 'content'];
  const html =
    field.contentType === 'blocks'
      ? blocksToHtml(rawContent)
      : field.contentType === 'page'
        ? `${rawContent || ''}${blocksToHtml(v.blocks)}`
        : rawContent || '';
  const n = {
    title: String(v[field.titleField || 'metaTitle'] || v.title || '').trim(),
    desc: String(v[field.descField || 'metaDescription'] || v[field.summaryField || 'summary'] || '').trim(),
    html,
    slug: v.slug,
    image: v[field.imageField || 'image'] || v.ogImage,
    hasImageAlt: field.imageAltField ? !!v[field.imageAltField] : undefined,
    focusKeyword: v.focusKeyword,
    canonicalUrl: v.canonicalUrl,
    noIndex: v.noIndex,
    checkSlug: field.checkSlug !== false,
  };

  const path = field.path ? field.path(v) : `${field.basePath || ''}/${v.slug || 'your-slug'}`;
  const url = `${SITE_URL}${path}`;
  const title = n.title || 'Page title';
  const desc = n.desc || htmlToText(html).slice(0, 160) || 'Meta description will appear here.';
  const cfg = { title: field.titleRange || [30, 60], desc: field.descRange || [120, 160] };
  const checks = runChecks(n, cfg);
  const score = Math.round((checks.filter((c) => c.status === 'good').length / checks.length) * 100);
  const scoreTone = score >= 80 ? 'bg-green-600' : score >= 50 ? 'bg-gold' : 'bg-red';

  return (
    <div className="space-y-4">
      <div>
        <p className="label">Google preview</p>
        <div className="rounded-lg border border-line bg-white p-4">
          <p className="text-xs text-[#202124] truncate">{url.replace(/^https?:\/\//, '').replace(/\//g, ' › ')}</p>
          <p className="text-[18px] leading-snug text-[#1a0dab] mt-1 line-clamp-1">
            {title.length > 60 ? `${title.slice(0, 60)}…` : title}
          </p>
          <p className="text-[13px] text-[#4d5156] mt-1 line-clamp-2">
            {desc.length > 160 ? `${desc.slice(0, 160)}…` : desc}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="label !mb-0">SEO analysis</p>
          <span className={`text-white text-xs font-bold rounded-full px-2.5 py-0.5 ${scoreTone}`}>{score}/100</span>
        </div>
        <ul className="rounded-lg border border-line bg-white divide-y divide-line">
          {checks.map((c) => (
            <li key={c.label} className="flex gap-2 px-3 py-2 text-xs text-ink">
              {ICON[c.status]}
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
