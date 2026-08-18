'use client';

import { useState } from 'react';

export default function FAQAccordion({ items }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="max-w-3xl divide-y divide-line border border-line rounded-card overflow-hidden bg-paper">
      {items.map((item) => {
        const isOpen = openId === item._id;
        return (
          <div key={item._id} className="bg-white">
            <button
              onClick={() => setOpenId(isOpen ? null : item._id)}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display font-medium text-ink">{item.question}</span>
              <span className={`text-red text-xl leading-none transition-transform shrink-0 ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            {isOpen && <p className="px-6 pb-5 text-sm text-slate leading-relaxed">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
