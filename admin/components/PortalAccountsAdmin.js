'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import Topbar from './Topbar';
import { Plus, X, Loader2, Trash2, KeyRound, Search, Copy, CheckCircle2 } from 'lucide-react';

// Manages Parent/Student portal login accounts. Distinct from the Students
// screen (academic record) and from Admin Users (staff CMS access) — this is
// specifically who can log into /portal on the public site.
export default function PortalAccountsAdmin() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [role, setRole] = useState('parent');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [credentialResult, setCredentialResult] = useState(null); // { email, tempPassword }
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) qs.set('search', search);
      const res = await apiGet(`/portal-accounts?${qs.toString()}`);
      setAccounts(res.data || []);
      setPagination(res.pagination || null);
    } catch (err) {
      setError(err.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  async function loadStudents(q) {
    try {
      const res = await apiGet(`/students?limit=100${q ? `&search=${encodeURIComponent(q)}` : ''}`);
      setStudents(res.data || []);
    } catch (err) { /* fails soft */ }
  }

  function openCreate() {
    setRole('parent');
    setName('');
    setEmail('');
    setPhone('');
    setSelectedStudents([]);
    setFormError('');
    loadStudents('');
    setFormOpen(true);
  }

  function toggleStudent(id) {
    setSelectedStudents((prev) => {
      if (role === 'student') return prev.includes(id) ? [] : [id]; // exactly one for student accounts
      return prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
    });
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const res = await apiPost('/portal-accounts', { role, name, email, phone, students: selectedStudents });
      setFormOpen(false);
      setCredentialResult({ email: res.data.email, tempPassword: res.data.tempPassword, isNew: true });
      await load();
    } catch (err) {
      setFormError(err.message || 'Failed to create account');
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword(account) {
    try {
      const res = await apiPost(`/portal-accounts/${account._id}/reset-password`);
      setCredentialResult({ email: account.email, tempPassword: res.data.tempPassword, isNew: false });
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    }
  }

  async function toggleActive(account) {
    try {
      await apiPut(`/portal-accounts/${account._id}`, { isActive: !account.isActive });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await apiDelete(`/portal-accounts/${id}`);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function copyCredentials() {
    const text = `Email: ${credentialResult.email}\nTemporary Password: ${credentialResult.tempPassword}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Topbar title="Portal Accounts" description="Parent and student login credentials for the public-site portal." />
      <div className="p-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input pl-9" />
          </div>
          <button onClick={openCreate} className="btn-primary shrink-0"><Plus className="w-4 h-4" /> Create Account</button>
        </div>

        {error && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-4 py-3 mb-4">{error}</div>}

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-left">
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Name</th>
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Email</th>
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Role</th>
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Linked Students</th>
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Active</th>
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-slate" /></td></tr>
              ) : accounts.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate">No portal accounts yet.</td></tr>
              ) : accounts.map((a) => (
                <tr key={a._id} className="border-b border-line last:border-0 hover:bg-paper/40">
                  <td className="px-5 py-3.5 text-ink">{a.name}</td>
                  <td className="px-5 py-3.5 text-slate">{a.email}</td>
                  <td className="px-5 py-3.5"><span className="badge-neutral capitalize">{a.role}</span></td>
                  <td className="px-5 py-3.5 text-slate text-xs">{(a.students || []).map((s) => s.name).join(', ') || '—'}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggleActive(a)} className={a.isActive ? 'badge-active' : 'badge-inactive'}>
                      {a.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => handleResetPassword(a)} className="p-1.5 rounded-md hover:bg-paper text-slate hover:text-ink" title="Reset password">
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(a._id)} className="p-1.5 rounded-md hover:bg-red-50 text-slate hover:text-red" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-slate">
            <span>Page {pagination.page} of {pagination.pages} ({pagination.total} total)</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary !px-3 !py-1.5">Previous</button>
              <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} className="btn-secondary !px-3 !py-1.5">Next</button>
            </div>
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFormOpen(false)} />
          <form onSubmit={handleCreate} className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-line flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-display font-bold text-lg">Create Portal Account</h2>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1.5 rounded-md hover:bg-paper"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4 flex-1">
              {formError && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-3.5 py-2.5">{formError}</div>}

              <div>
                <label className="label">Account Type</label>
                <select className="input" value={role} onChange={(e) => { setRole(e.target.value); setSelectedStudents([]); }}>
                  <option value="parent">Parent (can link multiple children)</option>
                  <option value="student">Student (links to exactly one record)</option>
                </select>
              </div>
              <div>
                <label className="label">Name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="label">Email (used to log in)</label>
                <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div>
                <label className="label">{role === 'student' ? 'Link Student (choose one)' : 'Link Student(s)'}</label>
                <input
                  type="text"
                  placeholder="Search by name or admission no…"
                  className="input mb-2"
                  value={studentSearch}
                  onChange={(e) => { setStudentSearch(e.target.value); loadStudents(e.target.value); }}
                />
                <div className="border border-line rounded-lg max-h-48 overflow-y-auto divide-y divide-line">
                  {students.length === 0 ? (
                    <p className="text-xs text-slate p-3">No students found.</p>
                  ) : students.map((s) => (
                    <label key={s._id} className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer hover:bg-paper">
                      <input
                        type={role === 'student' ? 'radio' : 'checkbox'}
                        checked={selectedStudents.includes(s._id)}
                        onChange={() => toggleStudent(s._id)}
                        className="w-4 h-4 text-red focus:ring-red"
                      />
                      <span>{s.name} — {s.admissionNo} (Class {s.class}{s.section})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-line sticky bottom-0 bg-white flex gap-3">
              <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving || !selectedStudents.length} className="btn-primary flex-1">
                {saving ? 'Creating…' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {credentialResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setCredentialResult(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6">
            <h2 className="font-display font-bold text-lg mb-1">{credentialResult.isNew ? 'Account Created' : 'Password Reset'}</h2>
            <p className="text-sm text-slate mb-4">Share these credentials with the family through a secure channel. This password will not be shown again.</p>
            <div className="bg-paper rounded-lg p-4 space-y-2 font-mono text-sm">
              <div><span className="text-slate">Email:</span> {credentialResult.email}</div>
              <div><span className="text-slate">Temp Password:</span> {credentialResult.tempPassword}</div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={copyCredentials} className="btn-secondary flex-1">
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={() => setCredentialResult(null)} className="btn-primary flex-1">Done</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
