<script lang="ts">
  import { onMount } from "svelte";
  import { currentUser } from "$lib/stores/auth";
  import { profileApi } from "$lib/api/profile";
  import Alert from "$lib/components/Alert.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import { ApiException } from "$lib/api/client";
  import {
    SECTORS,
    INVESTMENT_STAGES,
    type InvestorProfileRequest,
    type EntrepreneurProfileRequest,
    type IncubatorProfileRequest,
  } from "$lib/types";
  import { Pencil } from "lucide-svelte";

  const user = $derived($currentUser);

  // ── Modal édition nom/prénom ──
  let modalOpen = $state(false);
  let editFirstName = $state("");
  let editLastName = $state("");
  let savingName = $state(false);
  let nameError = $state("");

  function openNameModal() {
    editFirstName = user?.firstName ?? "";
    editLastName = user?.lastName ?? "";
    nameError = "";
    modalOpen = true;
  }

  async function handleSaveName(e: SubmitEvent) {
    e.preventDefault();
    nameError = "";
    savingName = true;
    try {
      await profileApi.updateMe({
        firstName: editFirstName,
        lastName: editLastName,
      });
      modalOpen = false;
    } catch (err) {
      nameError =
        err instanceof ApiException
          ? err.message
          : "Erreur lors de la mise à jour.";
    } finally {
      savingName = false;
    }
  }

  // Common fields (bio, location, links) — unified regardless of role
  let bio = $state("");
  let country = $state("");
  let city = $state("");
  let linkedinUrl = $state("");
  let websiteUrl = $state("");

  // Investor-specific
  let investmentRangeMin = $state<number | undefined>(undefined);
  let investmentRangeMax = $state<number | undefined>(undefined);
  let preferredSectors = $state<string[]>([]);
  let investmentStages = $state<string[]>([]);

  // Entrepreneur-specific
  let companyName = $state("");
  let companyDescription = $state("");
  let sector = $state("");
  let stage = $state("");
  let fundingNeeded = $state<number | undefined>(undefined);

  // Incubator-specific
  let incubatorName = $state("");
  let description = $state("");
  let focusSectors = $state<string[]>([]);
  let programDuration = $state("");
  let maxStartups = $state<number | undefined>(undefined);

  let loading = $state(true);
  let saving = $state(false);
  let error = $state("");
  let success = $state("");

  function applyInvestorProfile(p: InvestorProfileRequest) {
    bio = p.bio ?? "";
    country = p.country ?? "";
    city = p.city ?? "";
    linkedinUrl = p.linkedinUrl ?? "";
    websiteUrl = p.websiteUrl ?? "";
    investmentRangeMin = p.investmentRangeMin;
    investmentRangeMax = p.investmentRangeMax;
    preferredSectors = p.preferredSectors ?? [];
    investmentStages = p.investmentStages ?? [];
  }

  function applyEntrepreneurProfile(p: EntrepreneurProfileRequest) {
    bio = p.bio ?? "";
    country = p.country ?? "";
    city = p.city ?? "";
    linkedinUrl = p.linkedinUrl ?? "";
    websiteUrl = p.websiteUrl ?? "";
    companyName = p.companyName ?? "";
    companyDescription = p.companyDescription ?? "";
    sector = p.sector ?? "";
    stage = p.stage ?? "";
    fundingNeeded = p.fundingNeeded;
  }

  function applyIncubatorProfile(p: IncubatorProfileRequest) {
    bio = p.bio ?? "";
    country = p.country ?? "";
    city = p.city ?? "";
    linkedinUrl = p.linkedinUrl ?? "";
    websiteUrl = p.websiteUrl ?? "";
    incubatorName = p.incubatorName ?? "";
    description = p.description ?? "";
    focusSectors = p.focusSectors ?? [];
    programDuration = p.programDuration ?? "";
    maxStartups = p.maxStartups;
  }

  onMount(async () => {
    try {
      if (user?.role === "INVESTOR") {
        const p = await profileApi.getInvestorProfile().catch(() => ({}));
        applyInvestorProfile(p);
      } else if (user?.role === "ENTREPRENEUR") {
        const p = await profileApi.getEntrepreneurProfile().catch(() => ({}));
        applyEntrepreneurProfile(p);
      } else if (user?.role === "INCUBATOR") {
        const p = await profileApi.getIncubatorProfile().catch(() => ({}));
        applyIncubatorProfile(p);
      }
    } finally {
      loading = false;
    }
  });

  async function handleSave(e: SubmitEvent) {
    e.preventDefault();
    error = "";
    success = "";
    saving = true;
    try {
      if (user?.role === "INVESTOR") {
        await profileApi.updateInvestorProfile({
          bio,
          country,
          city,
          linkedinUrl,
          websiteUrl,
          investmentRangeMin,
          investmentRangeMax,
          preferredSectors,
          investmentStages,
        });
      } else if (user?.role === "ENTREPRENEUR") {
        await profileApi.updateEntrepreneurProfile({
          bio,
          country,
          city,
          linkedinUrl,
          websiteUrl,
          companyName,
          companyDescription,
          sector,
          stage,
          fundingNeeded,
        });
      } else if (user?.role === "INCUBATOR") {
        await profileApi.updateIncubatorProfile({
          bio,
          country,
          city,
          linkedinUrl,
          websiteUrl,
          incubatorName,
          description,
          focusSectors,
          programDuration,
          maxStartups,
        });
      }
      success = "Profil mis à jour avec succès.";
    } catch (err) {
      error =
        err instanceof ApiException
          ? err.message
          : "Erreur lors de la sauvegarde.";
    } finally {
      saving = false;
    }
  }

  function toggleItem(arr: string[], item: string): string[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }
