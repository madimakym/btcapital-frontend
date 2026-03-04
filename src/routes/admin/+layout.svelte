<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/auth";
  import Navbar from "$lib/components/Navbar.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

  let { children } = $props();
  let checking = $state(true);
  let forbidden = $state(false);

  onMount(() => {
    const unsubscribe = authStore.subscribe((state) => {
      if (state.initialized) {
        checking = false;
        if (!state.refreshToken) {
          goto("/auth/login");
          return;
        }
        if (state.user?.role !== "ADMIN") {
          forbidden = true;
        }
      }
    });
    return unsubscribe;
  });

  const currentPath = $derived($page.url.pathname);

  type NavItem = { href: string; label: string; icon: string; exact?: boolean };
  type NavGroup = { title: string; items: NavItem[] };

  const navGroups: NavGroup[] = [
    {
      title: "Vue d'ensemble",
      items: [
        {
          href: "/admin",
          label: "Dashboard",
          exact: true,
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />`,
        },
      ],
    },
    {
      title: "Utilisateurs",
      items: [
        {
          href: "/admin/users",
          label: "Tous les utilisateurs",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />`,
        },
        {
          href: "/admin/kyc",
          label: "Révision KYC",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />`,
        },
      ],
    },
    {
      title: "Plateforme",
      items: [
        {
          href: "/admin/projects",
          label: "Projets",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />`,
        },
        {
          href: "/admin/transactions",
          label: "Transactions",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />`,
        },
      ],
    },
    {
      title: "Système",
      items: [
        {
          href: "/admin/settings",
          label: "Paramètres",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />`,
        },
      ],
    },
  ];

  const sectionLabels: Record<string, string> = {
    "/admin": "Dashboard Admin",
    "/admin/users": "Tous les utilisateurs",
    "/admin/kyc": "Révision KYC",
    "/admin/projects": "Projets",
    "/admin/transactions": "Transactions",
    "/admin/settings": "Paramètres",
  };

  const currentLabel = $derived(
    Object.entries(sectionLabels)
      .filter(
        ([path]) => currentPath === path || currentPath.startsWith(path + "/"),
      )
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? "Administration",
  );

  function isActive(item: NavItem): boolean {
    if (item.exact) return currentPath === item.href;
    return currentPath === item.href || currentPath.startsWith(item.href + "/");
  }
</script>

{#if checking}
  <div class="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Vérification des permissions..." />
  </div>
{:else if forbidden}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center space-y-4">
      <p class="text-6xl">🚫</p>
      <h1 class="text-2xl font-bold text-error">Accès refusé</h1>
      <p class="text-base-content/50">
        Vous n'avez pas les droits d'accès à cette section.
      </p>
      <a href="/dashboard" class="btn btn-primary">Retour au tableau de bord</a>
    </div>
  </div>
{:else}
  <div class="flex flex-col min-h-screen">
    <main class="flex-1 p-10 bg-base-100 overflow-auto">
      <div class="mx-auto max-w-[1350px]">
        <Navbar />
        <div class="pt-10 space-y-6">
          <!-- Breadcrumb -->
          <nav aria-label="breadcrumb">
            <ol class="flex items-center gap-1.5 text-sm">
              <li>
                <a
                  href="/dashboard"
                  class="text-base-content/50 hover:text-base-content transition-colors flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                  Tableau de bord
                </a>
              </li>
              {#if currentPath !== "/admin"}
                <li class="text-base-content/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </li>
                <li class="font-medium text-base-content">{currentLabel}</li>
              {/if}
            </ol>
          </nav>

          <!-- Sidebar + Content -->
          <div class="flex gap-8 items-start">
            <!-- Sidebar admin -->
            <aside class="w-56 flex-shrink-0 sticky top-24">
              <nav>
                {#each navGroups as group, gi}
                  {#if gi > 0}
                    <div class="border-t border-base-100"></div>
                  {/if}
                  <div class="pt-3 pb-1">
                    <p
                      class="text-[12px] font-semibold uppercase tracking-widest text-base-content/40 px-2 mb-1"
                    >
                      {group.title}
                    </p>
                    {#each group.items as item}
                      {@const active = isActive(item)}
                      <a
                        href={item.href}
                        class="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[15px] transition-colors mb-0.5
                          {active
                          ? 'bg-base-100 font-semibold text-base-content'
                          : 'text-base-content/60 hover:bg-base-100 hover:text-base-content'}"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-4 h-4 flex-shrink-0 {active
                            ? 'text-primary'
                            : 'text-base-content/40'}"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="1.8"
                        >
                          {@html item.icon}
                        </svg>
                        {item.label}
                      </a>
                    {/each}
                  </div>
                {/each}
              </nav>
            </aside>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              {@render children()}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
{/if}
