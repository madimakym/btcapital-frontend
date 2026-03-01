<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authApi } from "$lib/api/auth";
  import Alert from "$lib/components/Alert.svelte";
  import { ApiException } from "$lib/api/client";

  let email = $state("makymadi@gmail.com");
  let password = $state("Passer242#");
  let loading = $state(false);
  let error = $state("");

  // Redirect target après login
  const redirectTo = $derived(
    $page.url.searchParams.get("redirect") ?? "/dashboard",
  );

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = "";
    loading = true;
    try {
      await authApi.login({ email, password });
      goto(redirectTo);
    } catch (err) {
      error =
        err instanceof ApiException ? err.message : "Une erreur est survenue.";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Connexion — BT Capital</title>
</svelte:head>

<div class="card bg-white shadow-xl rounded-[32px] p-3 border-t-4 border-primary">
  <div class="card-body gap-5">
    <div>
      <h2 class="card-title text-4xl font-semibold">BTCapital</h2>
      <p class="text-base-content/50 text-sm mt-1">
        Connectiong innovators with global capital
      </p>
    </div>

    {#if error}
      <Alert type="error" message={error} onDismiss={() => (error = "")} />
    {/if}

    <form onsubmit={handleSubmit} class="flex flex-col gap-4">
      <div class="form-control">
        <label class="label" for="email">
          <span class="label-text font-medium">Adresse e-mail</span>
        </label>
        <input
          id="email"
          type="email"
          class="input input-bordered w-full"
          placeholder="vous@exemple.com"
          bind:value={email}
          required
          autocomplete="email"
        />
      </div>

      <div class="form-control">
        <label class="label" for="password">
          <span class="label-text font-medium">Mot de passe</span>
        </label>
        <input
          id="password"
          type="password"
          class="input input-bordered w-full"
          placeholder="••••••••"
          bind:value={password}
          required
          autocomplete="current-password"
        />
        <a
          href="/auth/forgot-password"
          class="label-text-alt link link-hover text-primary mt-5 text-right">
          Mot de passe oublié ?
        </a>
      </div>

      <button
        type="submit"
        class="btn btn-primary w-full mt-2 text-white"
        disabled={loading}
      >
        {#if loading}
          <span class="loading loading-spinner loading-sm"></span>
          Connexion...
        {:else}
          Se connecter
        {/if}
      </button>
    </form>

    <p class="text-center text-sm text-base-content/60">
      Pas encore de compte ?
      <a href="/auth/register" class="link link-primary font-medium"
        >S'inscrire</a
      >
    </p>
  </div>
</div>
