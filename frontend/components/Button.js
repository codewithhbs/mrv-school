import Link from 'next/link';

export default function Button({ href, children, variant = 'primary', className = '', type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200';
  const variants = {
    primary: 'bg-red text-white hover:bg-red-dark shadow-card hover:shadow-cardHover',
    gold: 'bg-gold text-ink hover:bg-gold-dark hover:text-white',
    outline: 'border-2 border-ink text-ink hover:border-red hover:text-red',
    ghost: 'text-red hover:text-red-dark',
  };
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
