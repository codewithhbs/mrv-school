'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const initialState = { name: '', batchYear: '', email: '', phone: '', currentOccupation: '', city: '', message: '' };

export default function AlumniRegistrationForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const router = useRouter();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'submitting', message: '' });
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.mrvpublicschool.com/api';
      const res = await fetch(`${base}/alumni/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ state: 'error', message: json?.message || 'Something went wrong. Please try again.' });
        return;
      }
      setStatus({ state: 'idle', message: '' });
      router.push('/thank-you?type=alumni');
      setForm(initialState);
    } catch (err) {
      setStatus({ state: 'error', message: 'Could not reach the server. Please try again.' });
    }
  };

  if (status.state === 'success') {
    return (
      <div className="bg-white rounded-card border border-line p-8 text-center">
        <h3 className="font-display font-bold text-xl text-ink">Welcome Back</h3>
        <p className="text-slate mt-2">{status.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-card border border-line p-7 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name" name="name" value={form.name} onChange={onChange} required />
        <Field label="Batch Year" name="batchYear" value={form.batchYear} onChange={onChange} required placeholder="e.g. 2015" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Current Occupation" name="currentOccupation" value={form.currentOccupation} onChange={onChange} />
        <Field label="City" name="city" value={form.city} onChange={onChange} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Message (optional)</label>
        <textarea name="message" value={form.message} onChange={onChange} rows={3}
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-red outline-none resize-none" />
      </div>
      {status.state === 'error' && <p className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-4 py-2.5">{status.message}</p>}
      <button type="submit" disabled={status.state === 'submitting'}
        className="w-full bg-red text-white font-semibold text-sm rounded-full py-3.5 hover:bg-red-dark transition-colors disabled:opacity-60">
        {status.state === 'submitting' ? 'Submitting…' : 'Register as Alumni'}
      </button>
    </form>
  );
}

function Field({ label, name, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}{required && ' *'}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
        className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-red outline-none" />
    </div>
  );
}
