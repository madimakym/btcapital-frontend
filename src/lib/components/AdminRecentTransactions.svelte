<script lang="ts">
  type TxStatus = 'Completed' | 'Processing';

  interface Transaction {
    id: string;
    date: string;
    investor: string;
    project: string;
    amount: string;
    commission: string;
    status: TxStatus;
  }

  const transactions: Transaction[] = [
    { id: '1', date: 'Feb 4, 2026', investor: 'Alexandra M.', project: 'Solaris Tech',              amount: '$500,000', commission: '$25,000', status: 'Completed'  },
    { id: '2', date: 'Feb 3, 2026', investor: 'John K.',       project: 'AgriTech Corp',             amount: '$250,000', commission: '$12,500', status: 'Completed'  },
    { id: '3', date: 'Feb 2, 2026', investor: 'Sarah J.',      project: 'Rockies Inc. – Mining Tech', amount: '$150,000', commission: '$7,500',  status: 'Processing' },
    { id: '4', date: 'Feb 1, 2026', investor: 'Michael B.',    project: 'MobTech Financiers',        amount: '$300,000', commission: '$15,000', status: 'Completed'  },
  ];

  const statusClass: Record<TxStatus, string> = {
    Completed:  'bg-gray-100 text-gray-500',
    Processing: 'bg-amber-100 text-amber-600',
  };
</script>

<div class="bg-white rounded-3xl px-10 py-8 shadow-xs shadow-black/20">
  <h2 class="text-2xl font-semibold mb-6">Recent Transactions</h2>

  <table class="w-full">
    <thead>
      <tr class="border-b border-base-200">
        <th class="text-left text-sm font-medium text-secondary pb-3 pr-6">Date</th>
        <th class="text-left text-sm font-medium text-secondary pb-3 pr-6">Investor</th>
        <th class="text-left text-sm font-medium text-secondary pb-3 pr-6">Project</th>
        <th class="text-right text-sm font-medium text-secondary pb-3 pr-6">Amount</th>
        <th class="text-right text-sm font-medium text-secondary pb-3 pr-6">Commission</th>
        <th class="text-right text-sm font-medium text-secondary pb-3">Status</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-base-200">
      {#each transactions as tx (tx.id)}
        <tr>
          <td class="py-4 pr-6 text-sm text-base-content/60 whitespace-nowrap">{tx.date}</td>
          <td class="py-4 pr-6 text-sm font-bold whitespace-nowrap">{tx.investor}</td>
          <td class="py-4 pr-6 text-sm text-base-content/70">{tx.project}</td>
          <td class="py-4 pr-6 text-sm font-bold text-right whitespace-nowrap">{tx.amount}</td>
          <td class="py-4 pr-6 text-sm font-semibold text-right text-[#069668] whitespace-nowrap">{tx.commission}</td>
          <td class="py-4 text-right whitespace-nowrap">
            <span class="text-xs font-medium px-3 py-1 rounded-full {statusClass[tx.status]}">
              {tx.status}
            </span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
