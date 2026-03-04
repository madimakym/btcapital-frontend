<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { adminApi } from "$lib/api/admin";
  import { ApiException } from "$lib/api/client";
  import StatusBadge from "$lib/components/StatusBadge.svelte";
  import Alert from "$lib/components/Alert.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import {
    ROLE_LABELS,
    KYC_DOC_LABELS,
    type UserDetailResponse,
    type KycDocumentResponse,
  } from "$lib/types";
  import PageHeader from "$lib/components/PageHeader.svelte";

  const userId = $page.params.userId;

  let user = $state<UserDetailResponse | null>(null);
  let loading = $state(true);
  let error = $state("");
  let success = $state("");
  let actionLoading = $state<string | null>(null);

  // Preview modal
  let previewUrl = $state<string | null>(null);
  let previewMime = $state("");
  let previewLoading = $state<string | null>(null);

  // Rejection modal
  let rejectingDoc = $state<KycDocumentResponse | null>(null);
  let rejectComment = $state("");

  onMount(async () => {
    try {
      user = await adminApi.getUserDetail(userId);
    } catch {
      error = "Impossible de charger les informations de cet utilisateur.";
    } finally {
      loading = false;
    }
  });

  function initials(u: UserDetailResponse): string {
    const f = u.firstName?.[0] ?? "";
    const l = u.lastName?.[0] ?? "";
    return (f + l).toUpperCase() || u.email[0].toUpperCase();
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function docIcon(doc: KycDocumentResponse): string {
    if (doc.mimeType === "application/pdf") return "📄";
    if (doc.mimeType.startsWith("image/")) return "🖼️";
    return "📎";
  }

  async function openPreview(doc: KycDocumentResponse) {
    previewLoading = doc.id;
    try {
      const result = await adminApi.getKycFileBlob(doc.id);
      previewUrl = result.url;
      previewMime = result.mimeType;
    } catch {
      error = "Impossible de charger le fichier.";
    } finally {
      previewLoading = null;
    }
  }

  function closePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    previewMime = "";
  }

  async function approve(doc: KycDocumentResponse) {
    actionLoading = doc.id;
    error = "";
    try {
      const updated = await adminApi.reviewKyc(doc.id, {
        decision: "APPROVE",
        comment: "",
      });
      if (user) {
        user = {
          ...user,
          kycDocuments: user.kycDocuments.map((d) =>
            d.id === updated.id ? updated : d,
          ),
        };
      }
      success = `${KYC_DOC_LABELS[doc.documentType]} approuvé.`;
    } catch (err) {
      error =
        err instanceof ApiException
          ? err.message
          : "Erreur lors de l'approbation.";
    } finally {
      actionLoading = null;
    }
  }

  function openRejectModal(doc: KycDocumentResponse) {
    rejectingDoc = doc;
    rejectComment = "";
  }

  async function submitReject() {
    if (!rejectingDoc) return;
    actionLoading = rejectingDoc.id;
    error = "";
    try {
      const updated = await adminApi.reviewKyc(rejectingDoc.id, {
        decision: "REJECT",
        comment: rejectComment,
      });
      if (user) {
        user = {
          ...user,
          kycDocuments: user.kycDocuments.map((d) =>
            d.id === updated.id ? updated : d,
          ),
        };
      }
      success = `${KYC_DOC_LABELS[rejectingDoc.documentType]} rejeté.`;
      rejectingDoc = null;
    } catch (err) {
      error =
        err instanceof ApiException ? err.message : "Erreur lors du rejet.";
    } finally {
      actionLoading = null;
    }
  }
</script>

<svelte:head>
  <title
    >Vérification KYC — {user?.firstName ?? "…"}
    {user?.lastName ?? ""} — Admin BT Capital</title
  >
</svelte:head>

