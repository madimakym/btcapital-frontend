<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin';
  import Alert from '$lib/components/Alert.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import { ApiException } from '$lib/api/client';
  import { KYC_DOC_LABELS, type KycDocumentResponse } from '$lib/types';

  let documents = $state<KycDocumentResponse[]>([]);
  let loading = $state(true);
  let error = $state('');
  let success = $state('');
  let actionLoading = $state<string | null>(null);

  // Review modal state
  let reviewingDoc = $state<KycDocumentResponse | null>(null);
  let reviewComment = $state('');

  onMount(() => loadPending());

  async function loadPending() {
    loading = true;
    try {
      documents = await adminApi.getPendingKyc();
    } catch {
      error = 'Impossible de charger les documents en attente.';
    } finally {
      loading = false;
    }
  }

  async function approve(doc: KycDocumentResponse) {
    actionLoading = doc.id;
    error = '';
    try {
      const updated = await adminApi.reviewKyc(doc.id, { decision: 'APPROVE', comment: '' });
      documents = documents.filter((d) => d.id !== updated.id);
      success = `Document approuvé pour l'utilisateur ${doc.userId.slice(0, 8)}...`;
    } catch (err) {
      error = err instanceof ApiException ? err.message : 'Erreur lors de l\'approbation.';
    } finally {
      actionLoading = null;
    }
  }

  function openRejectModal(doc: KycDocumentResponse) {
    reviewingDoc = doc;
    reviewComment = '';
  }

  async function submitReject() {
    if (!reviewingDoc) return;
    actionLoading = reviewingDoc.id;
    error = '';
    try {
      const updated = await adminApi.reviewKyc(reviewingDoc.id, {
        decision: 'REJECT',
        comment: reviewComment
      });
      documents = documents.filter((d) => d.id !== updated.id);
      success = 'Document rejeté.';
      reviewingDoc = null;
    } catch (err) {
      error = err instanceof ApiException ? err.message : 'Erreur lors du rejet.';
    } finally {
      actionLoading = null;
    }
  }
</script>

<svelte:head>
  <title>Révision KYC — Admin BT Capital</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">Révision des documents KYC</h1>
      <p class="text-base-content/50 text-sm mt-1">
        {documents.length} document{documents.length !== 1 ? 's' : ''} en attente de révision.
      </p>
    </div>
    <button onclick={loadPending} class="btn btn-ghost btn-sm" disabled={loading}>
      ↺ Actualiser
    </button>
  </div>

  {#if error}
    <Alert type="error" message={error} onDismiss={() => (error = '')} />
  {/if}
  {#if success}
    <Alert type="success" message={success} onDismiss={() => (success = '')} />
  {/if}

  {#if loading}
    <div class="flex justify-center py-16"><LoadingSpinner text="Chargement..." /></div>
  {:else if documents.length === 0}
    <div class="card bg-base-100 border border-base-200">
      <div class="card-body text-center py-16 text-base-content/40">
        <p class="text-5xl mb-4">✅</p>
        <p class="font-medium">Aucun document en attente de révision.</p>
        <p class="text-sm">Tous les documents ont été traités.</p>
      </div>
    </div>
  {:else}
    <div class="flex flex-col gap-4">
      {#each documents as doc}
        <div class="card bg-base-100 border border-base-200">
          <div class="card-body">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-semibold">{KYC_DOC_LABELS[doc.docType]}</h3>
                  <StatusBadge status={doc.status} />
                </div>
                <p class="text-sm text-base-content/50 mb-1">
                  Fichier : <span class="font-medium text-base-content/70">{doc.fileName}</span>
                </p>
                <p class="text-sm text-base-content/50 mb-1">
                  Utilisateur ID :
                  <span class="font-mono text-xs">{doc.userId}</span>
                </p>
                <p class="text-xs text-base-content/40">
                  Soumis le {new Date(doc.uploadedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>

              <div class="flex gap-2 shrink-0">
                <button
                  class="btn btn-success btn-sm"
                  onclick={() => approve(doc)}
                  disabled={actionLoading === doc.id}
                >
                  {#if actionLoading === doc.id}
                    <span class="loading loading-spinner loading-xs"></span>
                  {:else}
                    ✓ Approuver
                  {/if}
                </button>
                <button
                  class="btn btn-error btn-sm btn-outline"
                  onclick={() => openRejectModal(doc)}
                  disabled={actionLoading === doc.id}
                >
                  ✗ Rejeter
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Reject modal -->
{#if reviewingDoc}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-1">Rejeter le document</h3>
      <p class="text-sm text-base-content/50 mb-4">
        {KYC_DOC_LABELS[reviewingDoc.docType]} — {reviewingDoc.fileName}
      </p>

      <div class="form-control mb-4">
        <label class="label label-text font-medium" for="comment">Motif du rejet</label>
        <textarea
          id="comment"
          class="textarea textarea-bordered w-full"
          rows="3"
          placeholder="Expliquez pourquoi le document est rejeté..."
          bind:value={reviewComment}
        ></textarea>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" onclick={() => (reviewingDoc = null)}>Annuler</button>
        <button
          class="btn btn-error"
          onclick={submitReject}
          disabled={!reviewComment.trim() || !!actionLoading}
        >
          {#if actionLoading}
            <span class="loading loading-spinner loading-sm"></span>
          {:else}
            Confirmer le rejet
          {/if}
        </button>
      </div>
    </div>
    <button type="button" class="modal-backdrop" onclick={() => (reviewingDoc = null)} aria-label="Fermer"></button>
  </div>
{/if}
