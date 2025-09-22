<script setup>
/**
 * Routing
 * - Import per eventuali link interni dalla pagina About.
 */
import { RouterLink } from 'vue-router'
/* ==========================================================================
   Scroll iniziale
   - Garantisce l’avvio view dall’inizio pagina
   ========================================================================== */
window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

</script>

<template>
  <!-- Contenitore pagina -->
  <main
    class="bg-surface text-text py-12 px-mobile md:px-desktop"
    aria-labelledby="about-title"
  >
    <!--Sezione introduttiva  -->
    <section
      class="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-[72px] items-start"
      role="region"
      aria-labelledby="about-title"
    >
      <!-- Immagine di presentazione -->
      <div class="portrait" aria-hidden="true" role="img"></div>

      <!-- Testo bio -->
      <article class="bio max-w-[68ch]">

        <!--Titolo principale (H1) -->
        <h1
          id="about-title"
          class="m-0 mb-4 text-accent leading-[1.1] whitespace-nowrap
                 text-[28px] xs:text-[30px] sm:text-[36px]
                 md:text-[clamp(32px,4vw,48px)]"
        >
          About me
        </h1>

        <!-- Paragrafi descrittivi -->
       

        <p>
          Ciao! Sono Anna Cazzanelli, illustratrice e digital designer.<br />
          Dopo il diploma al Liceo Artistico <strong><em>A. Vittoria</em></strong> di Trento e la
          laurea triennale in Nuove Tecnologie dell’Arte all’Accademia di Belle Arti
          <strong><em>G. Cignaroli</em></strong> di Verona, attualmente sto completando il
          biennio magistrale in Digital Design &amp; Communication alla
          <strong><em>LABA </em></strong> Libera Accademia di Belle Arti di Brescia.
        </p>

        <p>
          Il mio percorso mi ha portata a sviluppare competenze che spaziano
          dall’illustrazione editoriale alla progettazione digitale: dal design di
          siti web e applicazioni, alla motion graphic, fino alla creazione di
          identità visive e strategie di comunicazione multimediale.
        </p>

        <p>
          In ogni progetto cerco di coniugare creatività e funzionalità, dando vita
          a soluzioni visive efficaci e coerenti con il contesto.<br />
          Credo che il design sia soprattutto un linguaggio capace di raccontare
          storie, costruire esperienze e generare connessioni autentiche.
        </p>
      </article>
    </section>
  </main>
</template>

<style scoped>
/* ==========================================================================
   Accessibilità
   - Classe di utilità per elementi solo-visivi mantenendo la semantica.
   ========================================================================== */
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

/* ==========================================================================
  Immagine di presentazione 
   ========================================================================== */
.portrait {
  width: 100%;
  height: 600px;
  background-image: url('/images/about/about_lightmode.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top left;
  border: 1px solid var(--color-surface);
  background-color: var(--color-surface);
}

/* Variante dark:  */
body.dark-mode .portrait {
  background-image: url('/images/about/about_darkmode.png');
}

/* Riduzione altezza e ricentraggio su viewport stretti */
@media (max-width: 900px) {
  .portrait {
    height: 320px;
    background-position: center;
  }
}

/* ==========================================================================
   Tipografia contenuti
   - Misura e interlinea pensate per lettura prolungata su desktop e mobile.
   ========================================================================== */
.bio p {
  margin: 0 0 16px;
  color: var(--color-text);
  font-size: clamp(16px, 1.05vw, 18px);
  line-height: 1.85;
}

/* ==========================================================================
   Titolo H1 (responsivo)
   - Tablet: crescita moderata per bilanciare con due colonne.
   - Mobile: riduzione dimensione e sblocco a capo per evitare overflow.
   ========================================================================== */
@media (max-width: 1024px) and (min-width: 769px) {
  #about-title {
    font-size: 40pt;
    line-height: 50pt;
  }
}

@media (max-width: 768px) {
  #about-title {
    font-size: 28pt;
    line-height: 36pt;
    white-space: normal;
  }
}

/* ==========================================================================
   Utility di padding orizzontale
   - Allineano la pagina alla griglia globale tramite variabili CSS.
   ========================================================================== */
:global(.px-mobile) {
  padding-left: var(--margin-mobile);
  padding-right: var(--margin-mobile);
}

@media (min-width: 768px) {
  :global(.px-desktop) {
    padding-left: var(--margin-desktop);
    padding-right: var(--margin-desktop);
  }
}
</style>
