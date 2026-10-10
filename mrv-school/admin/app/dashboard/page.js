'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Topbar from '@/components/Topbar';
import { Inbox, Mail, Newspaper, Users, FileCheck2, UsersRound, Loader2 } from 'lucide-react';

const STAT_CARDS = [
  { key: 'admission-enquiries', label: 'Admission Enquiries', endpoint: '/admission/enquiries', href: '/dashboard/admission-enquiries', icon: Inbox, roles: ['admin', 'admissions_officer'] },
  { key: 'contact-messages', label: 'Contact Messages', endpoint: '/contact', href: '/dashboard/contact-messages', icon: Mail, roles: ['admin'] },
  { key: 'news-events', label: 'News & Events Published', endpoint: '/news-events', href: '/dashboard/news-events', icon: Newspaper, roles: ['admin', 'content_editor'] },
  { key: 'faculty', label: 'Faculty Profiles', endpoint: '/faculty', href: '/dashboard/faculty', icon: Users, roles: ['admin', 'content_editor'] },
  { key: 'career-applications', label: 'Career Applications', endpoint: '/careers/applications', href: '/dashboard/career-applications', icon: FileCheck2, roles: ['admin'] },
  { key: 'alumni-registrations', label: 'Alumni Registrations', endpoint: '/alumni/registrations', href: '/dashboard/alumni-registrations', icon: UsersRound, roles: ['admin'] },
];

export default function DashboardHome() {
  const { user, hasRole } = useAuth();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const visibleCards = STAT_CARDS.filter((c) => hasRole(...c.roles));

  useEffect(() => {
    (async () => {
      const results = await Promise.all(
        visibleCards.map(async (card) => {
          try {
            const res = await apiGet(`${card.endpoint}?limit=1`);
            return [card.key, res.pagination?.total ?? 0];
          } catch (err) {
            return [card.key, null];
          }
        })
      );
      setCounts(Object.fromEntries(results));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Topbar title={`Welcome back, ${user?.name?.split(' ')[0] || ''}`} description="Here's what's happening across the MRVPS website." />
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.key} href={card.href} className="card p-5 hover:shadow-lg hover:border-red/20 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-red" />
                  </div>
                </div>
                <div className="text-3xl font-display font-extrabold text-ink">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-light" /> : counts[card.key] ?? '—'}
                </div>
                <div className="text-sm text-slate mt-1 group-hover:text-ink transition-colors">{card.label}</div>
              </Link>
            );
          })}
        </div>

        {visibleCards.length === 0 && (
          <div className="card p-8 text-center text-slate">
            Your account doesn't have access to any dashboard metrics yet. Contact an administrator if this seems wrong.
          </div>
        )}
      </div>
    </>
  );
}
