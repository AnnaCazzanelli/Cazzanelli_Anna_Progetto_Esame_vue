<!-- src/components/CtaSection.vue -->
<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section
    class="cta"
    role="region"
    aria-labelledby="cta-title"
  >
    <h2 id="cta-title" class="sr-only">Contatti</h2>

    <p>Per lavori su commissione, collaborazioni o altro...</p>

    <RouterLink
      to="/contacts"
      class="cta-btn"
      aria-label="Vai alla pagina contatti"
      title="Contattami"
    >
      Contattami ora
    </RouterLink>

    <div class="cta-links" aria-label="Link rapidi">
      <a
        href="mailto:info@example.com"
        class="cta-link"
        aria-label="Scrivimi una email"
        title="Scrivimi una email"
      >
        Email <span class="sr-only"> – apri il client di posta</span>
      </a>

      <RouterLink to="/projects" class="cta-link" aria-label="Vai alla sezione progetti" title="Vai alla sezione progetti">
        Progetti <span class="sr-only"> – scopri i miei lavori</span>
      </RouterLink>

      <RouterLink to="/illustrations" class="cta-link" aria-label="Vai alla sezione illustrazioni" title="Vai alla sezione illustrazioni">
        Illustrazioni <span class="sr-only"> – esplora le mie tavole</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
/* ---- Accessibilità ---- */
.sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ---- Layout base ---- */
.cta{
  position: relative;
  margin: 0 auto;

  /* padding simmetrico così il centro visivo è realmente nel mezzo */
  padding: 32px 24px;

  /* bordo superiore (quello inferiore lo mette il footer) */
  color: var(--color-text);
  background-color: var(--color-surface);
  border-top: 2px solid var(--color-accent);

  /* centro TUTTO dentro la sezione */
  display: grid;
  place-content: center;     /* <-- centra verticalmente e orizzontalmente il gruppo */
  justify-items: center;     /* allinea gli elementi al centro */
  gap: 24px;

  /* altezza minima così si percepisce il centro tra le due linee */
  min-height: clamp(260px, 32vh, 420px);
}

/* Testo descrittivo: un filo di respiro sopra al bottone */
.cta p{
  margin: 0 0 10px;
  font-size: 18px;
  line-height: 1.6;
}

/* Bottone principale */
.cta-btn{
  display: inline-block;
  padding: 16px 28px;
  font-weight: 700;
  font-size: 18px;
  text-decoration: none;
  border: 1px solid currentColor;
  background-color: color-mix(in srgb, var(--color-accent) 70%, transparent);
  color: inherit;
  transition: transform .08s ease, background-color .2s ease;
}
.cta-btn:hover{ background-color: var(--color-accent); color: var(--color-surface); }
.cta-btn:active{ transform: scale(.98); }
.cta-btn:focus-visible{ outline: 3px solid var(--color-accent); outline-offset: 3px; }

/* Link secondari */
.cta-links{
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}
.cta-link{
  color: var(--color-text);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  padding-bottom: 2px;
}
.cta-link:hover{ color: var(--color-hover); }

/* ---- Mobile ---- */
@media (max-width: 768px){
  .cta{ padding: 24px 16px; min-height: clamp(220px, 40vh, 360px); }
  .cta-btn{ font-size: 16px; padding: 14px 24px; }
}
</style>
