'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Topbar from '@/components/Topbar';
import { navGroups } from '@/lib/navConfig';
import { Plus, X, Loader2, Trash2, ShieldCheck, KeySquare } from 'lucide-react';

const ROLES = ['superadmin', 'admin', 'content_editor', 'admissions_officer', 'viewer'];

// Same module list the sidebar is built from, minus the Dashboard link
// (that's always visible once logged in — not a gate-able module).
const PERMISSION_GROUPS = navGroups
  .map((g) => ({
    label: g.label,
    items: g.items.filter((i) => i.href !== '/dashboard').map((i) => ({ key: i.href.replace('/dashboard/', ''), label: i.label })),
  }))
  .filter((g) => g.items.length > 0);

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [permissions, setPermissions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [permUser, setPermUser] = useState(null); // user being edited in the "Manage permissions" modal
  const [permDraft, setPermDraft] = useState([]);
  const [permSaving, setPermSaving] = useState(false);
  const [permError, setPermError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet('/users');
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function togglePermission(key) {
    setPermissions((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await apiPost('/users', { name, email, password, role, permissions });
      setFormOpen(false);
      setName(''); setEmail(''); setPassword(''); setRole('viewer'); setPermissions([]);
      await load();
    } catch (err) {
      setFormError(err.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(u) {
    try {
      await apiPut(`/users/${u._id}`, { isActive: !u.isActive });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function changeRole(u, newRole) {
    try {
      await apiPut(`/users/${u._id}`, { role: newRole });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeUser(id) {
    try {
      await apiDelete(`/users/${id}`);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function openPermModal(u) {
    setPermUser(u);
    setPermDraft(u.permissions || []);
    setPermError('');
  }

  function togglePermDraft(key) {
    setPermDraft((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  }

  async function savePermissions() {
    setPermSaving(true);
    setPermError('');
    try {
      await apiPut(`/users/${permUser._id}`, { permissions: permDraft });
      setPermUser(null);
      await load();
    } catch (err) {
      setPermError(err.message || 'Failed to save permissions');
    } finally {
      setPermSaving(false);
    }
  }

  return (
    <>
      <Topbar title="Admin Users" description="Staff accounts with access to this admin panel." />
      <div className="p-8">
        <div className="flex justify-end mb-5">
          <button onClick={() => setFormOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>

        {error && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-4 py-3 mb-4">{error}</div>}

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-left">
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Name</th>
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Email</th>
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Role</th>
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Active</th>
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Permissions</th>
                <th className="px-5 py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-slate" /></td></tr>
              ) : users.map((u) => (
                <tr key={u._id} className="border-b border-line last:border-0 hover:bg-paper/40">
                  <td className="px-5 py-3.5 text-ink flex items-center gap-2">
                    {u.role === 'superadmin' && <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />}
                    {u.name}
                  </td>
                  <td className="px-5 py-3.5 text-slate">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={u.role}
                      disabled={u.role === 'superadmin' || u._id === currentUser?.id}
                      onChange={(e) => changeRole(u, e.target.value)}
                      className="input !py-1.5 !text-xs w-auto"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleActive(u)}
                      disabled={u._id === currentUser?.id}
                      className={u.isActive ? 'badge-active' : 'badge-inactive'}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    {u.role === 'superadmin' ? (
                      <span className="text-xs text-slate">Full access</span>
                    ) : (
                      <button onClick={() => openPermModal(u)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red hover:underline">
                        <KeySquare className="w-3.5 h-3.5" />
                        {u.permissions?.length ? `${u.permissions.length} module${u.permissions.length > 1 ? 's' : ''}` : 'All (role default)'}
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {u.role !== 'superadmin' && u._id !== currentUser?.id && (
                      <button onClick={() => removeUser(u._id)} className="p-1.5 rounded-md hover:bg-red-50 text-slate hover:text-red">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFormOpen(false)} />
          <form onSubmit={handleCreate} className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg">Add Admin User</h2>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1.5 rounded-md hover:bg-paper"><X className="w-4 h-4" /></button>
            </div>
            {formError && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-3.5 py-2.5 mb-4">{formError}</div>}
            <div className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="label">Temporary Password</label>
                <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={10} />
                <p className="text-xs text-slate mt-1">At least 10 characters. Share it securely — ask them to change it after first login.</p>
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                  {ROLES.filter((r) => r !== 'superadmin').map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Section Permissions</label>
                <p className="text-xs text-slate mb-2">Choose exactly which admin sections this user can access. Leave everything unchecked to fall back to the default access for their role.</p>
                <PermissionChecklist selected={permissions} onToggle={togglePermission} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Creating…' : 'Create User'}</button>
            </div>
          </form>
        </div>
      )}

      {permUser && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setPermUser(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-lg">Manage Permissions</h2>
                <p className="text-xs text-slate mt-0.5">{permUser.name} &middot; {permUser.email}</p>
              </div>
              <button type="button" onClick={() => setPermUser(null)} className="p-1.5 rounded-md hover:bg-paper"><X className="w-4 h-4" /></button>
            </div>
            {permError && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-3.5 py-2.5 mb-4">{permError}</div>}
            <p className="text-xs text-slate mb-2">Leave everything unchecked to fall back to the default access for their role.</p>
            <PermissionChecklist selected={permDraft} onToggle={togglePermDraft} />
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setPermUser(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={savePermissions} disabled={permSaving} className="btn-primary flex-1">{permSaving ? 'Saving…' : 'Save Permissions'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PermissionChecklist({ selected, onToggle }) {
  return (
    <div className="space-y-3 border border-line rounded-lg p-3 max-h-64 overflow-y-auto">
      {PERMISSION_GROUPS.map((g) => (
        <div key={g.label}>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate mb-1.5">{g.label}</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {g.items.map((item) => (
              <label key={item.key} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(item.key)}
                  onChange={() => onToggle(item.key)}
                  className="rounded border-line"
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
