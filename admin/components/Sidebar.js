'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { navGroups } from '@/lib/navConfig';
import { GraduationCap } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, hasRole, hasPermission } = useAuth();

  return (
    <aside className="w-64 shrink-0 bg-ink text-white h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-ink" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <div className="font-display font-extrabold text-sm leading-tight truncate">MRVPS Admin</div>
          <div className="text-[11px] text-white/40 truncate">{user?.role?.replace('_', ' ')}</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (item.roles && !hasRole(...item.roles)) return false;
            if (item.href === '/dashboard') return true; // dashboard home always visible once logged in
            const moduleKey = item.href.replace('/dashboard/', '');
            return hasPermission(moduleKey);
          });
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label}>
              <div className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname?.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                        active ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
