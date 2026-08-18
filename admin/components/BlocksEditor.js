'use client';

import { useState } from 'react';
import { uploadFile } from '@/lib/api';
import { Plus, Trash2, ChevronUp, ChevronDown, Loader2, UploadCloud, CheckCircle2 } from 'lucide-react';

const BLOCK_TYPES = [
  { type: 'heading', label: 'Heading' },
  { type: 'paragraph', label: 'Paragraph' },
  { type: 'quote', label: 'Quote' },
  { type: 'list', label: 'List' },
  { type: 'image', label: 'Image' },
  { type: 'table', label: 'Table' },
  { type: 'cta', label: 'Button (CTA)' },
];

function emptyData(type) {
  switch (type) {
    case 'heading':
    case 'paragraph':
      return { text: '' };
    case 'quote':
      return { text: '', attribution: '' };
    case 'list':
      return { items: [] };
    case 'image':
      return { url: '', caption: '' };
    case 'table':
      return { headers: ['Column 1', 'Column 2'], rows: [['', '']] };
    case 'cta':
      return { label: '', href: '' };
    default:
      return {};
  }
}

// Editable array-of-blocks builder for the Pages `blocks` field. Keeps the
// value as a plain array of {type, data, order} objects — no JSON typing.
export default function BlocksEditor({ value, onChange }) {
  const blocks = Array.isArray(value) ? value : [];

  function update(next) {
    onChange(next.map((b, i) => ({ ...b, order: i })));
  }

  function addBlock(type) {
    update([...blocks, { type, data: emptyData(type) }]);
  }

  function removeBlock(i) {
    update(blocks.filter((_, idx) => idx !== i));
  }

  function moveBlock(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  }

  function updateData(i, patch) {
    const next = [...blocks];
    next[i] = { ...next[i], data: { ...next[i].data, ...patch } };
    update(next);
  }

  return (
    <div>
      <label className="label">Content Blocks</label>

      <div className="space-y-3">
        {blocks.length === 0 && (
          <p className="text-sm text-slate bg-paper rounded-lg px-3.5 py-3 border border-dashed border-line">
            No content yet — add a block below to start building this page.
          </p>
        )}

        {blocks.map((block, i) => (
          <div key={i} className="rounded-lg border border-line bg-paper/50 p-3.5">
            <div className="flex items-center justify-between mb-3">
              <span className="badge-neutral capitalize">{block.type}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-white disabled:opacity-30 text-slate">
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} className="p-1 rounded hover:bg-white disabled:opacity-30 text-slate">
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => removeBlock(i)} className="p-1 rounded hover:bg-red-50 text-slate hover:text-red">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <BlockFields block={block} onChange={(patch) => updateData(i, patch)} />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {BLOCK_TYPES.map((t) => (
          <button key={t.type} type="button" onClick={() => addBlock(t.type)} className="btn-secondary !py-1.5 !px-3 text-xs">
            <Plus className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function BlockFields({ block, onChange }) {
  const { type, data = {} } = block;
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile('image', file);
      onChange({ url: result.url });
    } catch (err) {
      // surfaced via lack of checkmark; keep it simple here
    } finally {
      setUploading(false);
    }
  }

  switch (type) {
    case 'heading':
      return (
        <input className="input" placeholder="Heading text" value={data.text || ''} onChange={(e) => onChange({ text: e.target.value })} />
      );

    case 'paragraph':
      return (
        <textarea className="input min-h-[90px]" placeholder="Paragraph text" value={data.text || ''} onChange={(e) => onChange({ text: e.target.value })} />
      );

    case 'quote':
      return (
        <div className="space-y-2">
          <textarea className="input min-h-[70px]" placeholder="Quote text" value={data.text || ''} onChange={(e) => onChange({ text: e.target.value })} />
          <input className="input" placeholder="Attribution (optional)" value={data.attribution || ''} onChange={(e) => onChange({ attribution: e.target.value })} />
        </div>
      );

    case 'list':
      return (
        <div>
          <textarea
            className="input min-h-[80px]"
            placeholder="One item per line"
            value={(data.items || []).join('\n')}
            onChange={(e) => onChange({ items: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
          />
        </div>
      );

    case 'image':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <label className="btn-secondary cursor-pointer !py-1.5 !px-3 text-xs">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
              {uploading ? 'Uploading…' : 'Upload image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {data.url && !uploading && (
              <span className="flex items-center gap-1.5 text-xs text-slate truncate max-w-[220px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" /> {data.url}
              </span>
            )}
          </div>
          <input className="input" placeholder="Caption (optional)" value={data.caption || ''} onChange={(e) => onChange({ caption: e.target.value })} />
        </div>
      );

    case 'table': {
      const headers = data.headers || [];
      const rows = data.rows || [];
      const setHeader = (ci, text) => {
        const next = [...headers]; next[ci] = text; onChange({ headers: next });
      };
      const setCell = (ri, ci, text) => {
        const next = rows.map((r) => [...r]); next[ri][ci] = text; onChange({ rows: next });
      };
      const addColumn = () => onChange({ headers: [...headers, `Column ${headers.length + 1}`], rows: rows.map((r) => [...r, '']) });
      const removeColumn = (ci) => onChange({ headers: headers.filter((_, i) => i !== ci), rows: rows.map((r) => r.filter((_, i) => i !== ci)) });
      const addRow = () => onChange({ rows: [...rows, headers.map(() => '')] });
      const removeRow = (ri) => onChange({ rows: rows.filter((_, i) => i !== ri) });
      return (
        <div className="space-y-2 overflow-x-auto">
          <table className="text-xs border-collapse">
            <thead>
              <tr>
                {headers.map((h, ci) => (
                  <th key={ci} className="p-1">
                    <input className="input !py-1 !text-xs w-28" value={h} onChange={(e) => setHeader(ci, e.target.value)} placeholder={`Column ${ci + 1}`} />
                  </th>
                ))}
                <th className="p-1">
                  <button type="button" onClick={addColumn} className="p-1 rounded hover:bg-white text-slate" title="Add column"><Plus className="w-3.5 h-3.5" /></button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-1">
                      <input className="input !py-1 !text-xs w-28" value={cell} onChange={(e) => setCell(ri, ci, e.target.value)} />
                    </td>
                  ))}
                  <td className="p-1">
                    <button type="button" onClick={() => removeRow(ri)} className="p-1 rounded hover:bg-red-50 text-slate hover:text-red"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addRow} className="btn-secondary !py-1 !px-2.5 text-xs"><Plus className="w-3 h-3" /> Add Row</button>
          {headers.length > 1 && (
            <div className="flex gap-1.5 flex-wrap">
              {headers.map((h, ci) => (
                <button key={ci} type="button" onClick={() => removeColumn(ci)} className="text-[11px] text-slate hover:text-red">
                  Remove "{h || `Column ${ci + 1}`}"
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    case 'cta':
      return (
        <div className="space-y-2">
          <input className="input" placeholder="Button label" value={data.label || ''} onChange={(e) => onChange({ label: e.target.value })} />
          <input className="input" placeholder="Link (e.g. /admission)" value={data.href || ''} onChange={(e) => onChange({ href: e.target.value })} />
        </div>
      );

    default:
      return null;
  }
}
