<script lang="ts">
  import type { UserRole } from '$lib/types';
  import StatCard from './StatCard.svelte';

  interface Props {
    role: UserRole;
  }

  const { role }: Props = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

  {#if role === 'ADMIN'}
    <StatCard
      title="En attente d'approbation"
      value="104"
      desc="8 projets · 4 KYC"
      descColor="warning"
      icon="⏳"
    />
    <StatCard
      title="Total des transactions"
      value="420 000 $"
      desc="de commission générée"
      descColor="secondary"
      icon="💰"
    />
    <StatCard
      title="Utilisateurs actifs"
      value="124"
      desc="ce mois-ci"
      descColor="primary"
      icon="👥"
    />
    <StatCard
      title="Problèmes de conformité"
      value="14"
      desc="Nécessite une attention"
      descColor="error"
      icon="⚠️"
    />

  {:else if role === 'ENTREPRENEUR'}
    <StatCard
      title="Projets publiés"
      value="3"
      desc="1 en cours de revue"
      descColor="warning"
      icon="📁"
    />
    <StatCard
      title="Intérêts reçus"
      value="12"
      desc="4 en attente de réponse"
      descColor="success"
      icon="📩"
    />
    <StatCard
      title="Financement potentiel"
      value="2 400 000 €"
      desc="Cumul des EOI acceptées"
      descColor="primary"
      icon="💶"
    />
    <StatCard
      title="Messages non lus"
      value="5"
      desc="3 conversations actives"
      descColor="secondary"
      icon="💬"
    />

  {:else if role === 'INVESTOR'}
    <StatCard
      title="EOI soumises"
      value="8"
      desc="3 en attente de réponse"
      descColor="warning"
      icon="📤"
    />
    <StatCard
      title="EOI acceptées"
      value="4"
      desc="En cours de négociation"
      descColor="success"
      icon="✅"
    />
    <StatCard
      title="Capital engagé"
      value="850 000 €"
      desc="Sur 4 projets"
      descColor="primary"
      icon="💰"
    />
    <StatCard
      title="Messages non lus"
      value="2"
      desc="2 conversations actives"
      descColor="secondary"
      icon="💬"
    />

  {:else if role === 'INCUBATOR'}
    <StatCard
      title="Projets soumis"
      value="6"
      desc="En attente d'évaluation"
      descColor="warning"
      icon="📬"
    />
    <StatCard
      title="En cours de revue"
      value="3"
      desc="Démarrés ce mois-ci"
      descColor="primary"
      icon="🔍"
    />
    <StatCard
      title="Projets validés"
      value="18"
      desc="Dans votre portfolio"
      descColor="success"
      icon="🏆"
    />
    <StatCard
      title="EOI sur vos projets"
      value="41"
      desc="9 nouvelles ce mois-ci"
      descColor="secondary"
      icon="📊"
    />
  {/if}

</div>
