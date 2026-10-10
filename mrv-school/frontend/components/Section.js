export default function Section({ children, className = '', bg = 'paper', id }) {
  const bgClass = { paper: 'bg-paper', white: 'bg-white', paper2: 'bg-paper2', ink: 'bg-ink text-white' }[bg] || 'bg-paper';
  return (
    <section id={id} className={`${bgClass} py-16 md:py-24 ${className}`}>
      <div className="container-max">{children}</div>
    </section>
  );
}
