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
    <!-- Bottone principale -->
    <RouterLink
      to="/contacts"
      class="cta-btn"
      aria-label="Vai alla pagina contatti"
      title="Contattami"
    >
      Contattami ora
    </RouterLink>

    <!-- Link rapidi -->
    <div
      class="cta-links"
      aria-label="Link rapidi"
    >
      <a
        href="mailto:info@example.com"
        class="cta-link"
        aria-label="Scrivimi una email"
      >
        Email <span class="sr-only"> – apri il client di posta</span>
      </a>

      <RouterLink
        to="/projects"
        class="cta-link"
        aria-label="Vai alla sezione progetti"
      >
        Progetti <span class="sr-only"> – scopri i miei lavori</span>
      </RouterLink>

      <RouterLink
        to="/illustrations"
        class="cta-link"
        aria-label="Vai alla sezione illustrazioni"
      >
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
.cta {
  position: relative;
  margin: 0 auto;
  padding: 64px 24px 72px;

  color: var(--color-text);
  background-color: var(--color-surface);
  border-top: 2px solid var(--color-accent);

  display: grid;
  justify-items: center;
  gap: 28px;
  text-align: center;
}

/* Bottone principale */
.cta-btn {
  display: inline-block;
  padding: 16px 28px;

  font-weight: 700;
  font-size: 18px;
  text-decoration: none;

  border: 1px solid currentColor;


  background-color: color-mix(in srgb, var(--color-accent) 70%, transparent);
  color: inherit;

  transition: transform 0.08s ease, background-color 0.2s ease;
}
.cta-btn:hover {
  background-color: var(--color-accent);
  color: var(--color-surface);
}
.cta-btn:active {
  transform: scale(0.98);
}
.cta-btn:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

/* Link secondari */
.cta-links {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}
.cta-link {
  color: var(--color-text);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  padding-bottom: 2px;
}
.cta-link:hover {
  color: var(--color-hover);
}

/* ---- Mobile ---- */
@media (max-width: 768px) {
  .cta {
    padding: 48px 16px 64px;
  }
  .cta-btn {
    font-size: 16px;
    padding: 14px 24px;
  }
}
</style>
