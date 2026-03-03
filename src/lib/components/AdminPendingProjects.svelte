<script lang="ts">
  interface PendingProject {
    id: string;
    name: string;
    sector: string;
    seeking: string;
    submittedAgo: string;
    docStatus: string;
  }

  const projects: PendingProject[] = [
    {
      id: '1',
      name: 'WindPower Tanzania',
      sector: 'Energy',
      seeking: '$3.5M',
      submittedAgo: '2 days ago',
      docStatus: 'All documents uploaded',
    },
    {
      id: '2',
      name: 'Logistics Ghana',
      sector: 'Transport',
      seeking: '$1.2M',
      submittedAgo: '5 days ago',
      docStatus: 'Missing ESG report',
    },
    {
      id: '3',
      name: 'MedTech South Africa',
      sector: 'Healthcare',
      seeking: '$2M',
      submittedAgo: '1 week ago',
      docStatus: 'All documents complete',
    },
  ];
</script>

<div class="bg-white rounded-3xl px-8 py-8 shadow-xs shadow-black/20">
  <h2 class="text-2xl font-semibold mb-6">Projets en attente d'approbation</h2>
  <div class="space-y-4">
    {#each projects as project (project.id)}
      <div class="border-2 border-base-200 rounded-2xl px-5 py-4">
        <div class="flex items-start justify-between mb-1">
          <span class="font-bold text-base">{project.name}</span>
          <span class="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-700 shrink-0 ml-3">
            Pending Review
          </span>
        </div>
        <p class="text-sm text-base-content/50 mb-1">
          {project.sector} • Seeking {project.seeking}
        </p>
        <p class="text-sm text-base-content/40 mb-4">
          Submitted {project.submittedAgo} • {project.docStatus}
        </p>
        <div class="flex items-center gap-3">
          <button class="flex-1 btn btn-sm bg-[#069668] hover:bg-[#246040] text-white border-none rounded-lg h-9">
            Approve
          </button>
          <button class="flex-1 btn btn-sm bg-transparent border border-red-500 text-red-500 hover:bg-red-50 rounded-lg h-9">
            Reject
          </button>
          <button class="btn btn-sm btn-ghost text-base-content/60 hover:text-base-content px-3 h-9">
            Review
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>
