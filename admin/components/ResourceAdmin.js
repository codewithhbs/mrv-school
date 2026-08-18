'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import FormField from './FormField';
import Topbar from './Topbar';
import { Plus, Pencil, Trash2, X, Loader2, Search } from 'lucide-react';

function formatCellDate(value, withTime) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const opts = { day: 'numeric', month: 'short', year: 'numeric' };
  if (withTime) { opts.hour = '2-digit'; opts.minute = '2-digit'; }
  return d.toLocaleString('en-IN', opts);
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), obj);
}

function buildDefaultValues(fields) {
  const values = {};
  fields.forEach((f) => {
    if (f.default !== undefined) values[f.name] = f.default;
    else if (f.type === 'boolean') values[f.name] = false;
    else if (f.type === 'list') values[f.name] = [];
    else values[f.name] = '';
  });
  return values;
}

// Generic CRUD admin screen driven entirely by a resourceConfigs entry.
// Handles listing (with search + pagination), create, edit, and delete
// against the matching backend REST endpoint.
export default function ResourceAdmin({ config }) {
  const { hasRole } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const canWrite = hasRole(...(config.writeRoles || ['admin']));
  const canDelete = hasRole(...(config.deleteRoles || ['admin']));

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) qs.set('search', search);
      const res = await apiGet(`${config.endpoint}?${qs.toString()}`);
      setItems(res.data || []);
      setPagination(res.pagination || null);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [config.endpoint, page, search]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditingItem(null);
    setFormValues(buildDefaultValues(config.fields));
    setFormError('');
    setFormOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    const values = {};
    config.fields.forEach((f) => {
      values[f.name] = item[f.name] ?? (f.default !== undefined ? f.default : f.type === 'list' ? [] : '');
    });
    setFormValues(values);
    setFormError('');
    setFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = { ...formValues };
      // Parse any JSON-typed fields from their editable text form.
      config.fields.forEach((f) => {
        if (f.type === 'json' && typeof payload[f.name] === 'string') {
          try {
            payload[f.name] = payload[f.name].trim() ? JSON.parse(payload[f.name]) : [];
          } catch (err) {
            throw new Error(`"${f.label}" is not valid JSON`);
          }
        }
        if (f.type === 'number' && payload[f.name] === '') {
          delete payload[f.name];
        }
      });

      if (editingItem) {
        await apiPut(`${config.endpoint}/${editingItem._id}`, payload);
      } else {
        await apiPost(config.endpoint, payload);
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setFormError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await apiDelete(`${config.endpoint}/${id}`);
      await load();
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Topbar title={config.title} description={config.description} />

      <div className="p-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input pl-9"
            />
          </div>
          {canWrite && (
            <button onClick={openCreate} className="btn-primary shrink-0">
              <Plus className="w-4 h-4" /> Add New
            </button>
          )}
        </div>

        {error && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-4 py-3 mb-4">{error}</div>}

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-left">
                {config.columns.map((col) => (
                  <th key={col.key} className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">{col.label}</th>
                ))}
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={config.columns.length + 1} className="px-5 py-12 text-center text-slate">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={config.columns.length + 1} className="px-5 py-12 text-center text-slate">No records yet.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="border-b border-line last:border-0 hover:bg-paper/40">
                    {config.columns.map((col) => (
                      <td key={col.key} className="px-5 py-3.5 text-ink">
                        {col.type === 'boolean' ? (
                          <span className={item[col.key] ? 'badge-active' : 'badge-inactive'}>
                            {item[col.key] ? 'Yes' : 'No'}
                          </span>
                        ) : col.type === 'date' || col.type === 'datetime' ? (
                          <span className="line-clamp-1">{formatCellDate(getNestedValue(item, col.key), col.type === 'datetime')}</span>
                        ) : (
                          <span className="line-clamp-1">{String(getNestedValue(item, col.key) ?? '—')}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        {canWrite && (
                          <button onClick={() => openEdit(item)} className="p-1.5 rounded-md hover:bg-paper text-slate hover:text-ink" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={deletingId === item._id}
                            className="p-1.5 rounded-md hover:bg-red-50 text-slate hover:text-red"
                            title="Delete"
                          >
                            {deletingId === item._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
          <form onSubmit={handleSubmit} className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-line flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-display font-bold text-lg">{editingItem ? `Edit ${config.title.slice(0, -1) || config.title}` : `Add ${config.title.slice(0, -1) || config.title}`}</h2>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1.5 rounded-md hover:bg-paper">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1">
              {formError && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-3.5 py-2.5">{formError}</div>}
              {config.fields.map((field) => (
                (!field.showIf || field.showIf(formValues)) && (
                  <FormField
                    key={field.name}
                    field={field}
                    value={formValues[field.name]}
                    onChange={(val) => setFormValues((prev) => ({ ...prev, [field.name]: val }))}
                  />
                )
              ))}
            </div>

            <div className="px-6 py-4 border-t border-line sticky bottom-0 bg-white flex gap-3">
              <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
