'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';

function cookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${encodeURIComponent(name)}=`;
  const item = document.cookie.split('; ').find((part) => part.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : null;
}

export async function apiFetch(path: string, init: RequestInit = {}, retry = true): Promise<Response> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, credentials: 'include', headers: { 'content-type': 'application/json', ...(init.headers ?? {}) } });
  if (response.status !== 401 || !retry) return response;
  const csrf = cookie('aq_csrf');
  if (!csrf) return response;
  const refreshed = await fetch(`${API_BASE}/auth/refresh`, { method: 'POST', credentials: 'include', headers: { 'x-csrf-token': csrf } });
  if (!refreshed.ok) return response;
  return apiFetch(path, init, false);
}

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await apiFetch(path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}
