<svelte:head>
  <title>Notifications — BT Capital</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-semibold">Notifications</h2>
    <p class="text-sm text-base-content/50 mt-1">
      Gérez vos préférences de notifications.
    </p>
  </div>

  <div class="bg-white rounded-2xl border border-base-200 shadow-xs divide-y divide-base-100">
    {#each [
      { label: "Nouvelles mises en relation", desc: "Quand un investisseur ou entrepreneur vous contacte", enabled: true },
      { label: "Mises à jour KYC", desc: "Statut de vos documents de vérification", enabled: true },
      { label: "Actualités de la plateforme", desc: "Nouveautés et annonces BT Capital", enabled: false },
      { label: "Rappels de complétion", desc: "Relances pour compléter votre profil", enabled: true },
    ] as notif}
      <div class="flex items-center justify-between px-6 py-4">
        <div>
          <p class="text-sm font-medium">{notif.label}</p>
          <p class="text-xs text-base-content/50 mt-0.5">{notif.desc}</p>
        </div>
        <input
          type="checkbox"
          class="toggle toggle-primary toggle-sm"
          checked={notif.enabled}
        />
      </div>
    {/each}
  </div>

  <button class="btn btn-primary btn-sm">Enregistrer les préférences</button>
</div>
