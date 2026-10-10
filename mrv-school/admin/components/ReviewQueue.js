'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiGet, apiPut } from '@/lib/api';
import Topbar from './Topbar';
import { X, Loader2, Eye } from 'lucide-react';

function StatusBadge({ status }) {
  const tone =
    ['new', 'pending'].includes(status) ? 'badge-new' :
    ['admitted', 'approved', 'hired', 'responded', 'closed'].includes(status) ? 'badge-active' :
    ['rejected'].includes(status) ? 'badge bg-red-50 text-red' :
    'badge-neutral';
  return <span className={tone}>{status}</span>;
}

// Read + status-update screen for records submitted by public visitors
// (admission enquiries, contact messages, career applications, alumni
// registrations). No create/delete here — those records originate from the
// public site's forms.
export default function ReviewQueue({ config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [detailItem, setDetailItem] = useState(null);
  const [savingStatus, setSavingStatus] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) qs.set('status', statusFilter);
      const res = await apiGet(`${config.endpoint}?${qs.toString()}`);
      setItems(res.data || []);
      setPagination(res.pagination || null);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [config.endpoint, page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id, status) {
    setSavingStatus(true);
    try {
      await apiPut(`${config.endpoint}/${id}`, { status });
      await load();
      if (detailItem && detailItem._id === id) setDetailItem((prev) => ({ ...prev, status }));
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  }

  return (
    <>
      <Topbar title={config.title} description={config.description} />

      <div className="p-8">
        <div className="flex items-center gap-3 mb-5">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input max-w-[200px]">
            <option value="">All statuses</option>
            {config.statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {error && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-4 py-3 mb-4">{error}</div>}

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-left">
                {config.columns.map((col) => (
                  <th key={col.key} className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">{col.label}</th>
                ))}
                <th className="px-5 py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={config.columns.length + 1} className="px-5 py-12 text-center text-slate"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={config.columns.length + 1} className="px-5 py-12 text-center text-slate">Nothing here yet.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="border-b border-line last:border-0 hover:bg-paper/40">
                    {config.columns.map((col) => (
                      <td key={col.key} className="px-5 py-3.5 text-ink">
                        {col.type === 'status' ? (
                          <StatusBadge status={item[col.key]} />
                        ) : col.type === 'date' ? (
                          <span className="text-slate text-xs">{item[col.key] ? new Date(item[col.key]).toLocaleString() : '—'}</span>
                        ) : (
                          <span className="line-clamp-1">{String(item[col.key] ?? '—')}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => setDetailItem(item)} className="p-1.5 rounded-md hover:bg-paper text-slate hover:text-ink" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
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

      {detailItem && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDetailItem(null)} />
          <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-line flex items-center justify-between sticky top-0 bg-white">
              <h2 className="font-display font-bold text-lg">Details</h2>
              <button onClick={() => setDetailItem(null)} className="p-1.5 rounded-md hover:bg-paper"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <div>
                <label className="label">Status</label>
                <select
                  value={detailItem.status}
                  disabled={savingStatus}
                  onChange={(e) => updateStatus(detailItem._id, e.target.value)}
                  className="input"
                >
                  {config.statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {config.detailFields.map((key) => (
                <div key={key}>
                  <label className="label">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <p className="text-sm text-ink bg-paper rounded-lg px-3.5 py-2.5 whitespace-pre-wrap break-words">
                    {detailItem[key] || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
