import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';
import type { User, LoginResponse } from '$lib/types';

// ==================== State interface ====================

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  initialized: boolean;
}

// ==================== Store factory ====================

export function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    initialized: false
  });

  // ── Init : restaure la session et rafraîchit silencieusement le token ──
  async function init() {
    if (!browser) {
      update((s) => ({ ...s, initialized: true }));
      return;
    }

    const storedRefresh = localStorage.getItem('btc_refresh_token');
    const userStr = localStorage.getItem('btc_user');
    const storedUser = userStr ? (JSON.parse(userStr) as User) : null;

    if (!storedRefresh) {
      set({ user: null, accessToken: null, refreshToken: null, initialized: true });
      return;
    }

    // Silent refresh — obtenir un accessToken frais sans que l'utilisateur le voie
    try {
      const res = await fetch(`${PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefresh })
      });

      if (res.ok) {
        const data = await res.json();
        const freshUser: User = data.user ?? storedUser;
        localStorage.setItem('btc_refresh_token', data.refreshToken);
        if (freshUser) localStorage.setItem('btc_user', JSON.stringify(freshUser));
        set({
          user: freshUser,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          initialized: true
        });
        return;
      }
    } catch {
      // Erreur réseau — on continue sans token (mode dégradé)
    }

    // Le refresh a échoué (token révoqué ou expiré) → déconnexion propre
    localStorage.removeItem('btc_refresh_token');
    localStorage.removeItem('btc_user');
    set({ user: null, accessToken: null, refreshToken: null, initialized: true });
  }

  function login(response: LoginResponse) {
    if (browser) {
      localStorage.setItem('btc_refresh_token', response.refreshToken);
      localStorage.setItem('btc_user', JSON.stringify(response.user));
    }
    set({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      initialized: true
    });
  }

  function setTokens(accessToken: string, refreshToken: string) {
    if (browser) {
      localStorage.setItem('btc_refresh_token', refreshToken);
    }
    update((s) => ({ ...s, accessToken, refreshToken }));
  }

  function setUser(user: User) {
    if (browser) {
      localStorage.setItem('btc_user', JSON.stringify(user));
    }
    update((s) => ({ ...s, user }));
  }

  function logout() {
    if (browser) {
      localStorage.removeItem('btc_refresh_token');
      localStorage.removeItem('btc_user');
    }
    set({ user: null, accessToken: null, refreshToken: null, initialized: true });
  }

  return { subscribe, init, login, setTokens, setUser, logout, _get: () => get({ subscribe }) };
}

// ==================== Singleton ====================

export const authStore = createAuthStore();
export const isAuthenticated = derived(authStore, ($a) => !!$a.accessToken);
export const currentUser = derived(authStore, ($a) => $a.user);
