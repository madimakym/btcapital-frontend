<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import Alert from '$lib/components/Alert.svelte';
  import { ApiException } from '$lib/api/client';
  import { ROLE_LABELS, type UserResponse, type PageResponse } from '$lib/types';

  let data = $state<PageResponse<UserResponse> | null>(null);
  let loading = $state(true);
  let actionLoading = $state<string | null>(null);
  let error = $state('');
  let success = $state('');
  let currentPage = $state(0);

  onMount(() => loadUsers());

  async function loadUsers() {
    loading = true;
    try {
      data = await adminApi.getUsers(currentPage, 20);
    } catch {
      error = 'Impossible de charger les utilisateurs.';
    } finally {
      loading = false;
    }
  }

  async function toggleUserStatus(user: UserResponse) {
    actionLoading = user.id;
    error = '';
    try {
      const updated =
        user.status === 'ACTIVE'
          ? await adminApi.suspendUser(user.id)
          : await adminApi.activateUser(user.id);

      if (data) {
        data = {
          ...data,
          content: data.content.map((u) => (u.id === updated.id ? updated : u))
        };
      }
      success = `Utilisateur ${updated.firstName} ${updated.status === 'ACTIVE' ? 'activé' : 'suspendu'}.`;
    } catch (err) {
      error = err instanceof ApiException ? err.message : 'Erreur lors de la mise à jour.';
    } finally {
      actionLoading = null;
    }
  }

  async function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      await loadUsers();
    }
  }

  async function nextPage() {
    if (data && currentPage < data.meta.totalPages - 1) {
      currentPage++;
      await loadUsers();
    }
  }
</script>

<svelte:head>
  <title>Utilisateurs — Admin BT Capital</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">Gestion des utilisateurs</h1>
      <p class="text-base-content/50 text-sm mt-1">
        {data ? `${data.meta.totalElements} utilisateurs au total` : ''}
      </p>
    </div>
    <button onclick={loadUsers} class="btn btn-ghost btn-sm" disabled={loading}>
      ↺ Actualiser
    </button>
  </div>

  {#if error}
    <Alert type="error" message={error} onDismiss={() => (error = '')} />
  {/if}
  {#if success}
    <Alert type="success" message={success} onDismiss={() => (success = '')} />
  {/if}

  <div class="card bg-base-100 border border-base-200">
    <div class="card-body p-0">
      {#if loading}
        <div class="flex justify-center py-16"><LoadingSpinner text="Chargement..." /></div>
      {:else if data && data.content.length > 0}
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Inscrit le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each data.content as user}
                <tr class="hover">
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="avatar placeholder">
                        <div class="bg-primary/10 text-primary rounded-full w-9 flex items-center justify-center">
                          <span class="text-xs font-semibold">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p class="font-medium text-sm">{user.firstName} {user.lastName}</p>
                        <p class="text-xs text-base-content/50">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-outline badge-sm">{ROLE_LABELS[user.role]}</span>
                  </td>
                  <td><StatusBadge status={user.status} /></td>
                  <td class="text-sm text-base-content/50">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    {#if user.role !== 'ADMIN'}
                      <button
                        class="btn btn-xs {user.status === 'ACTIVE' ? 'btn-error' : 'btn-success'}"
                        onclick={() => toggleUserStatus(user)}
                        disabled={actionLoading === user.id}
                      >
                        {#if actionLoading === user.id}
                          <span class="loading loading-spinner loading-xs"></span>
                        {:else}
                          {user.status === 'ACTIVE' ? 'Suspendre' : 'Activer'}
                        {/if}
                      </button>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        {#if data.meta.totalPages > 1}
          <div class="flex items-center justify-between px-4 py-3 border-t border-base-200">
            <p class="text-sm text-base-content/50">
              Page {currentPage + 1} / {data.meta.totalPages}
            </p>
            <div class="join">
              <button class="join-item btn btn-sm" onclick={prevPage} disabled={currentPage === 0}>
                «
              </button>
              <button
                class="join-item btn btn-sm"
                onclick={nextPage}
                disabled={currentPage >= data.meta.totalPages - 1}
              >
                »
              </button>
            </div>
          </div>
        {/if}
      {:else}
        <div class="text-center py-16 text-base-content/40">
          <p class="text-4xl mb-3">👥</p>
          <p>Aucun utilisateur trouvé.</p>
        </div>
      {/if}
    </div>
  </div>
</div>
