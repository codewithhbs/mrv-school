'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost, apiGet, setAccessToken, getAccessToken } from '@/lib/api';

const AuthContext = createContext(null);

// Role hierarchy mirrors the backend exactly: superadmin > admin > content_editor /
// admissions_officer > viewer. Kept here so nav/route guards can reason about it
// without re-fetching anything.
export const ROLES = ['superadmin', 'admin', 'content_editor', 'admissions_officer', 'viewer'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On first load, try a silent refresh so a page reload doesn't force re-login
  // (the refresh token lives in an httpOnly cookie the browser already has).
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api'}/auth/refresh`,
          { method: 'POST', credentials: 'include' }
        );
        if (res.ok) {
          const json = await res.json();
          setAccessToken(json.data.accessToken);
          setUser(json.data.user);
        }
      } catch (err) {
        // no valid session — that's fine, user will need to log in
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const json = await apiPost('/auth/login', { email, password });
    setAccessToken(json.data.accessToken);
    setUser(json.data.user);
    return json.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiPost('/auth/logout');
    } catch (err) {
      // ignore — clear local state regardless
    }
    setAccessToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const hasRole = useCallback(
    (...allowed) => {
      if (!user) return false;
      if (user.role === 'superadmin') return true;
      return allowed.includes(user.role);
    },
    [user]
  );

  // Fine-grained module check, layered on top of role. If the user has no
  // `permissions` set (legacy/default accounts), this doesn't restrict
  // anything further — role gating (hasRole) is all that applies. If
  // `permissions` is non-empty, the user is limited to exactly those modules.
  const hasPermission = useCallback(
    (moduleKey) => {
      if (!user) return false;
      if (user.role === 'superadmin') return true;
      if (Array.isArray(user.permissions) && user.permissions.length > 0) {
        return user.permissions.includes(moduleKey);
      }
      return true;
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
