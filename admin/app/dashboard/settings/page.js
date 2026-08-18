'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPut } from '@/lib/api';
import Topbar from '@/components/Topbar';
import FormField from '@/components/FormField';
import { Loader2, CheckCircle2 } from 'lucide-react';

const FIELDS = [
  { name: 'schoolName', label: 'School Name', type: 'text', required: true },
  { name: 'tagline', label: 'Tagline', type: 'text' },
  { name: 'logoUrl', label: 'Logo', type: 'image' },
  { name: 'faviconUrl', label: 'Favicon', type: 'image' },
  { name: 'address', label: 'Address', type: 'textarea' },
  { name: 'officeHours', label: 'Office Hours', type: 'text' },
  { name: 'mapEmbedUrl', label: 'Google Maps Embed URL', type: 'text' },
  { name: 'affiliationNumber', label: 'CBSE Affiliation Number', type: 'text' },
  { name: 'board', label: 'Board', type: 'text' },
  { name: 'heroType', label: 'Homepage Hero Style', type: 'select', options: ['default', 'banner'] },
  { name: 'seoDefaultTitle', label: 'Default SEO Title', type: 'text' },
  { name: 'seoDefaultDescription', label: 'Default SEO Description', type: 'textarea' },
  { name: 'footerText', label: 'Footer Text', type: 'textarea' },
];

export default function SettingsPage() {
  const [values, setValues] = useState(null);
  const [phones, setPhones] = useState('');
  const [emails, setEmails] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await apiGet('/settings');
      setValues(res.data || {});
      setPhones((res.data?.phones || []).join('\n'));
      setEmails((res.data?.emails || []).join('\n'));
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const payload = {
        ...values,
        phones: phones.split('\n').map((s) => s.trim()).filter(Boolean),
        emails: emails.split('\n').map((s) => s.trim()).filter(Boolean),
      };
      const res = await apiPut('/settings', payload);
      setValues(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (!values) {
    return (
      <>
        <Topbar title="Site Settings" description="School-wide details used across the public website." />
        <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate" /></div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Site Settings" description="School-wide details used across the public website — header, footer, contact info, SEO." />
      <form onSubmit={handleSubmit} className="p-8 max-w-2xl space-y-5">
        {error && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-3.5 py-2.5">{error}</div>}
        {saved && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3.5 py-2.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Settings saved.
          </div>
        )}

        <div className="card p-6 space-y-4">
          {FIELDS.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={values[field.name]}
              onChange={(val) => setValues((prev) => ({ ...prev, [field.name]: val }))}
            />
          ))}

          <div>
            <label className="label">Phone Numbers (one per line)</label>
            <textarea className="input min-h-[70px]" value={phones} onChange={(e) => setPhones(e.target.value)} />
          </div>
          <div>
            <label className="label">Email Addresses (one per line)</label>
            <textarea className="input min-h-[70px]" value={emails} onChange={(e) => setEmails(e.target.value)} />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </>
  );
}
