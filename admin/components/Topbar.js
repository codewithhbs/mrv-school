'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Topbar({ title, description }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-line px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="font-display font-bold text-xl text-ink">{title}</h1>
        {description && <p className="text-sm text-slate mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-ink">{user?.name}</div>
          <div className="text-xs text-slate">{user?.email}</div>
        </div>
        <button onClick={logout} className="btn-ghost" title="Sign out">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
