<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <!-- padding Y simmetrico su tutte le view -->
  <main
    class="bg-surface text-text py-12 px-mobile md:px-desktop"
    aria-labelledby="about-title"
  >
    <!-- Intro (niente margin-bottom: usa solo il padding del main) -->
    <section
      class="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-[72px] items-start"
      role="region"
      aria-labelledby="about-title"
    >
      <!-- Ritratto -->
      <div class="portrait" aria-hidden="true" role="img"></div>

      <!-- Testo -->
      <article class="bio max-w-[68ch]">
        <!-- mobile più piccolo + no wrap; da md in su torna al clamp -->
        <h1
          id="about-title"
          class="m-0 mb-4 text-accent leading-[1.1] whitespace-nowrap
         text-[28px] xs:text-[30px] sm:text-[36px] md:text-[clamp(32px,4vw,48px)]"
        >
          About me
        </h1>

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
/* Accessibilità */
.sr-only{
  position:absolute!important; width:1px; height:1px; padding:0; margin:-1px;
  overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
}

/* Ritratto: gestione immagine + dark mode + altezze */
.portrait{
  width: 100%;
  height: 600px;
  background-image: url('/images/about/about_lightmode.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top left;
  border: 1px solid var(--color-surface);
  background-color: var(--color-surface);
}
body.dark-mode .portrait{
  background-image: url('/images/about/about_darkmode.png');
}
@media (max-width: 900px){
  .portrait{
    height: 320px;
    background-position: center;
  }
}

/* Tipografia paragrafi: batte p{} globali */
.bio p{
  margin: 0 0 16px;
  color: var(--color-text);
  font-size: clamp(16px, 1.05vw, 18px);
  line-height: 1.85;
}

/* Utility per padding orizzontale coerente con il resto del sito */
:global(.px-mobile){ padding-left: var(--margin-mobile); padding-right: var(--margin-mobile); }
@media (min-width: 768px){
  :global(.px-desktop){ padding-left: var(--margin-desktop); padding-right: var(--margin-desktop); }
}
</style>
