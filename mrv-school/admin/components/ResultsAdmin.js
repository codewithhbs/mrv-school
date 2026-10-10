'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import Topbar from './Topbar';
import { Plus, Pencil, Trash2, X, Loader2, Search, PlusCircle, MinusCircle, Eye, EyeOff } from 'lucide-react';

const EMPTY_SUBJECT = { subject: '', marksObtained: '', maxMarks: 100, grade: '' };

// Dedicated Results screen — subject-wise marks are a nested array, so this
// gets its own form UI instead of reusing the generic FormField/ResourceAdmin
// pattern, which only handles flat fields.
export default function ResultsAdmin({ config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [students, setStudents] = useState([]);
  const [examName, setExamName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [subjects, setSubjects] = useState([{ ...EMPTY_SUBJECT }]);
  const [remarks, setRemarks] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await apiGet(`${config.endpoint}?${qs.toString()}`);
      setItems(res.data || []);
      setPagination(res.pagination || null);
    } catch (err) {
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  }, [config.endpoint, page]);

  useEffect(() => { load(); }, [load]);

  async function loadStudents(q) {
    try {
      const res = await apiGet(`/students?limit=200${q ? `&search=${encodeURIComponent(q)}` : ''}`);
      setStudents(res.data || []);
    } catch (err) { /* fails soft */ }
  }

  function openCreate() {
    setEditingItem(null);
    setStudentId('');
    setExamName('');
    setAcademicYear('');
    setSubjects([{ ...EMPTY_SUBJECT }]);
    setRemarks('');
    setIsPublished(false);
    setFormError('');
    loadStudents('');
    setFormOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setStudentId(item.student?._id || item.student);
    setExamName(item.examName);
    setAcademicYear(item.academicYear);
    setSubjects(item.subjects?.length ? item.subjects.map((s) => ({ ...s })) : [{ ...EMPTY_SUBJECT }]);
    setRemarks(item.remarks || '');
    setIsPublished(!!item.isPublished);
    setFormError('');
    loadStudents('');
    setFormOpen(true);
  }

  function updateSubject(i, key, val) {
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  }
  function addSubject() { setSubjects((prev) => [...prev, { ...EMPTY_SUBJECT }]); }
  function removeSubject(i) { setSubjects((prev) => prev.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (!studentId) throw new Error('Please select a student');
      const payload = {
        student: studentId,
        examName,
        academicYear,
        subjects: subjects
          .filter((s) => s.subject)
          .map((s) => ({ subject: s.subject, marksObtained: Number(s.marksObtained), maxMarks: Number(s.maxMarks), grade: s.grade })),
        remarks,
        isPublished,
      };
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

  async function togglePublish(item) {
    try {
      await apiPut(`${config.endpoint}/${item._id}`, { isPublished: !item.isPublished });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const filtered = search
    ? items.filter((i) => `${i.student?.name || ''} ${i.examName}`.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <>
      <Topbar title={config.title} description={config.description} />
      <div className="p-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search student or exam…" value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" />
          </div>
          <button onClick={openCreate} className="btn-primary shrink-0"><Plus className="w-4 h-4" /> Add Result</button>
        </div>

        {error && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-4 py-3 mb-4">{error}</div>}

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-left">
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Student</th>
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Exam</th>
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">%</th>
                <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Published</th>
                <th className="px-5 py-3 w-28" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-slate" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate">No results recorded yet.</td></tr>
              ) : filtered.map((item) => (
                <tr key={item._id} className="border-b border-line last:border-0 hover:bg-paper/40">
                  <td className="px-5 py-3.5 text-ink">{item.student?.name || '—'} <span className="text-slate text-xs">({item.student?.admissionNo})</span></td>
                  <td className="px-5 py-3.5 text-ink">{item.examName}</td>
                  <td className="px-5 py-3.5 text-ink">{item.percentage != null ? `${item.percentage}%` : '—'}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => togglePublish(item)} className={item.isPublished ? 'badge-active' : 'badge-inactive'}>
                      {item.isPublished ? <Eye className="w-3 h-3 inline mr-1" /> : <EyeOff className="w-3 h-3 inline mr-1" />}
                      {item.isPublished ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-md hover:bg-paper text-slate hover:text-ink"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item._id)} disabled={deletingId === item._id} className="p-1.5 rounded-md hover:bg-red-50 text-slate hover:text-red">
                        {deletingId === item._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
          <form onSubmit={handleSubmit} className="relative w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-line flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-display font-bold text-lg">{editingItem ? 'Edit Result' : 'Add Result'}</h2>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1.5 rounded-md hover:bg-paper"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-6 space-y-4 flex-1">
              {formError && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-3.5 py-2.5">{formError}</div>}

              <div>
                <label className="label">Student</label>
                <input type="text" placeholder="Search by name or admission no…" className="input mb-2" onChange={(e) => loadStudents(e.target.value)} />
                <select className="input" value={studentId} required onChange={(e) => setStudentId(e.target.value)}>
                  <option value="" disabled>Select a student…</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} — {s.admissionNo} (Class {s.class}{s.section})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Exam Name</label>
                  <input type="text" className="input" required value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="Term 1 Examination 2026" />
                </div>
                <div>
                  <label className="label">Academic Year</label>
                  <input type="text" className="input" required value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="2026-27" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label !mb-0">Subject-wise Marks</label>
                  <button type="button" onClick={addSubject} className="text-xs font-semibold text-red hover:underline flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" /> Add Subject
                  </button>
                </div>
                <div className="space-y-2">
                  {subjects.map((s, i) => (
                    <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_auto] gap-2 items-center">
                      <input type="text" placeholder="Subject" className="input !py-2" value={s.subject} onChange={(e) => updateSubject(i, 'subject', e.target.value)} />
                      <input type="number" placeholder="Marks" className="input !py-2" value={s.marksObtained} onChange={(e) => updateSubject(i, 'marksObtained', e.target.value)} />
                      <input type="number" placeholder="Max" className="input !py-2" value={s.maxMarks} onChange={(e) => updateSubject(i, 'maxMarks', e.target.value)} />
                      <input type="text" placeholder="Grade" className="input !py-2" value={s.grade} onChange={(e) => updateSubject(i, 'grade', e.target.value)} />
                      <button type="button" onClick={() => removeSubject(i)} className="p-1.5 text-slate hover:text-red">
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate mt-2">Total marks and percentage are calculated automatically when you save.</p>
              </div>

              <div>
                <label className="label">Remarks</label>
                <textarea className="input min-h-[70px]" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              </div>

              <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 rounded border-line text-red focus:ring-red" />
                <span className="text-sm font-medium text-ink">Published (visible to parent/student in the portal)</span>
              </label>
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
