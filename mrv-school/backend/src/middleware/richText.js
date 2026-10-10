const sanitizeHtml = require('sanitize-html');
const slugify = require('slugify');

// xss-clean (global) HTML-escapes every string in req.body, which would turn
// rich-text editor output into literal "&lt;p&gt;" text. For routes that accept
// rich HTML we stash the raw value BEFORE xss-clean runs, then restore it AFTER,
// passed through a strict allow-list sanitizer instead.

const SANITIZE_OPTIONS = {
  allowedTags: [
    'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
    'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'span', 'sub', 'sup',
    'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
    '*': ['style'],
  },
  allowedStyles: {
    '*': { 'text-align': [/^(left|right|center|justify)$/] },
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  allowProtocolRelative: false,
  transformTags: {
    h1: 'h2', // page already has the title as <h1>; keep one H1 per page for SEO
    a: (tagName, attribs) => {
      const out = { ...attribs };
      if (out.target === '_blank') out.rel = 'noopener noreferrer';
      return { tagName, attribs: out };
    },
    img: (tagName, attribs) => ({ tagName, attribs: { loading: 'lazy', ...attribs } }),
  },
};

function captureRichText(fields) {
  return (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && typeof req.body === 'object') {
      req._rawRichText = {};
      fields.forEach((f) => {
        if (typeof req.body[f] === 'string') req._rawRichText[f] = req.body[f];
      });
    }
    next();
  };
}

function restoreRichText(req, res, next) {
  if (req._rawRichText) {
    Object.entries(req._rawRichText).forEach(([field, raw]) => {
      req.body[field] = sanitizeHtml(raw, SANITIZE_OPTIONS).trim();
    });
    delete req._rawRichText;
  }
  next();
}

const isWrite = (req) => ['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && typeof req.body === 'object';

// Shared SEO cleanup for any resource with SEO fields (news-events, pages):
// keyword de-dupe, whitespace trimming.
function normalizeSeoFields(req, res, next) {
  if (!isWrite(req)) return next();
  const b = req.body;

  if (typeof b.metaKeywords === 'string') b.metaKeywords = b.metaKeywords.split(',');
  if (Array.isArray(b.metaKeywords)) {
    const seen = new Set();
    b.metaKeywords = b.metaKeywords
      .map((k) => String(k).trim())
      .filter((k) => k && !seen.has(k.toLowerCase()) && seen.add(k.toLowerCase()))
      .slice(0, 20);
  }

  ['metaTitle', 'metaDescription', 'seoTitle', 'seoDescription', 'focusKeyword', 'canonicalUrl', 'imageAlt'].forEach((f) => {
    if (typeof b[f] === 'string') b[f] = b[f].replace(/\s+/g, ' ').trim();
  });

  next();
}

// News/events specific: slug fallback from title, empty dates.
function normalizeNewsEventBody(req, res, next) {
  if (!isWrite(req)) return next();
  const b = req.body;

  // Slug: explicit value wins; blank (or missing on create) falls back to the title.
  const rawSlug = typeof b.slug === 'string' ? b.slug.trim() : '';
  if (rawSlug) b.slug = slugify(rawSlug, { lower: true, strict: true, trim: true });
  else if ((b.slug !== undefined || req.method === 'POST') && b.title) {
    b.slug = slugify(String(b.title), { lower: true, strict: true, trim: true });
  }

  // Empty date strings from the admin form would fail Date casting.
  ['eventDate', 'eventEndDate'].forEach((f) => {
    if (b[f] === '') b[f] = null;
  });

  next();
}

module.exports = { captureRichText, restoreRichText, normalizeSeoFields, normalizeNewsEventBody, SANITIZE_OPTIONS };
