'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalAuth } from '@/context/PortalAuthContext';
import { portalGet } from '@/lib/portalApi';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'homework', label: 'Homework' },
  { key: 'exams', label: 'Exam Schedule' },
  { key: 'results', label: 'Results' },
  { key: 'fees', label: 'Fee Status' },
  { key: 'ptm', label: 'PTM Schedule' },
  { key: 'materials', label: 'Study Materials' },
];

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}

export default function PortalDashboard() {
  const { account, loading, logout, selectedStudentId, setSelectedStudentId } = usePortalAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !account) router.replace('/portal/login');
  }, [loading, account, router]);

  const currentStudent = account?.students?.find((s) => s.id === selectedStudentId);

  const load = useCallback(async () => {
    if (!selectedStudentId) return;
    setLoadingData(true);
    setError('');
    try {
      const [attendance, homework, exams, results, fees, ptm, materials] = await Promise.all([
        portalGet(`/portal/attendance?studentId=${selectedStudentId}`),
        portalGet(`/portal/homework?studentId=${selectedStudentId}`),
        portalGet(`/portal/exam-schedule?studentId=${selectedStudentId}`),
        portalGet(`/portal/results?studentId=${selectedStudentId}`),
        portalGet(`/portal/fee-records?studentId=${selectedStudentId}`),
        portalGet(`/portal/ptm-schedule?studentId=${selectedStudentId}`),
        portalGet(`/portal/study-materials?studentId=${selectedStudentId}`),
      ]);
      setData({
        attendance: attendance.data, attendanceSummary: attendance.summary,
        homework: homework.data, exams: exams.data, results: results.data,
        fees: fees.data, ptm: ptm.data, materials: materials.data,
      });
    } catch (err) {
      setError(err.message || 'Failed to load portal data');
    } finally {
      setLoadingData(false);
    }
  }, [selectedStudentId]);

  useEffect(() => { load(); }, [load]);

  if (loading || !account) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate">Loading…</div>;
  }

  return (
    <div className="bg-paper2 min-h-[calc(100vh-140px)]">
      <div className="relative bg-ink text-white overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-6 -top-6 w-56 h-56 rounded-full border border-dashed border-gold/20" />
        <div className="container-max relative py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-gold mb-1">Welcome back</div>
            <h1 className="font-display font-bold text-2xl md:text-3xl">{account.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            {account.students?.length > 1 && (
              <select
                value={selectedStudentId || ''}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2 text-sm focus:border-gold outline-none"
              >
                {account.students.map((s) => (
                  <option key={s.id} value={s.id} className="text-ink">{s.name} — Class {s.class}{s.section}</option>
                ))}
              </select>
            )}
            <button onClick={logout} className="text-sm font-semibold text-gold hover:text-gold-light transition-colors">Sign Out</button>
          </div>
        </div>
      </div>

      {currentStudent && (
        <div className="bg-white border-b border-line">
          <div className="container-max py-3 flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-full bg-red-50 text-red flex items-center justify-center font-display font-bold text-xs shrink-0">
              {currentStudent.name?.[0]}
            </span>
            <span className="font-medium text-ink">{currentStudent.name}</span>
            <span className="text-slate">·</span>
            <span className="text-slate">Class {currentStudent.class}-{currentStudent.section}</span>
            <span className="text-slate">·</span>
            <span className="text-slate font-mono text-xs">{currentStudent.admissionNo}</span>
          </div>
        </div>
      )}

      <div className="container-max py-8">
        <div className="flex gap-1 overflow-x-auto mb-6 border-b border-line">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key ? 'border-red text-red' : 'border-transparent text-slate hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-4 py-3 mb-6">{error}</div>}

        {loadingData ? (
          <div className="text-center text-slate py-16">Loading records…</div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Attendance" value={data.attendanceSummary?.percentage != null ? `${data.attendanceSummary.percentage}%` : '—'} sub="This record" />
                <StatCard label="Homework Due" value={data.homework?.length ?? 0} sub="Active assignments" />
                <StatCard label="Upcoming Exams" value={data.exams?.length ?? 0} sub="Scheduled" />
                <StatCard label="Fee Records" value={data.fees?.filter((f) => f.status !== 'paid').length ?? 0} sub="Pending / overdue" />
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="bg-white rounded-card border border-line overflow-hidden">
                {data.attendanceSummary && (
                  <div className="px-5 py-3 bg-paper border-b border-line text-sm text-slate">
                    {data.attendanceSummary.present} present out of {data.attendanceSummary.total} recorded days
                    {data.attendanceSummary.percentage != null && <span className="font-semibold text-ink"> ({data.attendanceSummary.percentage}%)</span>}
                  </div>
                )}
                <Table
                  rows={data.attendance}
                  empty="No attendance records yet."
                  columns={[
                    { key: 'date', label: 'Date', render: (r) => fmtDate(r.date) },
                    { key: 'status', label: 'Status', render: (r) => <StatusPill value={r.status} /> },
                    { key: 'remarks', label: 'Remarks', render: (r) => r.remarks || '—' },
                  ]}
                />
              </div>
            )}

            {activeTab === 'homework' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {!data.homework?.length ? (
                  <EmptyBlock text="No homework posted yet." />
                ) : data.homework.map((h) => (
                  <div key={h._id} className="bg-white rounded-card border border-line p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display font-semibold text-ink">{h.title}</h3>
                      <span className="badge-neutral shrink-0">{h.subject}</span>
                    </div>
                    {h.description && <p className="text-sm text-slate mt-2">{h.description}</p>}
                    <p className="text-xs text-slate mt-3">Due {fmtDate(h.dueDate)}</p>
                    {h.attachmentUrl && (
                      <a href={h.attachmentUrl} target="_blank" rel="noreferrer" className="text-xs text-red font-semibold hover:underline mt-2 inline-block">
                        View attachment →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'exams' && (
              <div className="bg-white rounded-card border border-line overflow-hidden">
                <Table
                  rows={data.exams}
                  empty="No exam schedule published yet."
                  columns={[
                    { key: 'examName', label: 'Exam' },
                    { key: 'subject', label: 'Subject' },
                    { key: 'examDate', label: 'Date', render: (r) => fmtDate(r.examDate) },
                    { key: 'time', label: 'Time', render: (r) => `${r.startTime || ''}${r.endTime ? ' – ' + r.endTime : ''}` || '—' },
                    { key: 'room', label: 'Room', render: (r) => r.room || '—' },
                  ]}
                />
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-5">
                {!data.results?.length ? (
                  <EmptyBlock text="No results published yet." />
                ) : data.results.map((r) => (
                  <div key={r._id} className="bg-white rounded-card border border-line overflow-hidden">
                    <div className="px-5 py-3 bg-paper border-b border-line flex items-center justify-between">
                      <span className="font-display font-semibold text-ink">{r.examName}</span>
                      <span className="text-sm text-slate">{r.percentage}% overall{r.overallGrade ? ` · Grade ${r.overallGrade}` : ''}</span>
                    </div>
                    <Table
                      rows={r.subjects}
                      columns={[
                        { key: 'subject', label: 'Subject' },
                        { key: 'marksObtained', label: 'Marks', render: (s) => `${s.marksObtained} / ${s.maxMarks}` },
                        { key: 'grade', label: 'Grade', render: (s) => s.grade || '—' },
                      ]}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'fees' && (
              <div className="bg-white rounded-card border border-line overflow-hidden">
                <Table
                  rows={data.fees}
                  empty="No fee records on file yet."
                  columns={[
                    { key: 'term', label: 'Term', render: (r) => `${r.term} (${r.academicYear})` },
                    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount?.toLocaleString('en-IN')}` },
                    { key: 'dueDate', label: 'Due Date', render: (r) => fmtDate(r.dueDate) },
                    { key: 'status', label: 'Status', render: (r) => <StatusPill value={r.status} /> },
                  ]}
                />
                <div className="px-5 py-3 bg-paper border-t border-line text-xs text-slate">
                  For online payment or receipts, please contact the school office — this view shows fee status recorded by the office.
                </div>
              </div>
            )}

            {activeTab === 'ptm' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {!data.ptm?.length ? (
                  <EmptyBlock text="No PTM scheduled yet." />
                ) : data.ptm.map((p) => (
                  <div key={p._id} className="bg-white rounded-card border border-line p-5">
                    <p className="font-display font-semibold text-ink">{fmtDate(p.date)}{p.time ? ` · ${p.time}` : ''}</p>
                    {p.description && <p className="text-sm text-slate mt-2">{p.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {!data.materials?.length ? (
                  <EmptyBlock text="No study materials uploaded yet." />
                ) : data.materials.map((m) => (
                  <a
                    key={m._id}
                    href={m.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white rounded-card border border-line p-5 hover:border-red/30 hover:shadow-card transition-all block"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display font-semibold text-ink">{m.title}</h3>
                      <span className="badge-neutral shrink-0">{m.subject}</span>
                    </div>
                    {m.description && <p className="text-sm text-slate mt-2">{m.description}</p>}
                    <p className="text-xs text-red font-semibold mt-3">Download →</p>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-card border border-line p-5">
      <div className="text-3xl font-display font-extrabold text-ink">{value}</div>
      <div className="text-sm font-medium text-ink mt-1">{label}</div>
      <div className="text-xs text-slate mt-0.5">{sub}</div>
    </div>
  );
}

function StatusPill({ value }) {
  const tone =
    ['present', 'paid', 'approved'].includes(value) ? 'bg-green-50 text-green-700' :
    ['absent', 'overdue', 'rejected'].includes(value) ? 'bg-red-50 text-red' :
    'bg-gold-light text-gold-dark';
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tone}`}>{value}</span>;
}

function EmptyBlock({ text }) {
  return <div className="bg-white rounded-card border border-line p-10 text-center text-slate col-span-full">{text}</div>;
}

function Table({ rows, columns, empty }) {
  if (!rows?.length) return <div className="p-10 text-center text-slate">{empty}</div>;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-line bg-paper/60 text-left">
          {columns.map((c) => (
            <th key={c.key} className="px-5 py-3 font-semibold text-slate text-xs uppercase tracking-wide">{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r._id || i} className="border-b border-line last:border-0">
            {columns.map((c) => (
              <td key={c.key} className="px-5 py-3 text-ink">{c.render ? c.render(r) : r[c.key] ?? '—'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
