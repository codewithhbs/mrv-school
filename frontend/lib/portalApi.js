// Client-side, auth-aware API wrapper for the Parent/Student portal.
// Mirrors mrvps-admin/lib/api.js exactly (Bearer token + one silent
// refresh-and-retry on 401), but targets /portal endpoints and the portal's
// own httpOnly refresh cookie — completely separate session from any staff
// login, by design.

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

let accessToken = null;
let refreshPromise = null;

export function setPortalAccessToken(token) {
  accessToken = token;
}
export function getPortalAccessToken() {
  return accessToken;
}

async function doRefresh() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/portal/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data?.accessToken || null;
      })
      .catch(() => null)
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

async function request(path, { method = 'GET', body, retry = true } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && retry) {
    const newToken = await doRefresh();
    if (newToken) {
      accessToken = newToken;
      return request(path, { method, body, retry: false });
    }
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json?.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return json;
}

export const portalGet = (path) => request(path, { method: 'GET' });
export const portalPost = (path, body) => request(path, { method: 'POST', body });

export { BASE_URL as PORTAL_API_BASE_URL };
