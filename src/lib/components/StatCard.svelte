<script lang="ts">
  interface Props {
    title: string;
    value: string | number;
    desc?: string;
    descColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'muted';
    icon?: string;
  }

  const { title, value, desc, descColor = 'muted', icon }: Props = $props();

  const descClass: Record<string, string> = {
    primary:   'text-primary',
    secondary: 'text-secondary',
    accent:    'text-accent',
    success:   'text-success',
    warning:   'text-warning',
    error:     'text-error',
    muted:     'text-base-content/50',
  };
</script>

<div class="stat">
  <div class="stat-title text-xs font-medium tracking-wide uppercase">{title}</div>
  <div class="stat-value text-lg">{value}</div>
  {#if desc}
    <div class="stat-desc {descClass[descColor]}">{desc}</div>
  {/if}
</div>
