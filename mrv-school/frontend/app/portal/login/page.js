'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePortalAuth } from '@/context/PortalAuthContext';
import SealBadge from '@/components/SealBadge';

export default function PortalLoginPage() {
  const { login, account, loading } = usePortalAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already logged in (valid session) -> skip login page, go straight to dashboard
  useEffect(() => {
    if (!loading && account) router.replace('/portal/dashboard');
  }, [loading, account, router]);

  if (loading || account) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate">Loading…</div>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      router.push('/portal/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] grid lg:grid-cols-2">
      {/* Left — editorial panel, matches the rest of the site's ink+gold treatment */}
      <div className="hidden lg:flex relative bg-ink text-white flex-col justify-between p-12 overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-8 w-72 h-72 rounded-full border border-dashed border-gold/20" />
        <div className="pointer-events-none absolute -left-16 bottom-0 w-64 h-64 rounded-full border border-white/5" />

        <div className="relative">
          <SealBadge label="M" sublabel="MRVPS" tone="gold" size="lg" />
        </div>

        <div className="relative">
          <div className="eyebrow text-gold mb-4">Parents Corner &middot; Students Corner</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight max-w-md">
            Everything about your child&rsquo;s school life, in one place.
          </h1>
          <ul className="mt-8 space-y-3">
            {['Attendance & Homework', 'Exam Schedule & Results', 'Fee Status & PTM Dates'].map((li) => (
              <li key={li} className="flex items-center gap-3 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {li}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-white/40">
          &copy; {new Date().getFullYear()} M.R. Vivekananda Public School
        </div>
      </div>

      {/* Right — the actual form */}
      <div className="flex items-center justify-center px-4 py-16 bg-paper">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <div className="eyebrow text-red mb-2">Parents Corner &middot; Students Corner</div>
            <h1 className="font-display font-bold text-2xl text-ink">Portal Sign In</h1>
          </div>
          <div className="hidden lg:block mb-8">
            <h2 className="font-display font-bold text-2xl text-ink">Sign In</h2>
            <p className="text-sm text-slate mt-1.5">Enter your registered email and password to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-card border border-line shadow-card p-6 space-y-4">
            {error && (
              <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-3.5 py-2.5">{error}</div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-1.5">Email</label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-1.5">Password</label>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red text-white rounded-full py-2.5 text-sm font-semibold hover:bg-red-dark transition-colors disabled:opacity-50 shadow-card hover:shadow-cardHover"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-slate mt-6">
            Don&rsquo;t have portal login details? Contact the school office at{' '}
            <a href="mailto:info@mrvps.org" className="text-red hover:underline">info@mrvps.org</a>.
          </p>
          <p className="text-center text-xs text-slate mt-2">
            <Link href="/" className="hover:text-ink underline">← Back to the main website</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
