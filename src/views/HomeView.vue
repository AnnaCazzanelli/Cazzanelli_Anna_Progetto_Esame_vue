<script setup>
import { RouterLink } from 'vue-router'
import Handwave from '@/components/Handwave.vue'
</script>

<template>
  <main
    class="home"
    aria-labelledby="home-title"
  >
    <section
      class="hero"
      role="region"
      aria-labelledby="home-title"
    >
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
        <Handwave
          :canvas-width="900"
          :canvas-height="900"
          :display-width="580"
          :display-height="580"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Layout base */
.home{
  padding-top: 8px;              /* un po’ meno spazio sopra */
  padding-bottom: 64px;
  background: var(--color-surface);
  color: var(--color-text);
}

.hero{
  max-width: 1280px;
  margin-left: var(--margin-desktop);
  margin-right: var(--margin-desktop);

  /* spazio verticale contenuto, poi alzo tutto con translate */
  padding-top: 32px;
  padding-bottom: 56px;

  display: grid;
  grid-template-columns: 1.2fr 1fr;  /* testo più largo della mano */
  align-items: center;
  gap: 56px;

  /* alza l'intero blocco rispetto all'header */
  transform: translateY(-32px);
  /* se usi anchor type #home/non sovrapporre la navbar */
  scroll-margin-top: 80px;
}

/* Tipografia — dimensioni bilanciate con clamp() */
.title{
  margin: 0 0 10px 0;
  color: var(--color-accent);
  font-weight: 800;
  line-height: 1.03;
  font-size: clamp(110px, 17vw, 400px);
}

.subtitle{
  margin: 0 0 6px 0;
  font-weight: 700;
  line-height: 1.18;
  font-size: clamp(22px, 3.2vw, 44px);
  letter-spacing: .2px;
}

.role{
  margin: 0 0 18px 0;
  font-weight: 500;
  line-height: 1.24;
  font-size: clamp(18px, 2.6vw, 34px);
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

/* Mano: piccolo ritocco verso l’alto */
.hand-wrap{
  display: grid;
  place-items: center;
  max-width: 100%;
  transform: translateY(-40px);  /* prima era -80px */
}

/* Tablet */
@media (max-width: 980px){
  .hero{
    margin-left: var(--margin-mobile);
    margin-right: var(--margin-mobile);
    grid-template-columns: 1fr;
    gap: 36px;
    padding-top: 28px;
    padding-bottom: 44px;
    transform: translateY(-18px);   /* alza un po’ anche su tablet */
    scroll-margin-top: 72px;
  }
  .hand-wrap{
    transform: translateY(-24px) scale(.82);
    transform-origin: top center;
  }
}

/* Mobile */
@media (max-width: 600px){
  .title{ margin-bottom: 6px; }
  .hero{
    transform: translateY(-10px);
    scroll-margin-top: 64px;
  }
  .hand-wrap{
    transform: translateY(-12px) scale(.66);
  }
}

/* rispettare reduced motion */
@media (prefers-reduced-motion: reduce){
  .hero, .hand-wrap{
    transform: none !important;
  }
}
</style>
