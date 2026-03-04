<script lang="ts">
  import { onMount } from "svelte";
  import { adminApi } from "$lib/api/admin";
  import Alert from "$lib/components/Alert.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { ROLE_LABELS, type PendingVerificationUser } from "$lib/types";
  import PageHeader from "$lib/components/PageHeader.svelte";

  const LIMIT = 10;

  let users = $state<PendingVerificationUser[]>([]);
  let meta = $state<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);
  let loading = $state(true);
  let error = $state("");
  let currentPage = $state(0);

  const description = $derived(
    meta
      ? `${meta.total} dossier${meta.total !== 1 ? "s" : ""} en attente de vérification`
      : "Dossiers en attente de vérification",
  );

  onMount(() => load(0));

  async function load(p: number) {
    loading = true;
    error = "";
    try {
      const res = await adminApi.getPendingVerificationUsers(p, LIMIT);
      users = res.data;
      meta = res.meta;
      currentPage = p;
    } catch {
      error = "Impossible de charger les dossiers en attente.";
    } finally {
      loading = false;
    }
  }

  function initials(u: PendingVerificationUser): string {
    const f = u.firstName?.[0] ?? "";
    const l = u.lastName?.[0] ?? "";
    return (f + l).toUpperCase() || u.email[0].toUpperCase();
  }

  function fullName(u: PendingVerificationUser): string {
    return [u.firstName, u.lastName].filter(Boolean).join(" ") || "—";
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function docSummary(u: PendingVerificationUser): string {
    const total = u.kycDocuments.length;
    if (total === 0) return "Aucun document";
    const pending = u.kycDocuments.filter((d) => d.status === "PENDING").length;
    const approved = u.kycDocuments.filter(
      (d) => d.status === "APPROVED",
    ).length;
    const rejected = u.kycDocuments.filter(
      (d) => d.status === "REJECTED",
    ).length;
    const parts: string[] = [];
    if (approved > 0)
      parts.push(`${approved} approuvé${approved > 1 ? "s" : ""}`);
    if (pending > 0) parts.push(`${pending} en attente`);
    if (rejected > 0)
      parts.push(`${rejected} rejeté${rejected > 1 ? "s" : ""}`);
    return parts.join(" · ") || `${total} doc${total > 1 ? "s" : ""}`;
  }
</script>

<svelte:head>
  <title>Révision KYC — Admin BT Capital</title>
</svelte:head>

<div class="space-y-6">
  <PageHeader title="Révision KYC" {description} />

  {#if error}
    <Alert type="error" message={error} onDismiss={() => (error = "")} />
  {/if}

  <!-- Content -->
  {#if loading}
    <div class="flex justify-center py-24">
      <LoadingSpinner text="Chargement des dossiers..." />
    </div>
  {:else if users.length === 0}
    <div
      class="bg-white rounded-3xl px-8 py-24 shadow-xs shadow-black/20 text-center"
    >
      <p class="text-5xl mb-4">✅</p>
      <p class="font-semibold text-lg">Aucun dossier en attente</p>
      <p class="text-sm text-base-content/40 mt-1">
        Tous les dossiers KYC ont été traités.
      </p>
    </div>
  {:else}
    <div class="bg-white rounded-3xl shadow-xs shadow-black/20 overflow-hidden">
      <!-- Table header -->
      <div class="divide-y divide-base-200">
        {#each users as user (user.id)}
          <div
            class="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-4 hover:bg-base-50 transition-colors"
          >
            <!-- Avatar -->
            <div
              class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
            >
              <span class="text-sm font-bold text-primary"
                >{initials(user)}</span
              >
            </div>

            <!-- Name + email -->
            <div class="min-w-0">
              <p class="font-semibold truncate">{fullName(user)}</p>
              <p class="text-sm text-base-content/50 truncate">{user.email}</p>
            </div>

            <!-- Role -->
            <div class="w-28 flex justify-center">
              <span class="badge badge-outline badge-sm"
                >{ROLE_LABELS[user.role]}</span
              >
            </div>

            <!-- KYC docs summary -->
            <div class="w-44">
              {#if user.kycDocuments.length === 0}
                <span class="text-xs text-base-content/30">Aucun document</span>
              {:else}
                <p class="text-[11px] text-base-content/40 mt-1">
                  {docSummary(user)}
                </p>
              {/if}
            </div>

            <!-- Date -->
            <div class="w-28">
              <p class="text-sm text-base-content/60">
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <a
                href="/admin/kyc/{user.id}"
                class="flex-1 btn btn-sm bg-[#069668] hover:bg-[#246040] text-white border-none rounded-lg h-9"
              >
                Vérifier
              </a>
              <button
                class="flex-1 btn btn-sm bg-transparent border border-red-500 text-red-500 hover:bg-red-50 rounded-lg h-9"
              >
                Signaler
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Pagination -->
    {#if meta && meta.totalPages > 1}
      <div class="flex items-center justify-between text-sm">
        <p class="text-base-content/50">
          Page {currentPage + 1} / {meta.totalPages} —
          {meta.total} dossier{meta.total !== 1 ? "s" : ""}
        </p>
        <div class="join">
          <button
            class="join-item btn btn-sm"
            disabled={!meta.hasPreviousPage}
            onclick={() => load(currentPage - 1)}
          >
            ←
          </button>
          {#each Array.from({ length: meta.totalPages }, (_, i) => i) as p}
            <button
              class="join-item btn btn-sm {p === currentPage
                ? 'btn-active'
                : ''}"
              onclick={() => load(p)}
            >
              {p + 1}
            </button>
          {/each}
          <button
            class="join-item btn btn-sm"
            disabled={!meta.hasNextPage}
            onclick={() => load(currentPage + 1)}
          >
            →
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>
