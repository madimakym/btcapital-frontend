<script lang="ts">
  import { onMount } from "svelte";
  import { currentUser } from "$lib/stores/auth";
  import { kycApi } from "$lib/api/kyc";
  import { profileApi } from "$lib/api/profile";
  import StatusBadge from "$lib/components/StatusBadge.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { ROLE_LABELS, type KycDocumentResponse } from "$lib/types";

  let kycDocs = $state<KycDocumentResponse[]>([]);
  let loadingKyc = $state(true);

  const user = $derived($currentUser);

  const greetingTime = $derived(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  });

  onMount(async () => {
    try {
      kycDocs = await kycApi.getMyDocuments();
    } catch {
      // ignore
    } finally {
      loadingKyc = false;
    }
  });

  const approvedKyc = $derived(
    kycDocs.filter((d) => d.status === "APPROVED").length,
  );
  const pendingKyc = $derived(
    kycDocs.filter((d) => d.status === "PENDING").length,
  );
  const kycComplete = $derived(approvedKyc >= 2);
</script>

<svelte:head>
  <title>Tableau de bord — BT Capital</title>
</svelte:head>

<div class="space-y-8">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <h1 class="text-4xl font-medium">Tableau de bord</h1>
    <ul class="flex items-center gap-2">
      <li>
        <a href="/dashboard/kyc" class="btn btn-ghost btn-sm">Documents KYC</a>
      </li>
      <li>
        <a href="/dashboard/profile" class="btn btn-ghost btn-sm">Mon profil</a>
      </li>
    </ul>
  </div>
  <div
    class="flex items-start justify-between bg-white rounded-3xl px-10 py-10 shadow-xs shadow-black/20"
  >
    <div>
      <h1 class="text-4xl font-medium">{greetingTime()}, {user?.firstName}</h1>
      <p class="text-base-content/50 mt-1 text-sm">
        Voici un résumé de votre activité sur BT Capital.
      </p>
    </div>
    <div class="flex items-center gap-2">
      {#if user}
        <StatusBadge status={user.status} />
        <span class="badge badge-outline badge-sm"
          >{ROLE_LABELS[user.role]}</span
        >
      {/if}
    </div>
  </div>

  <!-- Quick stats -->
  <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
    <div class="stat">
      <div class="stat-title text-xs">Utilisateurs</div>
      <div class="stat-value text-lg">104</div>
      <div class="stat-desc text-secondary">Total · Actifs</div>
    </div>

    <div class="stat">
      <div class="stat-title text-xs">KYC en attente</div>
      <div class="stat-value text-lg">14</div>
      <div class="stat-desc text-secondary">Nb de dossiers à traiter</div>
    </div>

    <div class="stat">
      <div class="stat-title text-xs">Inscriptions</div>
      <div class="stat-value text-lg">14</div>
      <div class="stat-desc text-primary">12 Inscrits cette semaine</div>
    </div>

    <div class="stat">
      <div class="stat-title text-xs">Projets en cours d’examen</div>
      <div class="stat-value text-lg">14</div>
      <div class="stat-desc text-red">En attente de validation</div>
    </div>
  </div>

  <!-- KYC Warning -->
  {#if !kycComplete && !loadingKyc}
    <div class="alert alert-warning shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div>
        <p class="font-medium">Vérification d'identité requise</p>
        <p class="text-sm">
          Soumettez vos documents KYC pour accéder à toutes les fonctionnalités.
        </p>
      </div>
      <a href="/kyc" class="btn btn-warning btn-sm">Soumettre →</a>
    </div>
  {/if}

  <!-- Quick links -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each [{ href: "/profile", title: "Mon profil", desc: "Complétez votre profil pour être visible", icon: "◉", color: "bg-primary/10 text-primary" }, { href: "/kyc", title: "Documents KYC", desc: "Gérez vos pièces justificatives", icon: "⊡", color: "bg-secondary/10 text-secondary" }, { href: "/", title: "Explorer", desc: "Découvrez la plateforme BT Capital", icon: "◎", color: "bg-accent/10 text-accent" }] as card}
      <a
        href={card.href}
        class="card bg-base-100 border border-base-200 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
      >
        <div class="card-body">
          <div
            class="w-10 h-10 rounded-xl {card.color} flex items-center justify-center text-xl mb-2"
          >
            {card.icon}
          </div>
          <h3 class="font-semibold">{card.title}</h3>
          <p class="text-sm text-base-content/50">{card.desc}</p>
        </div>
      </a>
    {/each}
  </div>

  <!-- KYC document list -->
  {#if kycDocs.length > 0}
    <div class="card bg-base-100 border border-base-200">
      <div class="card-body">
        <h2 class="card-title text-base">Mes documents KYC</h2>
        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Document</th>
                <th>Statut</th>
                <th>Soumis le</th>
              </tr>
            </thead>
            <tbody>
              {#each kycDocs as doc}
                <tr>
                  <td class="font-medium text-sm">{doc.fileName}</td>
                  <td><StatusBadge status={doc.status} /></td>
                  <td class="text-sm text-base-content/50">
                    {new Date(doc.uploadedAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}
</div>
