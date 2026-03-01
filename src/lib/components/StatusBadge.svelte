<script lang="ts">
  import type { UserStatus, KycStatus } from '$lib/types';
  import { STATUS_LABELS, KYC_STATUS_LABELS } from '$lib/types';

  type Status = UserStatus | KycStatus;

  let { status }: { status: Status } = $props();

  const _badgeMap: Record<string, string> = {
    ACTIVE: 'badge-success',
    PENDING_VERIFICATION: 'badge-warning',
    SUSPENDED: 'badge-error',
    DELETED: 'badge-ghost',
    PENDING: 'badge-warning',
    APPROVED: 'badge-success',
    REJECTED: 'badge-error'
  };

  const badgeClass = $derived(_badgeMap[status] ?? 'badge-ghost');

  const label = $derived(
    (STATUS_LABELS as Record<string, string>)[status] ??
    (KYC_STATUS_LABELS as Record<string, string>)[status] ??
    status
  );
</script>

<span class="badge badge-sm {badgeClass} font-medium">{label}</span>
