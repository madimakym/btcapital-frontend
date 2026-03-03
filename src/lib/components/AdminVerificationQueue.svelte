<script lang="ts">
  type UserBadge = "KYC Pending" | "KYB Pending" | "Sanctions Alert";

  interface PendingProject {
    id: string;
    name: string;
    sector: string;
    seeking: string;
    submittedAgo: string;
    docStatus: string;
  }

  interface PendingUser {
    id: string;
    name: string;
    role: string;
    country: string;
    statusInfo: string;
    badge: UserBadge;
  }

  const projects: PendingProject[] = [
    {
      id: "1",
      name: "WindPower Tanzania",
      sector: "Energy",
      seeking: "$3.5M",
      submittedAgo: "2 days ago",
      docStatus: "All documents uploaded",
    },
    {
      id: "2",
      name: "Logistics Ghana",
      sector: "Transport",
      seeking: "$1.2M",
      submittedAgo: "5 days ago",
      docStatus: "Missing ESG report",
    },
    {
      id: "3",
      name: "MedTech South Africa",
      sector: "Healthcare",
      seeking: "$2M",
      submittedAgo: "1 week ago",
      docStatus: "All documents complete",
    },
  ];

  const users: PendingUser[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Investor",
      country: "United Kingdom",
      statusInfo: "Documents uploaded • PEP check: Clear",
      badge: "KYC Pending",
    },
    {
      id: "2",
      name: "Kwame Mensah",
      role: "Entrepreneur",
      country: "Ghana",
      statusInfo: "Business registration verified • Source of funds declared",
      badge: "KYB Pending",
    },
    {
      id: "3",
      name: "Marie Dubois",
      role: "Investor",
      country: "France",
      statusInfo: "Requires manual review • PEP flag detected",
      badge: "Sanctions Alert",
    },
  ];

  const userBadgeClass: Record<UserBadge, string> = {
    "KYC Pending": "bg-amber-100 text-amber-700",
    "KYB Pending": "bg-amber-100 text-amber-700",
    "Sanctions Alert": "bg-red-100 text-red-600",
  };
</script>

<div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
  <!-- Pending Project Approvals -->
  <div class="bg-white rounded-3xl px-8 py-8 shadow-xs shadow-black/20">
    <h2 class="text-2xl font-semibold mb-6">
      Projets en attente d'approbation
    </h2>
    <div class="space-y-4">
      {#each projects as project (project.id)}
        <div class="border-2 border-base-200 rounded-2xl px-5 py-4">
          <div class="flex items-start justify-between mb-1">
            <span class="font-bold text-base">{project.name}</span>
            <span
              class="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-700 shrink-0 ml-3"
            >
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
            <button
              class="flex-1 btn btn-sm bg-[#069668] hover:bg-[#246040] text-white border-none rounded-lg h-9"
            >
              Approve
            </button>
            <button
              class="flex-1 btn btn-sm bg-transparent border border-red-500 text-red-500 hover:bg-red-50 rounded-lg h-9"
            >
              Reject
            </button>
            <button
              class="btn btn-sm btn-ghost text-base-content/60 hover:text-base-content px-3 h-9"
            >
              Review
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- User Verification Queue -->
  <div class="bg-white rounded-3xl px-8 py-8 shadow-xs shadow-black/20">
    <h2 class="text-2xl font-semibold mb-6">En attente de vérification</h2>
    <div class="space-y-4">
      {#each users as user (user.id)}
        <div class="border border-base-200 rounded-2xl px-5 py-4">
          <div class="flex items-start justify-between mb-1">
            <span class="font-bold text-base">{user.name}</span>
            <span
              class="text-xs font-medium px-3 py-1 rounded-full shrink-0 ml-3 {userBadgeClass[
                user.badge
              ]}"
            >
              {user.badge}
            </span>
          </div>
          <p class="text-sm text-base-content/50 mb-1">
            {user.role} • {user.country}
          </p>
          <p class="text-sm text-base-content/40 mb-4">
            {user.statusInfo}
          </p>
          <div class="flex items-center gap-3">
            <button
              class="flex-1 btn btn-sm bg-[#069668] hover:bg-[#246040] text-white border-none rounded-lg h-9"
            >
              Verifier
            </button>
            <button
              class="flex-1 btn btn-sm bg-transparent border border-red-500 text-red-500 hover:bg-red-50 rounded-lg h-9"
            >
              Flag
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
