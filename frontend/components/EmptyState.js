// Used when the API has no data yet for a section. Written in the
// interface's voice: says what's missing, not an apology.
export default function EmptyState({ title = 'Nothing here yet', description = 'This section will be updated soon.' }) {
  return (
    <div className="border border-dashed border-line rounded-card py-14 px-6 text-center bg-white/50">
      <p className="font-display text-lg text-ink">{title}</p>
      <p className="text-sm text-slate mt-1">{description}</p>
    </div>
  );
}
