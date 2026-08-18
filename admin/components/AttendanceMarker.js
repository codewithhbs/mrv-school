'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import Topbar from './Topbar';
import { Loader2, CheckCircle2 } from 'lucide-react';

const STATUS_OPTIONS = ['present', 'absent', 'leave', 'half-day'];
const STATUS_COLORS = {
  present: 'bg-green-50 text-green-700 border-green-200',
  absent: 'bg-red-50 text-red border-red/20',
  leave: 'bg-gold-light text-gold-dark border-gold/30',
  'half-day': 'bg-paper text-slate border-line',
};

// Class-wide attendance marking sheet: pick class/section/date, load the
// roster (pre-filled with any already-marked status for that day), toggle
// each student's status, save all at once via the backend's bulk endpoint.
export default function AttendanceMarker() {
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [existing, setExisting] = useState({});
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const loadRoster = useCallback(async () => {
    if (!cls || !section || !date) return;
    setLoading(true);
    setError('');
    setSaved(false);
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        apiGet(`/students?filter[class]=${cls}&filter[section]=${section}&limit=200`),
        apiGet(`/attendance/class?class=${cls}&section=${section}&date=${date}`),
      ]);
      const roster = studentsRes.data || [];
      setStudents(roster);

      const existingMap = {};
      (attendanceRes.data || []).forEach((a) => { existingMap[a.student._id] = a.status; });
      setExisting(existingMap);

      const initialStatuses = {};
      roster.forEach((s) => { initialStatuses[s._id] = existingMap[s._id] || 'present'; });
      setStatuses(initialStatuses);
    } catch (err) {
      setError(err.message || 'Failed to load roster');
    } finally {
      setLoading(false);
    }
  }, [cls, section, date]);

  useEffect(() => { loadRoster(); }, [loadRoster]);

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const records = students.map((s) => ({ studentId: s._id, status: statuses[s._id] || 'present' }));
      await apiPost('/attendance/bulk', { class: cls, section, date, records });
      setSaved(true);
      await loadRoster();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar title="Mark Attendance" description="Select a class, section, and date to mark or update attendance for the whole roster." />
      <div className="p-8">
        <div className="card p-5 flex flex-wrap items-end gap-4 mb-6">
          <div>
            <label className="label">Class</label>
            <input type="text" className="input w-32" value={cls} onChange={(e) => setCls(e.target.value)} placeholder="e.g. 6" />
          </div>
          <div>
            <label className="label">Section</label>
            <input type="text" className="input w-24" value={section} onChange={(e) => setSection(e.target.value.toUpperCase())} placeholder="A" />
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input w-44" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        {error && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-4 py-3 mb-4">{error}</div>}
        {saved && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Attendance saved for {students.length} student(s).
          </div>
        )}

        {!cls || !section ? (
          <div className="card p-10 text-center text-slate">Enter a class and section to load the roster.</div>
        ) : loading ? (
          <div className="card p-10 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-slate" /></div>
        ) : students.length === 0 ? (
          <div className="card p-10 text-center text-slate">No active students found in Class {cls}-{section}. Add students first.</div>
        ) : (
          <>
            <div className="card overflow-hidden mb-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper/60 text-left">
                    <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Roll No.</th>
                    <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Name</th>
                    <th className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} className="border-b border-line last:border-0">
                      <td className="px-5 py-3 text-slate">{s.rollNo || '—'}</td>
                      <td className="px-5 py-3 text-ink font-medium">{s.name}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5">
                          {STATUS_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setStatuses((prev) => ({ ...prev, [s._id]: opt }))}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold border capitalize transition-colors ${
                                statuses[s._id] === opt ? STATUS_COLORS[opt] : 'bg-white text-slate border-line hover:bg-paper'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Saving…' : `Save Attendance for ${students.length} Student(s)`}
            </button>
          </>
        )}
      </div>
    </>
  );
}
