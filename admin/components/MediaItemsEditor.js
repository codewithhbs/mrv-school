'use client';

import { useState } from 'react';
import { uploadFile } from '@/lib/api';
import { Trash2, ChevronUp, ChevronDown, Loader2, ImagePlus, FileVideo, CheckCircle2 } from 'lucide-react';

// Editable array-of-media builder for the Gallery `items` field. Staff upload
// photos/videos directly — no JSON typing, no pasting URLs by hand.
export default function MediaItemsEditor({ value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const [uploading, setUploading] = useState(false);

  function update(next) {
    onChange(next.map((it, i) => ({ ...it, order: i })));
  }

  async function addMedia(kind) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = kind === 'photo' ? 'image/*' : 'video/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const result = await uploadFile(kind === 'photo' ? 'image' : 'media', file);
        update([...items, { type: kind, url: result.url, caption: '' }]);
      } catch (err) {
        // upload failed silently — staff can retry
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }

  function removeItem(i) {
    update(items.filter((_, idx) => idx !== i));
  }

  function moveItem(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  }

  function updateCaption(i, caption) {
    const next = [...items];
    next[i] = { ...next[i], caption };
    update(next);
  }

  return (
    <div>
      <label className="label">Album Media</label>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-slate bg-paper rounded-lg px-3.5 py-3 border border-dashed border-line">
            No photos or videos yet — add some below.
          </p>
        )}

        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-line bg-paper/50 p-2.5">
            <span className="badge-neutral capitalize shrink-0">{it.type}</span>
            <span className="flex items-center gap-1.5 text-xs text-slate truncate flex-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" /> {it.url}
            </span>
            <input
              className="input !py-1.5 !text-xs w-40"
              placeholder="Caption"
              value={it.caption || ''}
              onChange={(e) => updateCaption(i, e.target.value)}
            />
            <div className="flex items-center gap-0.5 shrink-0">
              <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-white disabled:opacity-30 text-slate">
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="p-1 rounded hover:bg-white disabled:opacity-30 text-slate">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => removeItem(i)} className="p-1 rounded hover:bg-red-50 text-slate hover:text-red">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <button type="button" disabled={uploading} onClick={() => addMedia('photo')} className="btn-secondary !py-1.5 !px-3 text-xs">
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />} Add Photo
        </button>
        <button type="button" disabled={uploading} onClick={() => addMedia('video')} className="btn-secondary !py-1.5 !px-3 text-xs">
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileVideo className="w-3.5 h-3.5" />} Add Video
        </button>
      </div>
    </div>
  );
}
