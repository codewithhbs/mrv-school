'use client';

import { useState } from 'react';
import CareerApplyForm from './CareerApplyForm';

export default function CareerOpeningCard({ opening }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-paper rounded-card border border-line p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display font-semibold text-lg text-ink">{opening.title}</h3>
          <p className="text-sm text-slate mt-1">{opening.department} &middot; {opening.employmentType?.replace('-', ' ')}</p>
        </div>
        <button onClick={() => setOpen((v) => !v)} className="shrink-0 font-semibold text-sm text-red hover:text-red-dark">
          {open ? 'Close' : 'View & Apply'}
        </button>
      </div>
      {open && (
        <div className="mt-4">
          <p className="text-sm text-slate leading-relaxed">{opening.description}</p>
          {opening.requirements?.length > 0 && (
            <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-slate">
              {opening.requirements.map((r) => <li key={r}>{r}</li>)}
            </ul>
          )}
          <CareerApplyForm openingId={opening._id} />
        </div>
      )}
    </div>
  );
}