</script>

<svelte:head>
  <title>Mon profil — BT Capital</title>
</svelte:head>

<div class="mx-auto space-y-6">
  <PageHeader
    title="Mon profil"
    description="Complétez votre profil pour être visible dans l'écosystème BT Capital."
  />

  <!-- Infos compte -->
  <div class="card border border-base-200">
    <div class="card-body gap-4">
      <h2 class="card-title text-base">Informations du compte</h2>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="flex justify-between">
          <div>
            <p class="text-base-content/50 text-xs mb-1">Nom complet</p>
            <p class="font-medium">{user?.firstName} {user?.lastName}</p>
          </div>
          <button
            type="button"
            onclick={openNameModal}
            class="p-1.5 rounded-lg hover:bg-base-200 transition-colors text-base-content/40 hover:text-primary mr-3"
            aria-label="Modifier le nom"
          >
            <Pencil class="w-4 h-4" />
          </button>
        </div>

        <div>
          <p class="text-base-content/50 text-xs mb-1">Email</p>
          <p class="font-medium">{user?.email}</p>
        </div>
        <div>
          <p class="text-base-content/50 text-xs mb-1">Rôle</p>
          <p class="font-medium">{user?.role}</p>
        </div>
        <div>
          <p class="text-base-content/50 text-xs mb-1">Membre depuis</p>
          <p class="font-medium">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("fr-FR")
              : "-"}
          </p>
        </div>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center py-8">
      <LoadingSpinner text="Chargement du profil..." />
    </div>
  {:else}
    <div class="card bg-base-100 border border-base-200">
      <div class="card-body">
        <h2 class="card-title text-base mb-2">
          {#if user?.role === "INVESTOR"}Profil Investisseur
          {:else if user?.role === "ENTREPRENEUR"}Profil Entrepreneur
          {:else if user?.role === "INCUBATOR"}Profil Incubateur
          {:else}Profil
          {/if}
        </h2>

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

        <form onsubmit={handleSave} class="flex flex-col gap-4 mt-2">
          <!-- Champs communs -->
          <div class="form-control">
            <label class="label label-text font-medium" for="bio"
              >Biographie</label
            >
            <textarea
              id="bio"
              class="textarea textarea-bordered w-full"
              rows="3"
              placeholder="Décrivez-vous en quelques mots..."
              bind:value={bio}
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label label-text font-medium" for="country"
                >Pays</label
              >
              <input
                id="country"
                type="text"
                class="input input-bordered w-full"
                placeholder="Sénégal"
                bind:value={country}
              />
            </div>
            <div class="form-control">
              <label class="label label-text font-medium" for="city"
                >Ville</label
              >
              <input
                id="city"
                type="text"
                class="input input-bordered w-full"
                placeholder="Dakar"
                bind:value={city}
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label label-text font-medium" for="linkedin"
              >LinkedIn</label
            >
            <input
              id="linkedin"
              type="url"
              class="input input-bordered w-full"
              placeholder="https://linkedin.com/in/..."
              bind:value={linkedinUrl}
            />
          </div>

          <div class="form-control">
            <label class="label label-text font-medium" for="website"
              >Site web</label
            >
            <input
              id="website"
              type="url"
              class="input input-bordered w-full"
              placeholder="https://monsiteweb.com"
              bind:value={websiteUrl}
            />
          </div>

          <!-- ===== Champs Investisseur ===== -->
          {#if user?.role === "INVESTOR"}
            <div class="divider text-xs">Préférences d'investissement</div>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label label-text font-medium" for="min"
                  >Budget min (USD)</label
                >
                <input
                  id="min"
                  type="number"
                  class="input input-bordered w-full"
                  placeholder="10 000"
                  bind:value={investmentRangeMin}
                />
              </div>
              <div class="form-control">
                <label class="label label-text font-medium" for="max"
                  >Budget max (USD)</label
                >
                <input
                  id="max"
                  type="number"
                  class="input input-bordered w-full"
                  placeholder="500 000"
                  bind:value={investmentRangeMax}
                />
              </div>
            </div>

            <div class="form-control">
              <span class="label-text font-medium mb-2 block"
                >Secteurs d'intérêt</span
              >
              <div class="flex flex-wrap gap-2">
                {#each SECTORS as s}
                  <button
                    type="button"
                    class="badge badge-md cursor-pointer transition-colors
                      {preferredSectors.includes(s)
                      ? 'badge-primary'
                      : 'badge-outline'}"
                    onclick={() =>
                      (preferredSectors = toggleItem(preferredSectors, s))}
                    >{s}</button
                  >
                {/each}
              </div>
            </div>

            <div class="form-control">
              <span class="label-text font-medium mb-2 block"
                >Stades d'investissement</span
              >
              <div class="flex flex-wrap gap-2">
                {#each INVESTMENT_STAGES as s}
                  <button
                    type="button"
                    class="badge badge-md cursor-pointer transition-colors
                      {investmentStages.includes(s)
                      ? 'badge-secondary'
                      : 'badge-outline'}"
                    onclick={() =>
                      (investmentStages = toggleItem(investmentStages, s))}
                    >{s}</button
                  >
                {/each}
              </div>
            </div>
          {/if}

          <!-- ===== Champs Entrepreneur ===== -->
          {#if user?.role === "ENTREPRENEUR"}
            <div class="divider text-xs">Informations startup</div>
            <div class="form-control">
              <label class="label label-text font-medium" for="company"
                >Nom de la startup</label
              >
              <input
                id="company"
                type="text"
                class="input input-bordered w-full"
                placeholder="Ma Startup SAS"
                bind:value={companyName}
              />
            </div>
            <div class="form-control">
              <label class="label label-text font-medium" for="companyDesc"
                >Description</label
              >
              <textarea
                id="companyDesc"
                class="textarea textarea-bordered w-full"
                rows="3"
                placeholder="Décrivez votre startup..."
                bind:value={companyDescription}
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label label-text font-medium" for="sector"
                  >Secteur</label
                >
                <select
                  id="sector"
                  class="select select-bordered w-full"
                  bind:value={sector}
                >
                  <option value="">Choisir...</option>
                  {#each SECTORS as s}<option value={s}>{s}</option>{/each}
                </select>
              </div>
              <div class="form-control">
                <label class="label label-text font-medium" for="stage"
                  >Stade</label
                >
                <select
                  id="stage"
                  class="select select-bordered w-full"
                  bind:value={stage}
                >
                  <option value="">Choisir...</option>
                  {#each INVESTMENT_STAGES as s}<option value={s}>{s}</option
                    >{/each}
                </select>
              </div>
            </div>
            <div class="form-control">
              <label class="label label-text font-medium" for="funding"
                >Besoin de financement (USD)</label
              >
              <input
                id="funding"
                type="number"
                class="input input-bordered w-full"
                placeholder="250 000"
                bind:value={fundingNeeded}
              />
            </div>
          {/if}

          <!-- ===== Champs Incubateur ===== -->
          {#if user?.role === "INCUBATOR"}
            <div class="divider text-xs">Informations incubateur</div>
            <div class="form-control">
              <label class="label label-text font-medium" for="incName"
                >Nom de l'incubateur</label
              >
              <input
                id="incName"
                type="text"
                class="input input-bordered w-full"
                placeholder="Mon Incubateur"
                bind:value={incubatorName}
              />
            </div>
            <div class="form-control">
              <label class="label label-text font-medium" for="incDesc"
                >Description</label
              >
              <textarea
                id="incDesc"
                class="textarea textarea-bordered w-full"
                rows="3"
                bind:value={description}
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label label-text font-medium" for="duration"
                  >Durée du programme</label
                >
                <input
                  id="duration"
                  type="text"
                  class="input input-bordered w-full"
                  placeholder="6 mois"
                  bind:value={programDuration}
                />
              </div>
              <div class="form-control">
                <label class="label label-text font-medium" for="maxStartups"
                  >Capacité</label
                >
                <input
                  id="maxStartups"
                  type="number"
                  class="input input-bordered w-full"
                  placeholder="20"
                  bind:value={maxStartups}
                />
              </div>
            </div>
            <div class="form-control">
              <span class="label-text font-medium mb-2 block"
                >Secteurs de focus</span
              >
              <div class="flex flex-wrap gap-2">
                {#each SECTORS as s}
                  <button
                    type="button"
                    class="badge badge-md cursor-pointer transition-colors
                      {focusSectors.includes(s)
                      ? 'badge-accent'
                      : 'badge-outline'}"
                    onclick={() => (focusSectors = toggleItem(focusSectors, s))}
                    >{s}</button
                  >
                {/each}
              </div>
            </div>
          {/if}

          <button type="submit" class="btn btn-primary mt-2" disabled={saving}>
            {#if saving}
              <span class="loading loading-spinner loading-sm"></span>
              Sauvegarde...
            {:else}
              Sauvegarder le profil
            {/if}
          </button>
        </form>
      </div>
    </div>
  {/if}
</div>

<!-- ══════════ Modal : Modifier nom & prénom ══════════ -->
{#if modalOpen}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <!-- Overlay -->
    <button
      type="button"
      class="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onclick={() => (modalOpen = false)}
      aria-label="Fermer"
    ></button>

    <!-- Panel -->
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-6 py-5 border-b border-base-100"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-xl flex items-center justify-center"
            style="background: var(--btc-gold-light);"
          >
            <Pencil class="w-4 h-4" style="color: var(--btc-gold-dark);" />
          </div>
          <h2 id="modal-title" class="font-semibold text-base">
            Modifier le nom
          </h2>
        </div>
        <button
          type="button"
          onclick={() => (modalOpen = false)}
          class="btn btn-ghost btn-sm btn-circle text-base-content/40"
          aria-label="Fermer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form onsubmit={handleSaveName}>
        <div class="px-6 py-5 flex flex-col gap-4">
          {#if nameError}
            <div class="alert alert-error py-2 text-sm">{nameError}</div>
          {/if}

          <div class="form-control">
            <label class="label label-text font-medium" for="edit-firstname">
              Prénom
            </label>
            <input
              id="edit-firstname"
              type="text"
              class="input input-bordered w-full"
              placeholder="Jean"
              bind:value={editFirstName}
              required
            />
          </div>

          <div class="form-control">
            <label class="label label-text font-medium" for="edit-lastname">
              Nom
            </label>
            <input
              id="edit-lastname"
              type="text"
              class="input input-bordered w-full"
              placeholder="Dupont"
              bind:value={editLastName}
              required
            />
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex items-center justify-end gap-2 px-6 py-4 border-t border-base-100 bg-base-50"
        >
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            onclick={() => (modalOpen = false)}
            disabled={savingName}
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn btn-primary btn-sm"
            disabled={savingName}
          >
            {#if savingName}
              <span class="loading loading-spinner loading-xs"></span>
              Enregistrement...
            {:else}
              Enregistrer
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
