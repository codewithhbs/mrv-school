const nodemailer = require('nodemailer');

// Website form notifications (admission enquiries, contact messages, career applications, alumni registrations).
// Recipients: NOTIFY_EMAILS (comma separated). Both the primary and the alternate address receive every
// submission, so nothing is missed if one mailbox has a problem.
const DEFAULT_RECIPIENTS = 'info@mrvps.org,VPMRVPS@gmail.com';

let transporter;
function getTransporter() {
  if (transporter !== undefined) return transporter;
  if (!process.env.SMTP_HOST) {
    transporter = null;
    return transporter;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transporter;
}

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const label = (k) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

/**
 * Fire-and-forget: never throws and never blocks/fails the API response.
 * @param {string} subject  e.g. "New Admission Enquiry"
 * @param {object} fields   key/value pairs shown in the mail body
 * @param {string} [replyTo] submitter's email, so the team can reply directly
 */
function notifyTeam(subject, fields = {}, replyTo) {
  const t = getTransporter();
  if (!t) {
    console.warn('[mailer] SMTP_HOST not set - skipping notification email:', subject);
    return;
  }
  const to = (process.env.NOTIFY_EMAILS || DEFAULT_RECIPIENTS).split(',').map((s) => s.trim()).filter(Boolean);
  const rows = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(([k, v]) => `<tr><td style="padding:6px 12px;border:1px solid #e5e5e5;background:#faf7f2"><b>${esc(label(k))}</b></td><td style="padding:6px 12px;border:1px solid #e5e5e5">${esc(v)}</td></tr>`)
    .join('');
  t.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    replyTo: replyTo || undefined,
    subject: `[MRVPS Website] ${subject}`,
    html: `<h3>${esc(subject)}</h3><table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}</table>`,
  }).catch((err) => console.error('[mailer] failed to send notification:', err.message));
}

module.exports = { notifyTeam };
