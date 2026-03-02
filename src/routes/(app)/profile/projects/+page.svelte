<svelte:head>
  <title>Mes projets — BT Capital</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-xl font-semibold">Mes projets</h2>
      <p class="text-sm text-base-content/50 mt-1">
        Vos projets soumis sur la plateforme BT Capital.
      </p>
    </div>
    <button class="btn btn-primary btn-sm gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Nouveau projet
    </button>
  </div>

  <div class="bg-white rounded-2xl border border-base-200 shadow-xs">
    <div class="flex flex-col items-center justify-center py-16 text-center px-6">
      <div class="w-14 h-14 rounded-2xl bg-base-100 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      </div>
      <p class="font-medium text-sm">Aucun projet pour le moment</p>
      <p class="text-xs text-base-content/50 mt-1 max-w-xs">
        Créez votre premier projet pour le soumettre aux investisseurs et incubateurs de la plateforme.
      </p>
      <button class="btn btn-primary btn-sm mt-4">Créer un projet</button>
    </div>
  </div>
</div>
