<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/auth";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

  let { children } = $props();
  let checking = $state(true);

  onMount(() => {
    // authStore.init() is called in root layout — subscribe to wait for initialization
    const unsubscribe = authStore.subscribe((state) => {
      if (state.initialized) {
        checking = false;
        if (!state.refreshToken) {
          goto(
            `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`,
          );
        }
      }
    });

    return unsubscribe;
  });
</script>

{#if checking}
  <div class="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Chargement..." />
  </div>
{:else}
  <div class="flex min-h-screen">
    <!-- <Sidebar /> -->
    <div class="flex-1 flex flex-col min-w-0">
      <main class="flex-1 p-10 bg-base-200 overflow-auto">
        <div class="mx-auto max-w-[1300px]">
          {@render children()}
        </div>
      </main>
    </div>
  </div>
{/if}
