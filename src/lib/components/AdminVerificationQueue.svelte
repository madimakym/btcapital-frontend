<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin';
  import { ROLE_LABELS, type PendingVerificationUser } from '$lib/types';

  type UserBadge = 'KYC Pending' | 'KYB Pending';

  let users = $state<PendingVerificationUser[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      const res = await adminApi.getPendingVerificationUsers(0, 10);
      users = res.data;
    } catch {
      error = 'Impossible de charger la file de vérification.';
    } finally {
      loading = false;
    }
  });

  function getBadge(user: PendingVerificationUser): UserBadge {
    return user.role === 'INVESTOR' ? 'KYC Pending' : 'KYB Pending';
  }

  function getStatusInfo(user: PendingVerificationUser): string {
    const total = user.kycDocuments.length;
    if (total === 0) return 'Aucun document soumis';
    const pending = user.kycDocuments.filter((d) => d.status === 'PENDING').length;
    const approved = user.kycDocuments.filter((d) => d.status === 'APPROVED').length;
    const parts: string[] = [`${total} document${total > 1 ? 's' : ''} soumis`];
    if (approved > 0) parts.push(`${approved} approuvé${approved > 1 ? 's' : ''}`);
    if (pending > 0) parts.push(`${pending} en attente`);
    return parts.join(' • ');
  }

  const badgeClass: Record<UserBadge, string> = {
    'KYC Pending': 'bg-amber-100 text-amber-700',
    'KYB Pending': 'bg-amber-100 text-amber-700',
  };

  function fullName(user: PendingVerificationUser): string {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    return name || user.email;
  }
</script>

<div class="bg-white rounded-3xl px-8 py-8 shadow-xs shadow-black/20">
  <h2 class="text-2xl font-semibold mb-6">En attente de vérification</h2>

  {#if loading}
    <div class="flex justify-center py-10">
      <span class="loading loading-spinner loading-md text-primary"></span>
    </div>

  {:else if error}
    <p class="text-sm text-error text-center py-6">{error}</p>

  {:else if users.length === 0}
    <p class="text-sm text-base-content/40 text-center py-10">
      Aucun utilisateur en attente de vérification.
    </p>

  {:else}
    <div class="space-y-4">
      {#each users as user (user.id)}
        <div class="border border-base-200 rounded-2xl px-5 py-4">
          <div class="flex items-start justify-between mb-1">
            <span class="font-bold text-base">{fullName(user)}</span>
            <span class="text-xs font-medium px-3 py-1 rounded-full shrink-0 ml-3 {badgeClass[getBadge(user)]}">
              {getBadge(user)}
            </span>
          </div>
          <p class="text-sm text-base-content/50 mb-1">
            {ROLE_LABELS[user.role]} • {user.email}
          </p>
          <p class="text-sm text-base-content/40 mb-4">
            {getStatusInfo(user)}
          </p>
          <div class="flex items-center gap-3">
            <a
              href="/admin/kyc/{user.id}"
              class="flex-1 btn btn-sm bg-[#069668] hover:bg-[#246040] text-white border-none rounded-lg h-9"
            >
              Vérifier
            </a>
            <button class="flex-1 btn btn-sm bg-transparent border border-red-500 text-red-500 hover:bg-red-50 rounded-lg h-9">
              Signaler
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
