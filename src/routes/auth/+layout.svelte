<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title>BT Capital</title>
</svelte:head>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
  <div class="w-full max-w-[500px]">
    {@render children()}
    <p class="text-center text-xs text-base-content/40 mt-10">
      © 2026 BT Capital. Tous droits réservés.
    </p>
  </div>
</div>
