<script lang="ts">
  let {
    size = 'md',
    text
  }: {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
  } = $props();

  const sizeClass = $derived({ sm: 'loading-sm', md: 'loading-md', lg: 'loading-lg' }[size]);
</script>

<div class="flex flex-col items-center justify-center gap-3">
  <span class="loading loading-spinner {sizeClass} text-primary"></span>
  {#if text}
    <p class="text-base-content/50 text-sm">{text}</p>
  {/if}
</div>
