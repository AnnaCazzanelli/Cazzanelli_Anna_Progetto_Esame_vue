<script setup>
import { RouterLink } from 'vue-router'
import Handwave from '@/components/Handwave.vue'
</script>

<template>
  <main class="home" aria-labelledby="home-title">
    <section class="hero" role="region" aria-labelledby="home-title">
      <!-- Colonna testo -->
      <article class="intro">
        <h1 id="home-title" class="title">Ciao</h1>
        <h2 class="subtitle">Sono Anna Cazzanelli</h2>
        <h3 class="role">Digital Designer &amp; Illustratrice</h3>

        <p class="payoff">Se vuoi saperne di più di me</p>

        <RouterLink
          to="/about"
          class="cta"
          aria-label="Vai alla pagina About per saperne di più su Anna Cazzanelli"
          title="Scopri di più"
        >
          Clicca qui
        </RouterLink>
      </article>

      <!-- Colonna mano animata -->
      <div class="hand-wrap" aria-hidden="true">
        <!-- Il canvas si adatta alla LARGHEZZA di .hand-wrap (no stretch) -->
        <Handwave :canvas-width="900" :canvas-height="900" />
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ---------------- Base ---------------- */
.home{
  padding-top: 8px;
  padding-bottom: 64px;
  background: var(--color-surface);
  color: var(--color-text);
}

/* 2 colonne SEMPRE (testo | mano) */
.hero{
  max-width: 1280px;
  margin-left: var(--margin-desktop);
  margin-right: var(--margin-desktop);

  padding-top: 32px;
  padding-bottom: 56px;

  display: grid;
  /* testo più largo + colonna immagine ampia e limitata */
  grid-template-columns: 1.2fr clamp(300px, 36vw, 520px);
  align-items: center;
  gap: 56px;

  transform: translateY(-32px);
  scroll-margin-top: 80px;
}

.intro{ min-width: 0; } /* evita tagli imprevisti */

/* --------- Tipografia (no wrap + clamp per non tagliare) --------- */
.title{
  margin: 0 0 10px 0;
  color: var(--color-accent);
  font-weight: 800;
  line-height: 1.03;
  white-space: nowrap;
  font-size: clamp(140px, 17vw, 400px);
}

.subtitle{
  margin: 0 0 6px 0;
  font-weight: 700;
  line-height: 1.18;
  white-space: nowrap;
  font-size: clamp(20px, 3.4vw, 44px);
  letter-spacing: .2px;
}

.role{
  margin: 0 0 18px 0;
  font-weight: 500;
  line-height: 1.24;
  white-space: nowrap;
  font-size: clamp(18px, 2.8vw, 34px);
  opacity: .95;
}

.payoff{
  margin: 8px 0 16px 0;
  font-size: clamp(16px, 1.4vw, 18px);
  line-height: 1.65;
  opacity: .9;
}

/* CTA */
.cta{
  display: inline-block;
  padding: 14px 22px;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  color: var(--color-text);
  border: 1px solid var(--color-accent);
  background-color: color-mix(in srgb, var(--color-accent) 70%, transparent);
  transition: transform .08s ease, background-color .2s ease, box-shadow .2s ease;
}
.cta:hover{
  background-color: color-mix(in srgb, var(--color-accent) 82%, transparent);
  box-shadow: 0 4px 18px rgba(0,0,0,.08);
}
.cta:active{ transform: scale(.98); }
.cta:focus-visible{
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

/* --------- Colonna mano --------- */
/* Qui controlli la dimensione effettiva dell'animazione: larghezza = NO stretch */
.hand-wrap{
  width: clamp(300px, 36vw, 520px);   /* grande su desktop */
  justify-self: end;       
  margin-top:-40px ;           /* allineata a destra della colonna */
}

/* ---------------- Large desktop ---------------- */
@media (min-width: 1400px){
  .hero{
    grid-template-columns: 1.1fr clamp(360px, 38vw, 560px);
  }
  .hand-wrap{
    width: clamp(360px, 38vw, 560px);
    margin-top: -30px;
  }
}

/* ---------------- Tablet ---------------- */
@media (max-width: 980px){
  .hero{
    margin-left: var(--margin-mobile);
    margin-right: var(--margin-mobile);
    grid-template-columns: 1fr clamp(220px, 30vw, 320px); /* mano a destra, ridotta */
    gap: 36px;
    padding-top: 28px;
    padding-bottom: 44px;
    transform: translateY(-18px);
    scroll-margin-top: 72px;
  }

  .title{    font-size: clamp(110px, 16vw, 260px); }
  .subtitle{ font-size: clamp(19px, 3.1vw, 36px);  }
  .role{     font-size: clamp(17px, 2.4vw, 30px);  }

  .hand-wrap{
    width: clamp(220px, 30vw, 320px);
  }
}

/* ---------------- Mobile ---------------- */
@media (max-width: 600px){
  .hero{
    grid-template-columns: 1fr clamp(180px, 28vw, 240px); /* sempre due colonne */
    gap: 24px;
    transform: translateY(-10px);
    scroll-margin-top: 64px;
  }

  .title{    font-size: clamp(88px, 18vw, 200px); }
  .subtitle{ font-size: clamp(18px, 4.0vw, 28px); }
  .role{     font-size: clamp(16px, 3.4vw, 24px); }

  .hand-wrap{
    width: clamp(180px, 28vw, 240px); /* ridotta ma proporzionata (no stretch) */
  }
}

/* Accessibilità: niente animazioni di posizione se l'utente le riduce */
@media (prefers-reduced-motion: reduce){
  .hero{ transform: none !important; }
}
</style>
