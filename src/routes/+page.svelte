<script lang="ts">
  import { currentUser } from '$lib/stores/auth';
</script>

<svelte:head>
  <title>BT Capital — Plateforme d'investissement & d'entrepreneuriat</title>
</svelte:head>

<!-- ===== NAVBAR ===== -->
<nav class="navbar bg-base-100 border-b border-base-200 sticky top-0 z-40">
  <div class="navbar-start page-container w-full">
    <a href="/" class="btn btn-ghost text-xl font-bold px-0">
      <span class="text-primary">BT</span><span class="text-secondary">Capital</span>
    </a>
  </div>
  <div class="navbar-end gap-2">
    {#if $currentUser}
      <a href="/dashboard" class="btn btn-primary btn-sm">Tableau de bord</a>
    {:else}
      <a href="/auth/login" class="btn btn-ghost btn-sm">Connexion</a>
      <a href="/auth/register" class="btn btn-primary btn-sm">S'inscrire</a>
    {/if}
  </div> 
</nav>

<!-- ===== HERO ===== -->
<section class="gradient-primary text-white section">
  <div class="page-container text-center max-w-4xl mx-auto">
    <div class="badge badge-accent badge-lg mb-6 font-medium">Plateforme N°1 en Afrique</div>
    <h1 class="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
      Connectez-vous avec les<br />
      <span class="text-accent">meilleurs partenaires</span>
    </h1>
    <p class="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
      BT Capital met en relation Investisseurs, Entrepreneurs et Incubateurs pour accélérer
      l'innovation et la croissance en Afrique.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/auth/register" class="btn btn-accent btn-lg font-semibold">
        Commencer gratuitement →
      </a>
      <a href="#how-it-works" class="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
        Comment ça marche
      </a>
    </div>
  </div>
</section>

<!-- ===== STATS ===== -->
<section class="bg-base-200 py-10">
  <div class="page-container">
    <div class="stats stats-vertical sm:stats-horizontal shadow w-full">
      <div class="stat">
        <div class="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div class="stat-title">Utilisateurs actifs</div>
        <div class="stat-value text-primary">2,400+</div>
        <div class="stat-desc">↗︎ 400 (22%) ce mois</div>
      </div>
      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-title">Investissements levés</div>
        <div class="stat-value text-secondary">$45M+</div>
        <div class="stat-desc">En deals facilités</div>
      </div>
      <div class="stat">
        <div class="stat-figure text-accent">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="stat-title">Startups financées</div>
        <div class="stat-value text-accent">320+</div>
        <div class="stat-desc">Dans 15 pays africains</div>
      </div>
    </div>
  </div>
</section>

<!-- ===== ROLES ===== -->
<section class="section bg-base-100">
  <div class="page-container">
    <div class="text-center mb-14">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Pour qui ?</h2>
      <p class="text-base-content/60 text-lg max-w-xl mx-auto">
        Une plateforme pensée pour chaque acteur de l'écosystème entrepreneurial.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <!-- Investisseur -->
      <div class="card bg-base-100 border border-base-200 card-hover">
        <div class="card-body">
          <div class="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
            <span class="text-2xl text-white">💼</span>
          </div>
          <h3 class="card-title text-xl">Investisseurs</h3>
          <p class="text-base-content/60 text-sm leading-relaxed">
            Découvrez des opportunités d'investissement vérifiées, diversifiez votre portefeuille et
            accompagnez des entrepreneurs à fort potentiel.
          </p>
          <ul class="mt-4 space-y-2 text-sm">
            <li class="flex items-center gap-2"><span class="text-success">✓</span> Deal flow qualifié</li>
            <li class="flex items-center gap-2"><span class="text-success">✓</span> Due diligence facilitée</li>
            <li class="flex items-center gap-2"><span class="text-success">✓</span> Réseau d'entrepreneurs</li>
          </ul>
          <div class="card-actions mt-6">
            <a href="/auth/register" class="btn btn-primary btn-sm w-full">Rejoindre →</a>
          </div>
        </div>
      </div>

      <!-- Entrepreneur -->
      <div class="card bg-primary text-primary-content card-hover">
        <div class="card-body">
          <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
            <span class="text-2xl">🚀</span>
          </div>
          <h3 class="card-title text-xl">Entrepreneurs</h3>
          <p class="text-primary-content/80 text-sm leading-relaxed">
            Accédez à un réseau d'investisseurs et d'incubateurs, présentez votre projet et levez
            les fonds nécessaires à votre croissance.
          </p>
          <ul class="mt-4 space-y-2 text-sm">
            <li class="flex items-center gap-2"><span class="opacity-80">✓</span> Mise en relation ciblée</li>
            <li class="flex items-center gap-2"><span class="opacity-80">✓</span> Profil startup complet</li>
            <li class="flex items-center gap-2"><span class="opacity-80">✓</span> Accès aux incubateurs</li>
          </ul>
          <div class="card-actions mt-6">
            <a href="/auth/register" class="btn btn-accent btn-sm w-full">Pitcher votre projet →</a>
          </div>
        </div>
      </div>

      <!-- Incubateur -->
      <div class="card bg-base-100 border border-base-200 card-hover">
        <div class="card-body">
          <div class="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <span class="text-2xl text-white">🏢</span>
          </div>
          <h3 class="card-title text-xl">Incubateurs</h3>
          <p class="text-base-content/60 text-sm leading-relaxed">
            Identifiez les meilleures startups à accompagner, élargissez votre réseau et renforcez
            votre impact sur l'écosystème.
          </p>
          <ul class="mt-4 space-y-2 text-sm">
            <li class="flex items-center gap-2"><span class="text-success">✓</span> Sélection de startups</li>
            <li class="flex items-center gap-2"><span class="text-success">✓</span> Visibilité accrue</li>
            <li class="flex items-center gap-2"><span class="text-success">✓</span> Reporting & analytics</li>
          </ul>
          <div class="card-actions mt-6">
            <a href="/auth/register" class="btn btn-secondary btn-sm w-full">Rejoindre →</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ===== HOW IT WORKS ===== -->
<section id="how-it-works" class="section bg-base-200">
  <div class="page-container">
    <div class="text-center mb-14">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Comment ça marche ?</h2>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      {#each [
        { step: '01', title: 'Créez votre compte', desc: "Inscrivez-vous en quelques minutes et choisissez votre profil : Investisseur, Entrepreneur ou Incubateur." },
        { step: '02', title: 'Vérifiez votre identité', desc: "Complétez votre profil et soumettez vos documents KYC pour activer toutes les fonctionnalités." },
        { step: '03', title: 'Connectez-vous', desc: "Explorez l'écosystème, entrez en contact avec des partenaires et accélérez vos projets." }
      ] as item}
        <div class="flex flex-col items-center text-center gap-4">
          <div class="w-16 h-16 rounded-full gradient-primary text-white flex items-center justify-center text-xl font-bold shrink-0">
            {item.step}
          </div>
          <h3 class="text-xl font-bold">{item.title}</h3>
          <p class="text-base-content/60 text-sm leading-relaxed max-w-xs">{item.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ===== CTA ===== -->
<section class="section gradient-primary text-white text-center">
  <div class="page-container max-w-2xl">
    <h2 class="text-3xl md:text-4xl font-extrabold mb-4">
      Prêt à rejoindre l'écosystème ?
    </h2>
    <p class="text-blue-100 mb-8 text-lg">
      Rejoignez plus de 2 400 acteurs qui font confiance à BT Capital.
    </p>
    <a href="/auth/register" class="btn btn-accent btn-lg font-semibold">
      Créer mon compte gratuitement
    </a>
  </div>
</section>

<!-- ===== FOOTER ===== -->
<footer class="footer footer-center p-6 bg-neutral text-neutral-content">
  <p class="text-sm opacity-60">
    © 2026 BT Capital — Tous droits réservés
  </p>
</footer>
