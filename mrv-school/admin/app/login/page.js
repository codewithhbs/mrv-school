'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center mb-4">
            <GraduationCap className="w-7 h-7 text-ink" strokeWidth={2} />
          </div>
          <h1 className="font-display font-extrabold text-xl text-white">MRVPS Admin</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to manage the school website</p>
        </div>

        <form onSubmit={handleSubmit} className="card bg-white p-6 space-y-4">
          {error && (
            <div className="text-sm text-red bg-red-50 border border-red/20 rounded-lg px-3.5 py-2.5">{error}</div>
          )}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mrvps.org"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          Access is restricted to authorized MRVPS staff.
        </p>
      </div>
    </div>
  );
}
