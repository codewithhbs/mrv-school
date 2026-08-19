'use client';

import { useState, useEffect } from 'react';
import { uploadFile, apiGet } from '@/lib/api';
import { Loader2, UploadCloud, CheckCircle2 } from 'lucide-react';
import BlocksEditor from './BlocksEditor';
import MediaItemsEditor from './MediaItemsEditor';

// Renders one form control based on a field config from lib/resourceConfigs.js,
// and normalizes its value back through onChange. `list` fields are edited as
// newline-separated text but stored/sent as arrays; `json` fields are edited
// as raw JSON text and parsed on submit (see ResourceForm).
export default function FormField({ field, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleFileChange(e, kind) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const result = await uploadFile(kind, file);
      onChange(result.url);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  const commonLabel = (
    <label className="label">
      {field.label} {field.required && <span className="text-red">*</span>}
    </label>
  );

  switch (field.type) {
    case 'textarea':
      return (
        <div>
          {commonLabel}
          <textarea
            className="input min-h-[100px]"
            value={value ?? ''}
            required={field.required}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.hint && <p className="text-xs text-slate mt-1">{field.hint}</p>}
        </div>
      );

    case 'number':
      return (
        <div>
          {commonLabel}
          <input
            type="number"
            className="input"
            value={value ?? ''}
            required={field.required}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
      );

    case 'boolean':
      return (
        <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded border-line text-red focus:ring-red"
          />
          <span className="text-sm font-medium text-ink">{field.label}</span>
        </label>
      );

    case 'select':
      return (
        <div>
          {commonLabel}
          <select
            className="input"
            value={value ?? ''}
            required={field.required}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="" disabled>Select…</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );

    case 'datetime':
      return (
        <div>
          {commonLabel}
          <input
            type="datetime-local"
            className="input"
            value={value ? String(value).slice(0, 16) : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case 'list':
      return (
        <div>
          {commonLabel}
          <textarea
            className="input min-h-[90px]"
            value={Array.isArray(value) ? value.join('\n') : value ?? ''}
            onChange={(e) => onChange(e.target.value.split('\n'))}
            onBlur={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
          />
          {field.hint && <p className="text-xs text-slate mt-1">{field.hint}</p>}
        </div>
      );

    case 'blocks':
      return <BlocksEditor value={value} onChange={onChange} />;

    case 'mediaItems':
      return <MediaItemsEditor value={value} onChange={onChange} />;

    case 'json':
      return (
        <div>
          {commonLabel}
          <textarea
            className="input min-h-[120px] font-mono text-xs"
            value={typeof value === 'string' ? value : JSON.stringify(value ?? [], null, 2)}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.hint && <p className="text-xs text-slate mt-1">{field.hint}</p>}
        </div>
      );

    case 'image':
    case 'document': {
      const kind = field.type === 'image' ? 'image' : 'document';
      return (
        <div>
          {commonLabel}
          <div className="flex items-center gap-3">
            <label className="btn-secondary cursor-pointer">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {uploading ? 'Uploading…' : 'Upload file'}
              <input type="file" className="hidden" onChange={(e) => handleFileChange(e, kind)} />
            </label>
            {value && !uploading && (
              <span className="flex items-center gap-1.5 text-xs text-slate truncate max-w-[220px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                {value}
              </span>
            )}
          </div>
          <input
            type="text"
            className="input mt-2"
            placeholder="or paste a URL directly"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
          {uploadError && <p className="text-xs text-red mt-1">{uploadError}</p>}
        </div>
      );
    }

    case 'studentSelect':
      return <StudentSelectField field={field} value={value} onChange={onChange} commonLabel={commonLabel} />;

    case 'text':
    default:
      return (
        <div>
          {commonLabel}
          <input
            type="text"
            className="input"
            value={value ?? ''}
            required={field.required}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.hint && <p className="text-xs text-slate mt-1">{field.hint}</p>}
        </div>
      );
  }
}

// Searchable dropdown of students — used wherever a resource needs to
// reference a Student (e.g. Fee Records), so staff never have to paste a
// raw ObjectId by hand.
function StudentSelectField({ field, value, onChange, commonLabel }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet('/students?limit=200');
        setStudents(res.data || []);
      } catch (err) {
        // fails soft — the select just shows no options
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = search
    ? students.filter((s) => `${s.name} ${s.admissionNo}`.toLowerCase().includes(search.toLowerCase()))
    : students;

  return (
    <div>
      {commonLabel}
      <input
        type="text"
        placeholder="Search by name or admission no…"
        className="input mb-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select className="input" value={value ?? ''} required={field.required} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>{loading ? 'Loading students…' : 'Select a student…'}</option>
        {filtered.map((s) => (
          <option key={s._id} value={s._id}>{s.name} — {s.admissionNo} (Class {s.class}{s.section})</option>
        ))}
      </select>
    </div>
  );
}
