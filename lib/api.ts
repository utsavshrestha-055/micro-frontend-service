export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://micro-api-service.batman').replace(/\/$/, '');
const API_PREFIX = `${API_BASE_URL}/api/v1`;
const TOKEN_KEY = 'atelier-access-token';

export function getAccessToken() {
  return typeof window === 'undefined' ? '' : localStorage.getItem(TOKEN_KEY) || '';
}

export function setAccessToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, authenticated = true): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');

  const token = getAccessToken();
  if (authenticated && token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_PREFIX}${path}`, { ...init, headers, cache: 'no-store' });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && authenticated) clearAccessToken();
    const detail = body.detail;
    throw new Error(typeof detail === 'string' ? detail : `API request failed (${response.status})`);
  }
  return body.data as T;
}
