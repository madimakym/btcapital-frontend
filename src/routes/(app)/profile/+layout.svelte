<script lang="ts">
  import { page } from "$app/stores";
  import { currentUser } from "$lib/stores/auth";
  import { ROLE_LABELS } from "$lib/types";

  let { children } = $props();

  const user = $derived($currentUser);
  const initials = $derived(
    user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "??",
  );

  const currentPath = $derived($page.url.pathname);

  const sectionLabels: Record<string, string> = {
    "/profile/account": "Mes informations",
    "/profile/security": "Sécurité",
    "/profile/notifications": "Notifications",
    "/profile/projects": "Mes projets",
    "/profile/eoi": "Mes EOI",
  };

  const currentLabel = $derived(sectionLabels[currentPath] ?? "Profil");

  type NavItem = {
    href: string;
    label: string;
    icon: string;
  };

  type NavGroup = {
    title: string;
    items: NavItem[];
  };

  const navGroups: NavGroup[] = [
    {
      title: "Mon espace",
      items: [
        {
          href: "/profile/account",
          label: "Mes informations",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />`,
        },
        {
          href: "/profile/security",
          label: "Sécurité",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />`,
        },
        {
          href: "/profile/notifications",
          label: "Notifications",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />`,
        },
      ],
    },
    {
      title: "Activité",
      items: [
        {
          href: "/profile/projects",
          label: "Mes projets",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />`,
        },
        {
          href: "/profile/eoi",
          label: "Mes EOI",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />`,
        },
        {
          href: "/profile/kyc",
          label: "Documents KYC",
          icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />`,
        },
      ],
    },
  ];
</script>

<svelte:head>
  <title>Mon profil — BT Capital</title>
</svelte:head>

<div class="space-y-6">
  <!-- ═══ Breadcrumb ═══ -->
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
    </ol>
  </nav>

  <div class="flex gap-8 items-start">
    <!-- ═══ Sidebar ═══ -->
    <aside class="w-56 flex-shrink-0 sticky top-24">
      <!-- Avatar card -->
      <!-- <div
        class="flex flex-col items-center gap-3 px-4 py-5 bg-white rounded-2xl border border-base-200 shadow-xs mb-4"
      >
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
          style="background: linear-gradient(135deg, var(--btc-gold) 0%, var(--btc-gold-dark) 100%);"
        >
          {initials}
        </div>
        {#if user}
          <div class="text-center">
            <p class="font-semibold text-sm">
              {user.firstName}
              {user.lastName}
            </p>
            <p
              class="text-xs text-base-content/50 mt-0.5 truncate max-w-[9rem]"
            >
              {user.email}
            </p>
            <span
              class="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5"
              style="background: var(--btc-gold-light); color: var(--btc-gold-dark);"
            >
              {ROLE_LABELS[user.role]}
            </span>
          </div>
        {/if}
      </div> -->

      <!-- Navigation groups -->
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
              {@const active =
                currentPath === item.href ||
                currentPath.startsWith(item.href + "/")}
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
          {#if gi === navGroups.length - 1}
            <div class="pb-2"></div>
          {/if}
        {/each}
      </nav>
    </aside>

    <!-- ═══ Content ═══ -->
    <div class="flex-1 min-w-0">
      {@render children()}
    </div>
  </div>
</div>
