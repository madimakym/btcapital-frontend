import { PUBLIC_API_URL } from '$env/static/public';
import { get } from 'svelte/store';
import type { ApiError } from '$lib/types';

// Forward declaration — resolved at runtime to avoid circular imports
let _authStore: ReturnType<typeof import('$lib/stores/auth').createAuthStore> | null = null;

async function getAuthStore() {
  if (!_authStore) {
    const mod = await import('$lib/stores/auth');
    _authStore = mod.authStore;
  }
  return _authStore;
}

// ==================== ApiException ====================

export class ApiException extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string | undefined,
    message: string,
    public readonly errors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// ==================== Response handler ====================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let error: ApiError;
    try {
      error = await response.json();
    } catch {
      error = { message: `Erreur HTTP ${response.status}` };
    }
    throw new ApiException(response.status, error.code, error.message, error.errors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ==================== Refresh token logic ====================

async function tryRefreshToken(): Promise<boolean> {
  const store = await getAuthStore();
  const { refreshToken } = get(store);
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
      const data = await response.json();
      store.setTokens(data.accessToken, data.refreshToken);
      return true;
    }
  } catch {
    // ignore network errors
  }

  store.logout();
  return false;
}

// ==================== Main request function ====================

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  withAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (withAuth) {
    const store = await getAuthStore();
    const { accessToken } = get(store);
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(`${PUBLIC_API_URL}${path}`, {
    ...options,
    headers
  });

  // Auto-refresh on 401
  if (response.status === 401 && withAuth) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const store = await getAuthStore();
      const { accessToken } = get(store);
      headers['Authorization'] = `Bearer ${accessToken}`;
      const retry = await fetch(`${PUBLIC_API_URL}${path}`, { ...options, headers });
      return handleResponse<T>(retry);
    }
  }

  return handleResponse<T>(response);
}

// ==================== File upload ====================

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  withAuth = true
): Promise<T> {
  const headers: Record<string, string> = {};

  if (withAuth) {
    const store = await getAuthStore();
    const { accessToken } = get(store);
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(`${PUBLIC_API_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData
  });

  return handleResponse<T>(response);
}
