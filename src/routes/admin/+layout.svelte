<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

  let { children } = $props();
  let checking = $state(true);
  let forbidden = $state(false);

  onMount(() => {
    const unsubscribe = authStore.subscribe((state) => {
      if (state.initialized) {
        checking = false;
        if (!state.refreshToken) {
          goto('/auth/login');
          return;
        }
        if (state.user?.role !== 'ADMIN') {
          forbidden = true;
        }
      }
    });

    return unsubscribe;
  });
</script>

{#if checking}
  <div class="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Vérification des permissions..." />
  </div>
{:else if forbidden}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center space-y-4">
      <p class="text-6xl">🚫</p>
      <h1 class="text-2xl font-bold text-error">Accès refusé</h1>
      <p class="text-base-content/50">Vous n'avez pas les droits d'accès à cette section.</p>
      <a href="/dashboard" class="btn btn-primary">Retour au tableau de bord</a>
    </div>
  </div>
{:else}
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Admin top bar -->
      <div class="navbar bg-error/5 border-b border-error/20 px-6">
        <span class="badge badge-error badge-sm font-semibold">Administration</span>
      </div>
      <main class="flex-1 p-6 bg-base-100 overflow-auto">
        {@render children()}
      </main>
    </div>
  </div>
{/if}
