<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { authApi } from "$lib/api/auth";
  import { ApiException } from "$lib/api/client";

  type Status = "loading" | "success" | "error" | "missing";

  let status = $state<Status>("loading");
  let errorMessage = $state("");

  onMount(async () => {
    const token = $page.url.searchParams.get("token");

    if (!token) {
      status = "missing";
      return;
    }

    try {
      await authApi.verifyEmail(token);
      status = "success";
    } catch (err) {
      status = "error";
      errorMessage =
        err instanceof ApiException
          ? err.message
          : "Une erreur est survenue lors de la vérification.";
    }
  });
</script>

<svelte:head>
  <title>Vérification e-mail — BT Capital</title>
</svelte:head>

<div class="card bg-white shadow-xl rounded-[32px] p-2 border-t-4 border-primary">
  <div class="card-body gap-6 items-center text-center">

    {#if status === "loading"}
      <!-- Loading -->
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <div>
        <h2 class="card-title text-xl font-bold justify-center">Vérification en cours…</h2>
        <p class="text-base-content/50 text-sm mt-1">Veuillez patienter quelques instants.</p>
      </div>

    {:else if status === "success"}
      <!-- Success -->
      <div class="w-16 h-16 rounded-full bg-emerald-light flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h2 class="card-title text-xl font-bold justify-center">E-mail vérifié !</h2>
        <p class="text-base-content/60 text-sm mt-1">
          Votre compte est activé. Vous pouvez maintenant vous connecter.
        </p>
      </div>
      <a href="/auth/login" class="btn btn-primary w-full text-white">
        Se connecter
      </a>

    {:else if status === "error"}
      <!-- Error -->
      <div class="w-16 h-16 rounded-full bg-danger-light flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-danger-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div>
        <h2 class="card-title text-xl font-bold justify-center">Vérification échouée</h2>
        <p class="text-base-content/60 text-sm mt-1">{errorMessage}</p>
      </div>
      <div class="flex flex-col gap-2 w-full">
        <a href="/auth/login" class="btn btn-primary w-full text-white">Se connecter</a>
        <a href="/auth/register" class="btn btn-ghost w-full text-sm">Créer un nouveau compte</a>
      </div>

    {:else if status === "missing"}
      <!-- Missing token -->
      <div class="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h2 class="card-title text-xl font-bold justify-center">Lien invalide</h2>
        <p class="text-base-content/60 text-sm mt-1">
          Aucun token de vérification trouvé dans l'URL.
          Vérifiez que vous avez bien cliqué sur le lien reçu par e-mail.
        </p>
      </div>
      <a href="/auth/register" class="btn btn-primary w-full text-white">Retour à l'inscription</a>
    {/if}

  </div>
</div>
