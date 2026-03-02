<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { currentUser, authStore } from "$lib/stores/auth";
  import { authApi } from "$lib/api/auth";

  interface NavItem {
    href: string;
    label: string;
    icon: string;
    exact?: boolean;
  }
  const user = $derived($currentUser);

  const appItems: NavItem[] = [
    { href: "/dashboard", label: "Tableau de bord", icon: "▦", exact: true },
    { href: "/profile", label: "Mon profil", icon: "◉" },
    { href: "/kyc", label: "Documents KYC", icon: "⊡" },
  ];

  const adminItems: NavItem[] = [
    { href: "/admin", label: "Dashboard Admin", icon: "◈", exact: true },
    { href: "/admin/users", label: "Utilisateurs", icon: "◎" },
    { href: "/admin/kyc", label: "Révision KYC", icon: "◇" },
  ];

  function isActive(item: NavItem): boolean {
    if (item.exact) return $page.url.pathname === item.href;
    return $page.url.pathname.startsWith(item.href);
  }

  let loggingOut = $state(false);

  async function handleLogout() {
    loggingOut = true;
    try {
      await authApi.logout();
      goto("/auth/login");
    } finally {
      loggingOut = false;
    }
  }
</script>

<aside
  class="w-64 min-h-screen bg-base-200 border-r border-base-300 flex flex-col shrink-0"
>
  <!-- Logo -->
  <div class="p-5 border-b border-base-300">
    <a href="/" class="text-2xl font-bold">
      <span class="text-primary">BT</span><span class="text-secondary"
        >Capital</span
      >
    </a>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 p-3 overflow-y-auto">
    <ul class="menu menu-md gap-0.5 w-full p-0">
      <li class="menu-title text-xs uppercase tracking-wider opacity-50 mb-1">
        Application
      </li>
      {#each appItems as item}
        <li>
          <a
            href={item.href}
            class={isActive(item) ? "active font-medium" : ""}
          >
            <span class="text-lg leading-none">{item.icon}</span>
            {item.label}
          </a>
        </li>
      {/each}

      {#if $currentUser?.role === "ADMIN"}
        <li
          class="menu-title text-xs uppercase tracking-wider opacity-50 mt-4 mb-1"
        >
          Administration
        </li>
        {#each adminItems as item}
          <li>
            <a
              href={item.href}
              class={isActive(item) ? "active font-medium" : ""}
            >
              <span class="text-lg leading-none">{item.icon}</span>
              {item.label}
            </a>
          </li>
        {/each}
      {/if}
    </ul>
  </nav>

  <!-- User footer -->
  {#if $currentUser}
    <div class="p-4 border-t border-base-300">
      <div class="flex items-center gap-3">
        <div class="avatar placeholder shrink-0">
          <div
            class="bg-primary text-primary-content rounded-full w-9 flex items-center justify-center"
          >
            <span class="text-xs font-semibold">
              {$currentUser.firstName[0]}{$currentUser.lastName[0]}
            </span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold truncate">
            {$currentUser.firstName}
            {$currentUser.lastName}
          </p>
          <p class="text-xs text-base-content/50 truncate">
            {$currentUser.email}
          </p>
        </div>
      </div>
      <button
        onclick={handleLogout}
        class="btn btn-ghost btn-xs text-error w-full mt-3 justify-start"
        disabled={loggingOut}
      >
        {loggingOut ? "Déconnexion..." : "↩ Se déconnecter"}
      </button>
    </div>
  {/if}
</aside>
