'use client';

import { useState } from 'react';

const initialState = { name: '', email: '', phone: '', coverNote: '' };

export default function CareerApplyForm({ openingId }) {
  const [form, setForm] = useState(initialState);
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.mrvpublicschool.com/api';

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setStatus({ state: 'error', message: 'Please attach your resume (PDF or Word document).' });
      return;
    }
    setStatus({ state: 'submitting', message: '' });
    try {
      const fd = new FormData();
      fd.append('file', resumeFile);
      const uploadRes = await fetch(`${base}/uploads/resume`, { method: 'POST', body: fd });
      const uploadJson = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) {
        setStatus({ state: 'error', message: uploadJson?.message || 'Could not upload resume. Please try again.' });
        return;
      }

      const applyRes = await fetch(`${base}/careers/${openingId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, resumeUrl: uploadJson.data.url }),
      });
      const applyJson = await applyRes.json().catch(() => ({}));
      if (!applyRes.ok) {
        setStatus({ state: 'error', message: applyJson?.message || 'Could not submit application. Please try again.' });
        return;
      }
      setStatus({ state: 'success', message: 'Application submitted. Our HR team will reach out if there is a match.' });
      setForm(initialState);
      setResumeFile(null);
    } catch (err) {
      setStatus({ state: 'error', message: 'Could not reach the server. Please try again.' });
    }
  };

  if (status.state === 'success') {
    return <p className="text-sm text-red font-medium mt-3">{status.message}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 border-t border-line pt-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <input required name="name" placeholder="Full name" value={form.name} onChange={onChange}
          className="border border-line rounded-lg px-3.5 py-2.5 text-sm focus:border-red outline-none" />
        <input required type="email" name="email" placeholder="Email" value={form.email} onChange={onChange}
          className="border border-line rounded-lg px-3.5 py-2.5 text-sm focus:border-red outline-none" />
      </div>
      <input required type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={onChange}
        className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm focus:border-red outline-none" />
      <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
        className="w-full text-sm text-slate" />
      <textarea name="coverNote" placeholder="A short note (optional)" value={form.coverNote} onChange={onChange} rows={2}
        className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm focus:border-red outline-none resize-none" />
      {status.state === 'error' && <p className="text-sm text-red">{status.message}</p>}
      <button type="submit" disabled={status.state === 'submitting'}
        className="bg-red text-white font-semibold text-sm rounded-full px-6 py-2.5 hover:bg-red-dark transition-colors disabled:opacity-60">
        {status.state === 'submitting' ? 'Submitting…' : 'Apply Now'}
      </button>
    </form>
  );
}