{#if loading}
  <div class="flex justify-center py-24">
    <LoadingSpinner text="Chargement du dossier..." />
  </div>
{:else if error && !user}
  <Alert type="error" message={error} />
{:else if user}
  <div class="space-y-6">
    <PageHeader title="Informations utilisateur" description="" />
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

    <div class="card px-8 py-8">
      <div class="flex items-start gap-6">
        <div
          class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0"
        >
          <span class="text-2xl font-bold text-primary">{initials(user)}</span>
        </div>

        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p
              class="text-xs text-base-content/40 uppercase tracking-wide mb-1"
            >
              Nom complet
            </p>
            <p class="font-semibold">
              {[user.firstName, user.lastName].filter(Boolean).join(" ") || "—"}
            </p>
          </div>
          <div>
            <p
              class="text-xs text-base-content/40 uppercase tracking-wide mb-1"
            >
              Email
            </p>
            <p class="font-medium text-sm">{user.email}</p>
          </div>
          <div>
            <p
              class="text-xs text-base-content/40 uppercase tracking-wide mb-1"
            >
              Rôle
            </p>
            <span class="badge badge-outline badge-sm"
              >{ROLE_LABELS[user.role]}</span
            >
          </div>
          <div>
            <p
              class="text-xs text-base-content/40 uppercase tracking-wide mb-1"
            >
              Statut
            </p>
            <StatusBadge status={user.status} />
          </div>
          <div>
            <p
              class="text-xs text-base-content/40 uppercase tracking-wide mb-1"
            >
              Email
            </p>
            <span class="text-sm"
              >{user.emailVerified ? "vérifié" : "❌ Non vérifié"}</span
            >
          </div>
          <div>
            <p
              class="text-xs text-base-content/40 uppercase tracking-wide mb-1"
            >
              Inscrit le
            </p>
            <p class="text-sm">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Documents KYC ───────────────────────────────────────────────── -->
    <div class="card bg-white rounded-3xl px-8 py-8 shadow-xs shadow-black/20">
      <h2 class="text-xl font-semibold mb-6">Documents de vérification</h2>

      {#if user.kycDocuments.length === 0}
        <p class="text-center text-base-content/40 py-10">
          Aucun document soumis.
        </p>
      {:else}
        <div class="space-y-4">
          {#each user.kycDocuments as doc (doc.id)}
            <div class="border border-base-200 rounded-2xl px-6 py-5">
              <div class="flex items-start justify-between gap-4 flex-wrap">
                <!-- Infos document -->
                <div class="flex items-start gap-3 flex-1 min-w-0">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <span class="font-semibold"
                        >{KYC_DOC_LABELS[doc.documentType]}</span
                      >
                      <StatusBadge status={doc.status} />
                    </div>
                    <p class="text-sm text-base-content/50 truncate">
                      {doc.fileName}
                    </p>
                    <p class="text-xs text-base-content/40 mt-0.5">
                      {formatSize(doc.fileSizeBytes)} · Soumis le {formatDateTime(
                        doc.submittedAt,
                      )}
                    </p>
                    {#if doc.reviewComment}
                      <p class="text-xs text-error mt-1 italic">
                        Motif : {doc.reviewComment}
                      </p>
                    {/if}
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 shrink-0 flex-wrap">
                  <!-- Prévisualiser -->
                  <button
                    class="btn btn-sm btn-outline btn-neutral gap-1"
                    onclick={() => openPreview(doc)}
                    disabled={previewLoading === doc.id}
                  >
                    {#if previewLoading === doc.id}
                      <span class="loading loading-spinner loading-xs"></span>
                    {:else}
                      Voir
                    {/if}
                  </button>

                  <!-- Approuver -->
                  {#if doc.status !== "APPROVED"}
                    <button
                      class="btn btn-sm btn-success gap-1"
                      onclick={() => approve(doc)}
                      disabled={actionLoading === doc.id}
                    >
                      {#if actionLoading === doc.id}
                        <span class="loading loading-spinner loading-xs"></span>
                      {:else}
                        ✓ Approuver
                      {/if}
                    </button>
                  {/if}

                  <!-- Rejeter -->
                  {#if doc.status !== "REJECTED"}
                    <button
                      class="btn btn-sm btn-error btn-outline gap-1"
                      onclick={() => openRejectModal(doc)}
                      disabled={actionLoading === doc.id}
                    >
                      ✗ Rejeter
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- ── Modal prévisualisation ────────────────────────────────────────────── -->
{#if previewUrl}
  <div class="modal modal-open">
    <div
      class="modal-box max-w-4xl w-full max-h-[90vh] flex flex-col p-0 overflow-hidden"
    >
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-base-200"
      >
        <h3 class="font-bold text-lg">Prévisualisation du document</h3>
        <button class="btn btn-ghost btn-sm btn-circle" onclick={closePreview}
          >✕</button
        >
      </div>
      <div
        class="flex-1 overflow-auto bg-base-200 flex items-center justify-center p-4"
      >
        {#if previewMime.startsWith("image/")}
          <img
            src={previewUrl}
            alt="Document KYC"
            class="max-w-full max-h-[70vh] rounded-lg shadow"
          />
        {:else if previewMime === "application/pdf"}
          <iframe
            src={previewUrl}
            title="Document PDF"
            class="w-full h-[70vh] rounded-lg"
          />
        {:else}
          <p class="text-base-content/50">
            Prévisualisation non disponible pour ce format.
          </p>
        {/if}
      </div>
      <div class="px-6 py-4 border-t border-base-200 flex justify-end gap-2">
        <a href={previewUrl} download class="btn btn-sm btn-neutral"
          >⬇ Télécharger</a
        >
        <button class="btn btn-sm btn-ghost" onclick={closePreview}
          >Fermer</button
        >
      </div>
    </div>
    <button
      type="button"
      class="modal-backdrop"
      onclick={closePreview}
      aria-label="Fermer"
    ></button>
  </div>
{/if}

<!-- ── Modal rejet ──────────────────────────────────────────────────────── -->
{#if rejectingDoc}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-1">Rejeter le document</h3>
      <p class="text-sm text-base-content/50 mb-4">
        {KYC_DOC_LABELS[rejectingDoc.documentType]} — {rejectingDoc.fileName}
      </p>
      <div class="form-control mb-4">
        <label class="label label-text font-medium" for="rejectComment"
          >Motif du rejet</label
        >
        <textarea
          id="rejectComment"
          class="textarea textarea-bordered w-full"
          rows="3"
          placeholder="Expliquez pourquoi le document est rejeté..."
          bind:value={rejectComment}
        ></textarea>
      </div>
      <div class="modal-action">
        <button class="btn btn-ghost" onclick={() => (rejectingDoc = null)}
          >Annuler</button
        >
        <button
          class="btn btn-error"
          onclick={submitReject}
          disabled={!rejectComment.trim() || !!actionLoading}
        >
          {#if actionLoading}
            <span class="loading loading-spinner loading-sm"></span>
          {:else}
            Confirmer le rejet
          {/if}
        </button>
      </div>
    </div>
    <button
      type="button"
      class="modal-backdrop"
      onclick={() => (rejectingDoc = null)}
      aria-label="Fermer"
    ></button>
  </div>
{/if}
