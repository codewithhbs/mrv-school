'use client';

import { useState } from 'react';

const CLASSES = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

const initialState = {
  studentName: '', dateOfBirth: '', classAppliedFor: '', parentName: '', email: '', phone: '', address: '', message: '',
};

export default function AdmissionEnquiryForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'submitting', message: '' });
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${base}/admission/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ state: 'error', message: json?.message || 'Something went wrong. Please try again.' });
        return;
      }
      setStatus({ state: 'success', message: 'Enquiry submitted. Our admissions team will contact you shortly.' });
      setForm(initialState);
    } catch (err) {
      setStatus({ state: 'error', message: 'Could not reach the server. Please check your connection and try again.' });
    }
  };

  if (status.state === 'success') {
    return (
      <div className="bg-white rounded-card border border-line p-8 text-center">
        <div className="seal w-14 h-14 text-red bg-paper2 mx-auto mb-4"><span className="font-display font-bold text-red">✓</span></div>
        <h3 className="font-display font-bold text-xl text-ink">Thank You</h3>
        <p className="text-slate mt-2">{status.message}</p>
        <button onClick={() => setStatus({ state: 'idle', message: '' })} className="mt-6 text-red font-semibold text-sm hover:text-red-dark">
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-card border border-line p-7 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Student's Full Name" name="studentName" value={form.studentName} onChange={onChange} required />
        <Field label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={onChange} />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Class Applying For *</label>
          <select name="classAppliedFor" value={form.classAppliedFor} onChange={onChange} required
            className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-red outline-none">
            <option value="">Select class</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Field label="Parent/Guardian Name" name="parentName" value={form.parentName} onChange={onChange} required />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} required />
      </div>
      <Field label="Address" name="address" value={form.address} onChange={onChange} />
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Message (optional)</label>
        <textarea name="message" value={form.message} onChange={onChange} rows={3}
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-red outline-none resize-none" />
      </div>

      {status.state === 'error' && (
        <p className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-4 py-2.5">{status.message}</p>
      )}

      <button type="submit" disabled={status.state === 'submitting'}
        className="w-full bg-red text-white font-semibold text-sm rounded-full py-3.5 hover:bg-red-dark transition-colors disabled:opacity-60">
        {status.state === 'submitting' ? 'Submitting…' : 'Submit Enquiry'}
      </button>
    </form>
  );
}

function Field({ label, name, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}{required && ' *'}</label>
      <input
        type={type} name={name} value={value} onChange={onChange} required={required}
        className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-red outline-none"
      />
    </div>
  );
}
