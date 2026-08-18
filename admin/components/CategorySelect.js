'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import { Plus } from 'lucide-react';

// Pick an existing gallery category, or add a new one. Prevents staff from
// hand-typing the same category with different spellings each time.
export default function CategorySelect({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet('/gallery?limit=100');
        const unique = [...new Set((res.data || []).map((a) => a.category).filter(Boolean))].sort();
        setCategories(unique);
        if (value && !unique.includes(value)) setAddingNew(true);
      } catch (err) {
        // fails soft — falls back to free text entry
        setAddingNew(true);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (addingNew || (!loading && categories.length === 0)) {
    return (
      <div>
        <label className="label">Category</label>
        <input
          className="input"
          placeholder="e.g. Campus, Sports, Events"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
        {categories.length > 0 && (
          <button type="button" onClick={() => setAddingNew(false)} className="text-xs text-red font-semibold mt-1.5">
            Choose an existing category instead
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="label">Category</label>
      <div className="flex items-center gap-2">
        <select
          className="input"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
        >
          <option value="" disabled>{loading ? 'Loading categories…' : 'Select a category…'}</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="button" onClick={() => setAddingNew(true)} className="btn-secondary !py-2.5 !px-3 shrink-0" title="Add new category">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
