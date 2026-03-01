<script lang="ts">
  import { onMount } from 'svelte';
  import { kycApi } from '$lib/api/kyc';
  import Alert from '$lib/components/Alert.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import { ApiException } from '$lib/api/client';
  import { KYC_DOC_LABELS, type KycDocType, type KycDocumentResponse } from '$lib/types';

  const docTypes: KycDocType[] = [
    'NATIONAL_ID',
    'PASSPORT',
    'DRIVING_LICENSE',
    'PROOF_OF_ADDRESS',
    'SELFIE'
  ];

  let documents = $state<KycDocumentResponse[]>([]);
  let loading = $state(true);
  let uploading = $state(false);
  let error = $state('');
  let success = $state('');

  let selectedDocType = $state<KycDocType>('NATIONAL_ID');
  let selectedFile = $state<File | null>(null);

  onMount(async () => {
    await loadDocuments();
  });

  async function loadDocuments() {
    try {
      documents = await kycApi.getMyDocuments();
    } catch {
      // ignore
    } finally {
      loading = false;
    }
  }

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    selectedFile = input.files?.[0] ?? null;
  }

  async function handleUpload(e: SubmitEvent) {
    e.preventDefault();
    if (!selectedFile) return;

    error = '';
    success = '';
    uploading = true;

    try {
      const doc = await kycApi.uploadDocument(selectedFile, selectedDocType);
      documents = [...documents, doc];
      success = 'Document soumis avec succès. Il sera examiné sous 24-48h.';
      selectedFile = null;
      // Reset file input
      const input = document.getElementById('file-input') as HTMLInputElement;
      if (input) input.value = '';
    } catch (err) {
      error = err instanceof ApiException ? err.message : 'Erreur lors de l\'upload.';
    } finally {
      uploading = false;
    }
  }

  const uploadedTypes = $derived(new Set(documents.map((d) => d.docType)));
</script>

<svelte:head>
  <title>Documents KYC — BT Capital</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
  <div>
    <h1 class="text-2xl font-bold">Vérification d'identité (KYC)</h1>
    <p class="text-base-content/50 text-sm mt-1">
      Soumettez vos documents pour vérifier votre identité et accéder à toutes les fonctionnalités.
    </p>
  </div>

  <!-- Info banner -->
  <div class="alert alert-info shadow-sm">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p class="text-sm">
      Formats acceptés : <strong>PDF, JPG, PNG</strong>. Taille maximale : <strong>10 Mo</strong>.
      Les documents sont traités sous <strong>24 à 48h</strong>.
    </p>
  </div>

  <!-- Upload form -->
  <div class="card bg-base-100 border border-base-200">
    <div class="card-body">
      <h2 class="card-title text-base">Soumettre un document</h2>

      {#if error}
        <Alert type="error" message={error} onDismiss={() => (error = '')} />
      {/if}
      {#if success}
        <Alert type="success" message={success} onDismiss={() => (success = '')} />
      {/if}

      <form onsubmit={handleUpload} class="flex flex-col gap-4 mt-2">
        <div class="form-control">
          <label class="label label-text font-medium" for="docType">Type de document</label>
          <select id="docType" class="select select-bordered w-full" bind:value={selectedDocType}>
            {#each docTypes as type}
              <option value={type}>
                {KYC_DOC_LABELS[type]}
                {uploadedTypes.has(type) ? '(déjà soumis)' : ''}
              </option>
            {/each}
          </select>
        </div>

        <div class="form-control">
          <label class="label label-text font-medium" for="file-input">Fichier</label>
          <input
            id="file-input"
            type="file"
            class="file-input file-input-bordered w-full"
            accept=".pdf,.jpg,.jpeg,.png"
            onchange={handleFileChange}
            required
          />
          {#if selectedFile}
            <p class="text-xs text-base-content/50 mt-1">
              {selectedFile.name} — {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
            </p>
          {/if}
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          disabled={uploading || !selectedFile}
        >
          {#if uploading}
            <span class="loading loading-spinner loading-sm"></span>
            Upload en cours...
          {:else}
            Soumettre le document
          {/if}
        </button>
      </form>
    </div>
  </div>

  <!-- Document list -->
  <div class="card bg-base-100 border border-base-200">
    <div class="card-body">
      <h2 class="card-title text-base">Mes documents</h2>

      {#if loading}
        <div class="flex justify-center py-4"><LoadingSpinner /></div>
      {:else if documents.length === 0}
        <div class="text-center py-8 text-base-content/40">
          <p class="text-4xl mb-3">📄</p>
          <p class="text-sm">Aucun document soumis pour l'instant.</p>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Type</th>
                <th>Fichier</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {#each documents as doc}
                <tr>
                  <td class="font-medium text-sm">{KYC_DOC_LABELS[doc.docType]}</td>
                  <td class="text-sm text-base-content/60 truncate max-w-[150px]">{doc.fileName}</td>
                  <td>
                    <StatusBadge status={doc.status} />
                    {#if doc.reviewComment}
                      <p class="text-xs text-base-content/40 mt-1">{doc.reviewComment}</p>
                    {/if}
                  </td>
                  <td class="text-sm text-base-content/50">
                    {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div>
