'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import FormField from './FormField';
import { slugify } from '@/lib/site';
import Topbar from './Topbar';
import { Plus, Pencil, Trash2, Loader2, Search, ArrowLeft, Save, Search as SeoIcon } from 'lucide-react';

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

// Layout-only field types — they render in the form but carry no value.
const DISPLAY_ONLY = new Set(['heading', 'seoPreview']);
const valueFields = (fields) => fields.filter((f) => !DISPLAY_ONLY.has(f.type));
const emptyFor = (f) => (f.type === 'list' || f.type === 'tags' ? [] : '');

function buildDefaultValues(fields) {
  const values = {};
  valueFields(fields).forEach((f) => {
    if (f.default !== undefined) values[f.name] = f.default;
    else if (f.type === 'boolean') values[f.name] = false;
    else values[f.name] = emptyFor(f);
  });
  return values;
}

// Splits a field list into cards: every `heading` field starts a new card.
function groupIntoCards(fields) {
  const cards = [];
  let current = { heading: null, fields: [] };
  fields.forEach((f) => {
    if (f.type === 'heading') {
      if (current.heading || current.fields.length) cards.push(current);
      current = { heading: f, fields: [] };
    } else {
      current.fields.push(f);
    }
  });
  if (current.heading || current.fields.length) cards.push(current);
  return cards;
}

function singular(title) {
  if (title.endsWith('ies')) return `${title.slice(0, -3)}y`;
  if (title.endsWith('s') && !title.endsWith('ss')) return title.slice(0, -1);
  return title;
}

// Generic CRUD admin screen driven entirely by a resourceConfigs entry.
// List view (search + pagination) and an inline full-width create/edit view
// that replaces the list inside the dashboard content area.
// Fields marked `side: true` render in a sticky right-hand column.
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
  const [slugTouched, setSlugTouched] = useState(false);
  const initialValuesRef = useRef('');

  const [deletingId, setDeletingId] = useState(null);

  const canWrite = hasRole(...(config.writeRoles || ['admin']));
  const canDelete = hasRole(...(config.deleteRoles || ['admin']));

  const { mainCards, sideCards } = useMemo(() => {
    const main = config.fields.filter((f) => !f.side);
    const side = config.fields.filter((f) => f.side);
    return { mainCards: groupIntoCards(main), sideCards: groupIntoCards(side) };
  }, [config.fields]);

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

  function openForm(values, item) {
    setEditingItem(item);
    setFormValues(values);
    initialValuesRef.current = JSON.stringify(values);
    setFormError('');
    setFormOpen(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }

  function openCreate() {
    setSlugTouched(false);
    openForm(buildDefaultValues(config.fields), null);
  }

  function openEdit(item) {
    const values = {};
    valueFields(config.fields).forEach((f) => {
      values[f.name] = item[f.name] ?? (f.default !== undefined ? f.default : emptyFor(f));
    });
    setSlugTouched(true); // never auto-rewrite the URL of an existing record
    openForm(values, item);
  }

  const isDirty = formOpen && JSON.stringify(formValues) !== initialValuesRef.current;

  function closeForm() {
    if (isDirty && !window.confirm('You have unsaved changes. Discard them?')) return;
    setFormOpen(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }

  // Warn before leaving the tab with unsaved edits.
  useEffect(() => {
    if (!isDirty) return undefined;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Updates one field; while creating, slug fields follow their source field
  // (usually the title) until the editor types in the slug themselves.
  function handleFieldChange(field, val) {
    if (field.type === 'slug') setSlugTouched(true);
    setFormValues((prev) => {
      const next = { ...prev, [field.name]: val };
      if (!slugTouched) {
        config.fields
          .filter((f) => f.type === 'slug' && (f.source || 'title') === field.name)
          .forEach((f) => { next[f.name] = slugify(val); });
      }
      return next;
    });
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
        if (f.type === 'datetime' && payload[f.name] === '') {
          payload[f.name] = null;
        }
      });

      if (editingItem) {
        await apiPut(`${config.endpoint}/${editingItem._id}`, payload);
      } else {
        await apiPost(config.endpoint, payload);
      }
      initialValuesRef.current = JSON.stringify(formValues);
      setFormOpen(false);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
      await load();
    } catch (err) {
      setFormError(err.message || 'Save failed');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this record? This cannot be undone.')) return;
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

  function renderCard(card, key) {
    const visible = card.fields.filter((f) => !f.showIf || f.showIf(formValues));
    if (!visible.length) return null;
    return (
      <section key={key} className="card">
        {card.heading && (
          <div className="px-6 py-4 border-b border-line">
            <h3 className="font-display font-bold text-[15px] text-ink flex items-center gap-2">
              {card.heading.icon === 'seo' && <SeoIcon className="w-4 h-4 text-red" />}
              {card.heading.label}
            </h3>
            {card.heading.hint && <p className="text-xs text-slate mt-0.5">{card.heading.hint}</p>}
          </div>
        )}
        <div className="p-6 space-y-5">
          {visible.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formValues[field.name]}
              values={formValues}
              onChange={(val) => handleFieldChange(field, val)}
            />
          ))}
        </div>
      </section>
    );
  }

  // ---------------- Create / Edit view ----------------
  if (formOpen) {
    const itemLabel = singular(config.title);
    const hasSide = sideCards.length > 0;

    return (
      <>
        <Topbar title={config.title} description={config.description} />

        <form onSubmit={handleSubmit} className="px-8 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <button type="button" onClick={closeForm} className="btn-secondary !px-2.5" title="Back to list">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-lg text-ink truncate">
                  {editingItem ? `Edit ${itemLabel}` : `Add ${itemLabel}`}
                </h2>
                {editingItem && (formValues.title || editingItem.title) && (
                  <p className="text-xs text-slate truncate">{formValues.title || editingItem.title}</p>
                )}
              </div>
              {isDirty && <span className="badge-new shrink-0">Unsaved</span>}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={closeForm} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>

          {formError && (
            <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-4 py-3 mb-5">{formError}</div>
          )}

          <div className={hasSide ? 'grid gap-6 items-start xl:grid-cols-[minmax(0,1fr)_400px]' : ''}>
            <div className="space-y-6 min-w-0">
              {mainCards.map((card, i) => renderCard(card, `m${i}`))}
            </div>
            {hasSide && (
              <aside className="space-y-6 min-w-0 xl:sticky xl:top-[96px] xl:max-h-[calc(100vh-180px)] xl:overflow-y-auto xl:pr-1">
                {sideCards.map((card, i) => renderCard(card, `s${i}`))}
              </aside>
            )}
          </div>

          <div className="sticky bottom-0 z-20 -mx-8 mt-8 flex justify-end gap-3 px-8 py-3 bg-white/95 backdrop-blur border-t border-line">
            <button type="button" onClick={closeForm} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary min-w-[120px]">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : editingItem ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </>
    );
  }

  // ---------------- List view ----------------
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
    </>
  );
}
