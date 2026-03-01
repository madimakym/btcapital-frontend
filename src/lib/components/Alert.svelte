<script lang="ts">
  type AlertType = 'info' | 'success' | 'warning' | 'error';

  let {
    type = 'info',
    message,
    onDismiss
  }: {
    type?: AlertType;
    message: string;
    onDismiss?: () => void;
  } = $props();

  const alertClass: Record<AlertType, string> = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error'
  };
</script>

<div class="alert {alertClass[type]} shadow-sm">
  <span class="text-sm">{message}</span>
  {#if onDismiss}
    <button class="btn btn-ghost btn-xs ml-auto" onclick={onDismiss}>✕</button>
  {/if}
</div>
