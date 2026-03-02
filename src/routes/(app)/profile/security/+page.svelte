<script lang="ts">
  import { authApi } from "$lib/api/auth";
  import { ApiException } from "$lib/api/client";
  import Alert from "$lib/components/Alert.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";

  let currentPassword = $state("");
  let newPassword = $state("");
  let confirmPassword = $state("");
  let saving = $state(false);
  let error = $state("");
  let success = $state("");

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
      // TODO: call API when endpoint is ready
      await new Promise((r) => setTimeout(r, 800));
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
          <input
            id="current"
            type="password"
            class="input input-bordered w-full max-w-sm"
            bind:value={currentPassword}
            required
          />
        </div>

        <div class="form-control">
          <label class="label label-text font-medium" for="new">
            Nouveau mot de passe
          </label>
          <input
            id="new"
            type="password"
            class="input input-bordered w-full max-w-sm {newPassword &&
            !passwordStrong
              ? 'input-error'
              : ''}"
            placeholder="Min. 8 caractères"
            bind:value={newPassword}
            required
            minlength="8"
          />
          {#if newPassword && !passwordStrong}
            <p class="input-error-text">Au moins 8 caractères requis.</p>
          {/if}
        </div>

        <div class="form-control">
          <label class="label label-text font-medium" for="confirm">
            Confirmer le nouveau mot de passe
          </label>
          <input
            id="confirm"
            type="password"
            class="input input-bordered w-full max-w-sm {confirmPassword &&
            !passwordsMatch
              ? 'input-error'
              : ''}"
            bind:value={confirmPassword}
            required
          />
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
