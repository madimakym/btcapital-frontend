<script lang="ts">
  import { authApi } from '$lib/api/auth';
  import Alert from '$lib/components/Alert.svelte';
  import { ApiException } from '$lib/api/client';

  let email = $state('');
  let loading = $state(false);
  let error = $state('');
  let success = $state('');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    loading = true;
    try {
      await authApi.forgotPassword({ email });
      success = 'Si un compte existe avec cet e-mail, vous recevrez un lien de réinitialisation.';
    } catch (err) {
      error = err instanceof ApiException ? err.message : 'Une erreur est survenue.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Mot de passe oublié — BT Capital</title>
</svelte:head>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body gap-5">
    <div>
      <h2 class="card-title text-2xl font-bold">Mot de passe oublié</h2>
      <p class="text-base-content/50 text-sm mt-1">
        Entrez votre e-mail pour recevoir un lien de réinitialisation.
      </p>
    </div>

    {#if error}
      <Alert type="error" message={error} onDismiss={() => (error = '')} />
    {/if}
    {#if success}
      <Alert type="success" message={success} />
    {/if}

    {#if !success}
      <form onsubmit={handleSubmit} class="flex flex-col gap-4">
        <div class="form-control">
          <label class="label label-text font-medium" for="email">Adresse e-mail</label>
          <input
            id="email"
            type="email"
            class="input input-bordered w-full"
            placeholder="vous@exemple.com"
            bind:value={email}
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-full" disabled={loading}>
          {#if loading}
            <span class="loading loading-spinner loading-sm"></span>
            Envoi en cours...
          {:else}
            Envoyer le lien
          {/if}
        </button>
      </form>
    {/if}

    <p class="text-center text-sm text-base-content/60">
      <a href="/auth/login" class="link link-primary">← Retour à la connexion</a>
    </p>
  </div>
</div>
