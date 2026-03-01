<script lang="ts">
  import { goto } from "$app/navigation";
  import { authApi } from "$lib/api/auth";
  import Alert from "$lib/components/Alert.svelte";
  import { ApiException } from "$lib/api/client";
  import type { UserRole } from "$lib/types";

  let firstName = $state("");
  let lastName = $state("");
  let email = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let role = $state<UserRole>("ENTREPRENEUR");
  let acceptMarketing = $state(false);
  let loading = $state(false);
  let error = $state("");
  let success = $state("");

  const roles: {
    value: UserRole;
    label: string;
    desc: string;
  }[] = [
    {
      value: "INVESTOR",
      label: "Investisseur",
      desc: "Je souhaite investir dans des startups",
    },
    {
      value: "ENTREPRENEUR",
      label: "Entrepreneur",
      desc: "Je cherche des financements",
    },
    {
      value: "INCUBATOR",
      label: "Incubateur",
      desc: "J'accompagne des startups",
    },
  ];

  const passwordsMatch = $derived(
    password === confirmPassword || confirmPassword === "",
  );
  const passwordStrong = $derived(password.length >= 8);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = "";

    if (password !== confirmPassword) {
      error = "Les mots de passe ne correspondent pas.";
      return;
    }
    if (!acceptMarketing) {
      error = "Veuillez accepter les conditions d'utilisation.";
      return;
    }

    loading = true;
    try {
      await authApi.register({
        firstName,
        lastName,
        email,
        password,
        role,
        acceptMarketing,
      });
      success =
        "Compte créé ! Vérifiez votre e-mail pour activer votre compte.";
    } catch (err) {
      error =
        err instanceof ApiException ? err.message : "Une erreur est survenue.";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Inscription — BTCapital</title>
</svelte:head>

<div
  class="card bg-white shadow-xl rounded-[32px] p-2 border-t-4 border-primary"
>
  <div class="card-body gap-5">
    <div>
      <h2 class="card-title text-2xl font-bold">Créer un compte</h2>
      <p class="text-base-content/50 text-sm mt-1">
        Rejoignez l'écosystème BTCapital
      </p>
    </div>

    {#if error}
      <Alert type="error" message={error} onDismiss={() => (error = "")} />
    {/if}
    {#if success}
      <Alert type="success" message={success} />
      <a href="/auth/login" class="btn btn-primary text-white w-full mt-2"
        >Aller à la connexion</a
      >
    {:else}
      <form onsubmit={handleSubmit} class="flex flex-col gap-4">
        <!-- Nom / Prénom -->
        <div class="grid grid-cols-2 gap-3">
          <div class="form-control">
            <label class="label label-text font-medium" for="firstName"
              >Prénom</label
            >
            <input
              id="firstName"
              type="text"
              class="input input-bordered w-full"
              placeholder="Jean"
              bind:value={firstName}
              required
            />
          </div>
          <div class="form-control">
            <label class="label label-text font-medium" for="lastName"
              >Nom</label
            >
            <input
              id="lastName"
              type="text"
              class="input input-bordered w-full"
              placeholder="Dupont"
              bind:value={lastName}
              required
            />
          </div>
        </div>

        <!-- Email -->
        <div class="form-control">
          <label class="label label-text font-medium" for="email"
            >Adresse e-mail</label
          >
          <input
            id="email"
            type="email"
            class="input input-bordered w-full"
            placeholder="vous@exemple.com"
            bind:value={email}
            required
          />
        </div>

        <!-- Rôle -->
        <div class="form-control">
          <span class="label-text font-medium mb-2 block">Je suis un(e)...</span
          >
          <div class="grid grid-cols-3 gap-2 bg-[#F2F5F9] p-2 rounded-[8px]">
            {#each roles as r}
              <label
                class="cursor-pointer border-0 rounded-[6px] p-2 flex flex-col items-center gap-1 transition-all
                  {role === r.value
                  ? ' bg-black text-white'
                  : 'border-base-200 hover:border-base-300'}"
              >
                <input
                  type="radio"
                  bind:group={role}
                  value={r.value}
                  class="hidden"
                />
                <span class="text-xs font-semibold">{r.label}</span>
              </label>
            {/each}
          </div>
          <p class="text-xs text-base-content/50 mt-1">
            {roles.find((r) => r.value === role)?.desc}
          </p>
        </div>

        <!-- Mot de passe -->
        <div class="form-control">
          <label class="label label-text font-medium" for="password"
            >Mot de passe</label
          >
          <input
            id="password"
            type="password"
            class="input input-bordered w-full {password && !passwordStrong
              ? 'input-error'
              : ''}"
            placeholder="Min. 8 caractères"
            bind:value={password}
            required
            minlength="8"
          />
          {#if password && !passwordStrong}
            <p class="input-error-text">
              Le mot de passe doit contenir au moins 8 caractères.
            </p>
          {/if}
        </div>

        <div class="form-control">
          <label class="label label-text font-medium" for="confirmPassword"
            >Confirmer le mot de passe</label
          >
          <input
            id="confirmPassword"
            type="password"
            class="input input-bordered w-full {confirmPassword &&
            !passwordsMatch
              ? 'input-error'
              : ''}"
            placeholder="Répétez votre mot de passe"
            bind:value={confirmPassword}
            required
          />
          {#if confirmPassword && !passwordsMatch}
            <p class="input-error-text">
              Les mots de passe ne correspondent pas.
            </p>
          {/if}
        </div>

        <!-- CGU -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              bind:checked={acceptMarketing}
              class="checkbox checkbox-primary checkbox-sm"
            />
            <span class="label-text text-sm">
              J'accepte les
              <a href="/terms" class="link link-primary"
                >conditions d'utilisation</a
              >
              et la
              <a href="/privacy" class="link link-primary"
                >politique de confidentialité</a
              >
            </span>
          </label>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-full text-white"
          disabled={loading || !acceptMarketing}
        >
          {#if loading}
            <span class="loading loading-spinner loading-sm"></span>
            Création du compte...
          {:else}
            Créer mon compte
          {/if}
        </button>
      </form>

      <p class="text-center text-sm text-base-content/60">
        Déjà inscrit ?
        <a href="/auth/login" class="link link-primary font-medium"
          >Se connecter</a
        >
      </p>
    {/if}
  </div>
</div>
