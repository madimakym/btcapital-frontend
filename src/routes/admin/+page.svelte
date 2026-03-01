<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import type { AdminStats } from '$lib/types';

  let stats = $state<AdminStats | null>(null);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    try {
      stats = await adminApi.getStats();
    } catch {
      error = 'Impossible de charger les statistiques.';
    } finally {
      loading = false;
    }
  });

  const statCards = $derived(
    stats
      ? [
          { label: 'Utilisateurs total', value: stats.totalUsers, icon: '👥', color: 'text-primary' },
          { label: 'Actifs', value: stats.activeUsers, icon: '✅', color: 'text-success' },
          { label: 'En attente', value: stats.pendingVerification, icon: '⏳', color: 'text-warning' },
          { label: 'Suspendus', value: stats.suspended, icon: '🚫', color: 'text-error' },
          { label: 'Investisseurs', value: stats.investors, icon: '💼', color: 'text-primary' },
          { label: 'Entrepreneurs', value: stats.entrepreneurs, icon: '🚀', color: 'text-secondary' },
          { label: 'Incubateurs', value: stats.incubators, icon: '🏢', color: 'text-accent' },
          { label: 'KYC en attente', value: stats.pendingKyc, icon: '📋', color: 'text-warning' }
        ]
      : []
  );
</script>

<svelte:head>
  <title>Dashboard Admin — BT Capital</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <h1 class="text-2xl font-bold">Dashboard Administration</h1>
    <p class="text-base-content/50 text-sm mt-1">Vue d'ensemble de la plateforme BT Capital.</p>
  </div>

  {#if loading}
    <div class="flex justify-center py-16"><LoadingSpinner size="lg" text="Chargement des stats..." /></div>
  {:else if error}
    <div class="alert alert-error">{error}</div>
  {:else if stats}
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {#each statCards as card}
        <div class="card bg-base-100 border border-base-200">
          <div class="card-body p-4">
            <div class="text-2xl mb-1">{card.icon}</div>
            <div class="text-2xl font-bold {card.color}">{card.value}</div>
            <div class="text-xs text-base-content/50">{card.label}</div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <a href="/admin/users" class="card bg-primary text-primary-content hover:opacity-90 transition-opacity cursor-pointer">
        <div class="card-body">
          <h2 class="card-title">Gérer les utilisateurs</h2>
          <p class="text-primary-content/70 text-sm">
            Consultez, suspendez ou activez des comptes.
          </p>
          <div class="card-actions mt-2">
            <span class="btn btn-sm bg-white/20 border-none hover:bg-white/30">
              Voir les utilisateurs →
            </span>
          </div>
        </div>
      </a>

      <a href="/admin/kyc" class="card bg-warning text-warning-content hover:opacity-90 transition-opacity cursor-pointer">
        <div class="card-body">
          <h2 class="card-title">
            Révision KYC
            {#if stats.pendingKyc > 0}
              <span class="badge badge-error">{stats.pendingKyc}</span>
            {/if}
          </h2>
          <p class="text-warning-content/70 text-sm">
            Approuvez ou rejetez les documents soumis.
          </p>
          <div class="card-actions mt-2">
            <span class="btn btn-sm bg-black/10 border-none hover:bg-black/20">
              Réviser les KYC →
            </span>
          </div>
        </div>
      </a>
    </div>
  {/if}
</div>
