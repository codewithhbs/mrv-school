'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { portalPost, setPortalAccessToken, PORTAL_API_BASE_URL } from '@/lib/portalApi';

const PortalAuthContext = createContext(null);

export function PortalAuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${PORTAL_API_BASE_URL}/portal/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          setPortalAccessToken(json.data.accessToken);
          setAccount(json.data.account);
          setSelectedStudentId(json.data.account.students?.[0]?.id || null);
        }
      } catch (err) {
        // no valid session
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const json = await portalPost('/portal/auth/login', { email, password });
    setPortalAccessToken(json.data.accessToken);
    setAccount(json.data.account);
    setSelectedStudentId(json.data.account.students?.[0]?.id || null);
    return json.data.account;
  }, []);

  const logout = useCallback(async () => {
    try { await portalPost('/portal/auth/logout'); } catch (err) { /* ignore */ }
    setPortalAccessToken(null);
    setAccount(null);
    setSelectedStudentId(null);
    router.push('/portal/login');
  }, [router]);

  return (
    <PortalAuthContext.Provider value={{ account, loading, login, logout, selectedStudentId, setSelectedStudentId }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error('usePortalAuth must be used within PortalAuthProvider');
  return ctx;
}
