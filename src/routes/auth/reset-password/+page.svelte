<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authApi } from '$lib/api/auth';
  import Alert from '$lib/components/Alert.svelte';
  import { ApiException } from '$lib/api/client';

  const token = $derived($page.url.searchParams.get('token') ?? '');

  let newPassword = $state('');
  let confirmPassword = $state('');
  let loading = $state(false);
  let error = $state('');
  let success = $state('');

  const passwordsMatch = $derived(newPassword === confirmPassword || confirmPassword === '');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';

    if (!token) {
      error = 'Lien de réinitialisation invalide.';
      return;
    }
    if (newPassword !== confirmPassword) {
      error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    loading = true;
    try {
      await authApi.resetPassword({ token, newPassword });
      success = 'Mot de passe réinitialisé avec succès.';
      setTimeout(() => goto('/auth/login'), 2000);
    } catch (err) {
      error = err instanceof ApiException ? err.message : 'Une erreur est survenue.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Réinitialisation du mot de passe — BT Capital</title>
</svelte:head>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body gap-5">
    <div>
      <h2 class="card-title text-2xl font-bold">Nouveau mot de passe</h2>
      <p class="text-base-content/50 text-sm mt-1">Choisissez un mot de passe sécurisé.</p>
    </div>

    {#if !token}
      <Alert type="error" message="Lien de réinitialisation invalide ou expiré." />
      <a href="/auth/forgot-password" class="btn btn-primary btn-sm">Demander un nouveau lien</a>
    {:else}
      {#if error}
        <Alert type="error" message={error} onDismiss={() => (error = '')} />
      {/if}
      {#if success}
        <Alert type="success" message={success} />
        <p class="text-sm text-center text-base-content/50">Redirection vers la connexion...</p>
      {:else}
        <form onsubmit={handleSubmit} class="flex flex-col gap-4">
          <div class="form-control">
            <label class="label label-text font-medium" for="newPassword">Nouveau mot de passe</label>
            <input
              id="newPassword"
              type="password"
              class="input input-bordered w-full"
              placeholder="Min. 8 caractères"
              bind:value={newPassword}
              required
              minlength="8"
            />
          </div>

          <div class="form-control">
            <label class="label label-text font-medium" for="confirm">Confirmer le mot de passe</label>
            <input
              id="confirm"
              type="password"
              class="input input-bordered w-full {confirmPassword && !passwordsMatch ? 'input-error' : ''}"
              placeholder="Répétez le mot de passe"
              bind:value={confirmPassword}
              required
            />
            {#if confirmPassword && !passwordsMatch}
              <p class="input-error-text">Les mots de passe ne correspondent pas.</p>
            {/if}
          </div>

          <button type="submit" class="btn btn-primary w-full" disabled={loading}>
            {#if loading}
              <span class="loading loading-spinner loading-sm"></span>
              Réinitialisation...
            {:else}
              Réinitialiser le mot de passe
            {/if}
          </button>
        </form>
      {/if}
    {/if}
  </div>
</div>
