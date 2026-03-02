<script lang="ts">
  interface Props {
    title: string;
    description?: string;
  }

  let { title, description }: Props = $props();
</script>

<div>
  <h1 class="text-4xl font-medium">{title}</h1>
  {#if description}
    <p class="text-base-content/50 text-sm mt-1">{description}</p>
  {/if}
</div>
