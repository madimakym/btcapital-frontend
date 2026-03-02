<script lang="ts">
  import { authApi } from "$lib/api/auth";
  import { profileApi } from "$lib/api/profile";
  import { ApiException } from "$lib/api/client";
  import Alert from "$lib/components/Alert.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";

  let currentPassword = $state("");
  let newPassword = $state("");
  let confirmPassword = $state("");
  let saving = $state(false);
  let error = $state("");
  let success = $state("");
  let showCurrent = $state(false);
  let showNew = $state(false);
  let showConfirm = $state(false);

  const passwordsMatch = $derived(
    newPassword === confirmPassword || confirmPassword === "",
  );
  const passwordStrong = $derived(newPassword.length >= 8);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error = "Les mots de passe ne correspondent pas.";
      return;
    }
    error = "";
    success = "";
    saving = true;
    try {
      await profileApi.changePassword({ currentPassword, newPassword });
      success = "Mot de passe mis à jour avec succès.";
      currentPassword = "";
      newPassword = "";
      confirmPassword = "";
    } catch (err) {
      error =
        err instanceof ApiException ? err.message : "Une erreur est survenue.";
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>Sécurité — BT Capital</title>
</svelte:head>

<div class="space-y-6">
  <PageHeader
    title="Sécurité"
    description="Gérez votre mot de passe et les accès à votre compte."
  />

  <!-- Changer le mot de passe -->
  <div class="bg-white rounded-2xl border border-base-200 shadow-xs">
    <div class="px-6 py-5 border-b border-base-100">
      <h3 class="font-semibold text-sm">Changer le mot de passe</h3>
    </div>
    <div class="px-6 py-5">
      {#if error}
        <Alert type="error" message={error} onDismiss={() => (error = "")} />
      {/if}
      {#if success}
        <Alert
          type="success"
          message={success}
          onDismiss={() => (success = "")}
        />
      {/if}

      <form onsubmit={handleSubmit} class="flex flex-col gap-4 mt-2">
        <div class="form-control">
          <label class="label label-text font-medium" for="current">
            Mot de passe actuel
          </label>
          <div class="relative w-full max-w-sm">
            <input
              id="current"
              type={showCurrent ? "text" : "password"}
              class="input input-bordered w-full pr-10"
              bind:value={currentPassword}
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/40 hover:text-base-content"
              onclick={() => (showCurrent = !showCurrent)}
              aria-label={showCurrent ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {#if showCurrent}
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {/if}
            </button>
          </div>
        </div>

        <div class="form-control">
          <label class="label label-text font-medium" for="new">
            Nouveau mot de passe
          </label>
          <div class="relative w-full max-w-sm">
            <input
              id="new"
              type={showNew ? "text" : "password"}
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
              aria-label={showNew ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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
          <label class="label label-text font-medium" for="confirm">
            Confirmer le nouveau mot de passe
          </label>
          <div class="relative w-full max-w-sm">
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              class="input input-bordered w-full pr-10 {confirmPassword && !passwordsMatch ? 'input-error' : ''}"
              bind:value={confirmPassword}
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/40 hover:text-base-content"
              onclick={() => (showConfirm = !showConfirm)}
              aria-label={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {#if showConfirm}
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {/if}
            </button>
          </div>
          {#if confirmPassword && !passwordsMatch}
            <p class="input-error-text">
              Les mots de passe ne correspondent pas.
            </p>
          {/if}
        </div>

        <div>
          <button
            type="submit"
            class="btn btn-primary btn-sm"
            disabled={saving}
          >
            {#if saving}
              <span class="loading loading-spinner loading-xs"></span>
              Mise à jour...
            {:else}
              Mettre à jour
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Sessions actives (placeholder) -->
  <div class="bg-white rounded-2xl border border-base-200 shadow-xs">
    <div class="px-6 py-5 border-b border-base-100">
      <h3 class="font-semibold text-sm">Sessions actives</h3>
    </div>
    <div class="px-6 py-8 text-center text-sm text-base-content/40">
      Gestion des sessions à venir.
    </div>
  </div>
</div>
