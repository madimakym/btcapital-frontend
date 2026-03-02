<script lang="ts">
  import { goto } from "$app/navigation";
  import { currentUser } from "$lib/stores/auth";
  import { authApi } from "$lib/api/auth";
  import { ROLE_LABELS } from "$lib/types";

  let loggingOut = $state(false);

  const user = $derived($currentUser);
  const initials = $derived(
    user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "??",
  );

  async function handleLogout() {
    loggingOut = true;
    try {
      await authApi.logout();
      goto("/auth/login");
    } finally {
      loggingOut = false;
    }
  }

  function closeDropdown() {
    (document.activeElement as HTMLElement)?.blur();
  }
</script>

<header class="h-16 top-0 flex justify-between mb-4">
  <!-- Logo -->
  <h1>
    <a href="/dashboard" class="flex items-center gap-1.5 select-none">
      <span class="font-semibold text-[30px]"> BTCapital </span>
    </a>
  </h1>

  <!-- Right actions -->
  <div class="flex items-center gap-2">
    <!-- KYC quick link -->
    <a
      href="/dashboard/kyc"
      class="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-base-content"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
        />
      </svg>
      Documents KYC
    </a>

    <!-- Avatar dropdown -->
    {#if user}
      <div class="dropdown dropdown-end">
        <!-- Avatar trigger -->
        <div
          tabindex="0"
          role="button"
          class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-primary transition-all select-none"
          style="background: linear-gradient(135deg, var(--btc-gold) 0%, var(--btc-gold-dark) 100%);"
        >
          {initials}
        </div>

        <!-- Dropdown panel -->
        <div
          tabindex="0"
          class="dropdown-content mt-3 w-64 bg-white rounded-2xl shadow-xl border border-base-200 overflow-hidden z-50"
        >
          <!-- User card header -->
          <div
            class="px-4 py-4 border-b border-base-100"
            style="background: linear-gradient(135deg, var(--btc-canvas) 0%, #fff 100%);"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-base"
                style="background: linear-gradient(135deg, var(--btc-gold) 0%, var(--btc-gold-dark) 100%);"
              >
                {initials}
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-sm leading-tight truncate">
                  {user.firstName}
                  {user.lastName}
                </p>
                <p class="text-xs text-base-content/50 truncate mt-0.5">
                  {user.email}
                </p>
                <span
                  class="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1"
                  style="background: var(--btc-gold-light); color: var(--btc-gold-dark);"
                >
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
            </div>
          </div>

          <!-- Menu items -->
          <ul class="py-1.5">
            <!-- Mes informations -->
            <li>
              <a
                href="/profile/account"
                onclick={closeDropdown}
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/80 hover:bg-base-100 hover:text-base-content transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-base-content/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                Mes informations
              </a>
            </li>

            <!-- Documents KYC -->
            <li>
              <a
                href="/dashboard/kyc"
                onclick={closeDropdown}
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/80 hover:bg-base-100 hover:text-base-content transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-base-content/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                Documents KYC
              </a>
            </li>

            <!-- Paramètres -->
            <li>
              <a
                href="/settings"
                onclick={closeDropdown}
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/80 hover:bg-base-100 hover:text-base-content transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-base-content/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Paramètres
              </a>
            </li>

            <!-- Admin (conditionnel) -->
            {#if user.role === "ADMIN"}
              <li>
                <a
                  href="/admin"
                  onclick={closeDropdown}
                  class="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/80 hover:bg-base-100 hover:text-base-content transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 text-base-content/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"
                    />
                  </svg>
                  Administration
                </a>
              </li>
            {/if}

            <!-- Séparateur + Déconnexion -->
            <li class="border-t border-base-100 mt-1 pt-1">
              <button
                onclick={handleLogout}
                disabled={loggingOut}
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                {loggingOut ? "Déconnexion…" : "Se déconnecter"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    {/if}
  </div>
</header>
