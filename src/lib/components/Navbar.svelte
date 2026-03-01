<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore, currentUser } from '$lib/stores/auth';
  import { authApi } from '$lib/api/auth';

  let loggingOut = $state(false);

  async function handleLogout() {
    loggingOut = true;
    try {
      await authApi.logout();
      goto('/auth/login');
    } finally {
      loggingOut = false;
    }
  }
</script>

<div class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-40 shadow-sm">
  <div class="navbar-start">
    <a href="/" class="btn btn-ghost text-xl font-bold">
      <span class="text-primary">BT</span><span class="text-secondary">Capital</span>
    </a>
  </div>

  <div class="navbar-end gap-2">
    {#if $currentUser}
      <div class="dropdown dropdown-end">
        <button
          type="button"
          class="btn btn-ghost btn-circle avatar placeholder"
        >
          <div class="bg-primary text-primary-content rounded-full w-10 flex items-center justify-center">
            <span class="text-sm font-semibold">
              {$currentUser.firstName[0]}{$currentUser.lastName[0]}
            </span>
          </div>
        </button>
        <ul
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-56 border border-base-200"
        >
          <li class="px-3 py-2 border-b border-base-200 mb-1">
            <span class="font-semibold text-sm">{$currentUser.firstName} {$currentUser.lastName}</span>
            <span class="text-xs text-base-content/50">{$currentUser.email}</span>
          </li>
          <li><a href="/profile">Mon profil</a></li>
          <li><a href="/kyc">Documents KYC</a></li>
          {#if $currentUser.role === 'ADMIN'}
            <li><a href="/admin">Administration</a></li>
          {/if}
          <li class="border-t border-base-200 mt-1 pt-1">
            <button onclick={handleLogout} class="text-error" disabled={loggingOut}>
              {loggingOut ? 'Déconnexion...' : 'Se déconnecter'}
            </button>
          </li>
        </ul>
      </div>
    {:else}
      <a href="/auth/login" class="btn btn-ghost btn-sm">Connexion</a>
      <a href="/auth/register" class="btn btn-primary btn-sm">S'inscrire</a>
    {/if}
  </div>
</div>
