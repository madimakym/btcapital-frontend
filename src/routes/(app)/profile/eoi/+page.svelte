<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
</script>

<svelte:head>
  <title>Mes EOI — BT Capital</title>
</svelte:head>

<div class="space-y-6">
  <PageHeader
    title="Mes EOI"
    description="Expressions d'intérêt envoyées et reçues."
  />
  <!-- Tabs -->
  <div class="tabs tabs-bordered">
    <button class="tab tab-active">Envoyées</button>
    <button class="tab">Reçues</button>
  </div>

  <div class="bg-white rounded-2xl border border-base-200 shadow-xs">
    <div
      class="flex flex-col items-center justify-center py-16 text-center px-6"
    >
      <div
        class="w-14 h-14 rounded-2xl bg-base-100 flex items-center justify-center mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-7 h-7 text-base-content/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
      <p class="font-medium text-sm">Aucune EOI envoyée</p>
      <p class="text-xs text-base-content/50 mt-1 max-w-xs">
        Parcourez les projets disponibles et manifestez votre intérêt pour
        recevoir plus d'informations.
      </p>
      <a href="/dashboard" class="btn btn-primary btn-sm mt-4"
        >Explorer les projets</a
      >
    </div>
  </div>
</div>
