<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authApi } from '$lib/api/auth';
  import Alert from '$lib/components/Alert.svelte';
  import { ApiException } from '$lib/api/client';

  const token = $derived($page.url.searchParams.get('token') ?? '');

  let newPassword = $state('');
  let confirmPassword = $state('');
  let showNew = $state(false);
  let showConfirm = $state(false);
  let loading = $state(false);
  let error = $state('');
  let success = $state('');

  const passwordsMatch = $derived(newPassword === confirmPassword || confirmPassword === '');
  const passwordStrong = $derived(newPassword.length >= 8);

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

<div class="card bg-white shadow-xl rounded-[32px] p-3 border-t-4 border-primary">
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
            <div class="relative">
              <input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                class="input input-bordered w-full pr-10 {newPassword && !passwordStrong ? 'input-error' : ''}"
                placeholder="Min. 8 caractères"
                bind:value={newPassword}
                required
                minlength="8"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/40 hover:text-base-content"
                onclick={() => (showNew = !showNew)}
                aria-label={showNew ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {#if showNew}
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                {/if}
              </button>
            </div>
            {#if newPassword && !passwordStrong}
              <p class="input-error-text">Au moins 8 caractères requis.</p>
            {/if}
          </div>

          <div class="form-control">
            <label class="label label-text font-medium" for="confirm">Confirmer le mot de passe</label>
            <div class="relative">
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                class="input input-bordered w-full pr-10 {confirmPassword && !passwordsMatch ? 'input-error' : ''}"
                placeholder="Répétez le mot de passe"
                bind:value={confirmPassword}
                required
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/40 hover:text-base-content"
                onclick={() => (showConfirm = !showConfirm)}
                aria-label={showConfirm ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {#if showConfirm}
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                {/if}
              </button>
            </div>
            {#if confirmPassword && !passwordsMatch}
              <p class="input-error-text">Les mots de passe ne correspondent pas.</p>
            {/if}
          </div>

          <button type="submit" class="btn btn-primary w-full text-white" disabled={loading || !passwordStrong}>
            {#if loading}
              <span class="loading loading-spinner loading-sm"></span>
              Réinitialisation...
            {:else}
              Réinitialiser le mot de passe
            {/if}
          </button>
        </form>

        <p class="text-center text-sm text-base-content/60">
          <a href="/auth/login" class="link link-primary font-medium">Retour à la connexion</a>
        </p>
      {/if}
    {/if}
  </div>
</div>
