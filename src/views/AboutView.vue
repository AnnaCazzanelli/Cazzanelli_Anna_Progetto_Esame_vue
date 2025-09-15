<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="about-page" aria-labelledby="about-title">
    <!-- Sezione introduttiva -->
    <section class="intro" role="region" aria-labelledby="about-title">
      <!-- Immagine/ritratto decorativa: cambia con dark-mode -->
      <div
        class="portrait"
        aria-hidden="true"
        role="img"
      ></div>

      <!-- Testo -->
      <article class="bio">
        <h1 id="about-title" class="title">About me</h1>

        <p>
          Ciao! Sono Anna Cazzanelli, illustratrice e digital designer.<br>
          Dopo il diploma al Liceo Artistico <strong><em>A. Vittoria</em></strong> di Trento e la
          laurea triennale in Nuove Tecnologie dell’Arte all’Accademia di Belle Arti <strong><em>G. Cignaroli</em></strong> di Verona,
          attualmente sto completando il biennio magistrale in Digital Design &amp;
          Communication alla <strong><em>LABA </em></strong> Libera Accademia di Belle Arti di Brescia.
        </p>

        <p>
          Il mio percorso mi ha portata a sviluppare competenze che spaziano
          dall’illustrazione editoriale alla progettazione digitale: dal design di
          siti web e applicazioni, alla motion graphic, fino alla creazione di
          identità visive e strategie di comunicazione multimediale.
        </p>

        <p>
          In ogni progetto cerco di coniugare creatività e funzionalità, dando vita
          a soluzioni visive efficaci e coerenti con il contesto. <br> Credo che il design
          sia soprattutto un linguaggio capace di raccontare storie, costruire esperienze
          e generare connessioni autentiche.
        </p>
      </article>
    </section>

  </main>
</template>

<style scoped>
/* ---- A11y ---- */
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
.about-page {
  padding: 48px var(--margin-desktop) 112px;
  background: var(--color-surface);
  color: var(--color-text);
}

/* Sezione intro: due colonne con lo stesso gap di ProjectDetails (72px) */
.intro {
  display: grid;
  grid-template-columns: 1fr 1fr;      /* immagine a sx, testo a dx */
  gap: 72px;                           /* ← come nelle colonne SX/DX di ProjectDetails */
  align-items: start;
  max-width: 1200px;
  margin: 0 auto 80px;
}

/* Ritratto dimensionato come le hero (h = 600px, immagine contain) */
.portrait {
  width: 100%;
  height: 600px;                       /* ← stessa altezza delle hero di Projects/Illustrations */
  background-image: url('/images/about/about_lightmode.png');
  background-size: contain;            /* come le hero */
  background-repeat: no-repeat;
  background-position: top left;    /* allineato a sinistra, centrato verticalmente */
  border: 1px solid var(--color-surface);
  background-color: var(--color-surface);
}

/* Testo */
.bio {
  max-width: 68ch;
  
}
.title {
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.1;
  margin: 0 0 16px;
  color: var(--color-accent);
}
.bio p {
  font-size: clamp(16px, 1.05vw, 18px);
  line-height: 1.85;
  margin: 0 0 16px;
  color: var(--color-text);
}



/* Dark mode: cambia immagine ritratto */
body.dark-mode .portrait {
  background-image: url('/images/about/about_darkmode.png');
}

/* ---- Mobile ---- */
@media (max-width: 900px) {
  .intro {
    grid-template-columns: 1fr;       /* immagine sopra, testo sotto */
    gap: 28px;                        /* gap più compatto su mobile */
  }
  .portrait {
    height: 320px;                    /* hero un po’ più bassa su mobile */
    background-position: center;      /* centrata */
  }
  .about-page {
    padding: 32px var(--margin-mobile) 96px;
  }
}
</style>
