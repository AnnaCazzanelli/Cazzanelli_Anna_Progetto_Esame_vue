<script setup>
import { onMounted } from 'vue'

/* Assicuriamoci che la pagina parta dall'alto all'apertura */
onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
})
</script>

<template>
  <main class="page-content" aria-labelledby="page-title">
    <div class="publications-page-wrapper flex flex-col items-center py-4">

      <section class="hero-container relative w-full overflow-hidden">
        
        <div class="hero-image-container absolute inset-0" aria-hidden="true"></div>
        
        <div class="header-content-wrapper absolute inset-x-0 top-1/2 -translate-y-1/2 text-center w-full px-[var(--margin-desktop)]">
          <h1 id="page-title">Pubblicazioni</h1>
        </div>

      </section>

      <section class="content-wrapper w-full max-w-[1400px] px-[var(--margin-desktop)] mt-12 mb-20">
        <div class="placeholder-text py-20 text-center opacity-40 border-2 border-dashed border-text/20 rounded-xl">
          <p class="text-lg">Le pubblicazioni appariranno qui...</p>
        </div>
      </section>

    </div>
  </main>
</template>

<style scoped>
/* ==========================================================================
   STILI HERO (Desktop - default)
   ========================================================================== */
.hero-container {
  height: 350px; /* Altezza desktop come da tua richiesta */
  width: 100%;
  position: relative;
  /* Rimuovo il colore di test, ora usiamo l'immagine */
  background-color: transparent; 
}

.hero-image-container {
  /* Percorso Light Mode aggiornato */
  background-image: url('/images/pubblication/pubblication_lightmode1.png');
  background-size: contain; /* L'immagine non viene tagliata */
  background-repeat: no-repeat; 
  background-position: right center; /* Immagine a destra su desktop */
  width: 100%;
  height: 100%;
  z-index: 1; /* Sotto il titolo */
  transition: background-image 0.3s ease; /* Transizione fluida al cambio mode */
}

/* Gestione Dark Mode: si attiva quando body ha la classe .dark-mode */
body.dark-mode .hero-image-container {
  background-image: url('/images//pubblication/pubblication_darkmode.png');
}

.header-content-wrapper {
  z-index: 2; /* Sopra l'immagine */
}

.header-content-wrapper h1 { 
  font-size: 64pt; /* Dimensione desktop originale */
  line-height: 1.1; 
  color: var(--color-accent); /* Colore accento del sito */
  font-family: var(--font-display); /* Assicurati di usare la font dei titoli */
}

/* ==========================================================================
   RESPONSIVE (Mobile - sotto 768px)
   ========================================================================== */
@media (max-width: 768px) {
  .hero-container {
    height: auto; /* Altezza automatica per impilare gli elementi */
    display: flex;
    flex-direction: column;
    padding-top: 20px;
  }

  .hero-image-container {
    position: relative; /* Esce dal posizionamento absolute */
    width: 100%;
    height: 250px; /* Altezza fissa per l'immagine su mobile */
    background-position: center; /* Centrata visivamente */
    background-size: contain;
    margin-bottom: 10px;
  }

  .header-content-wrapper {
    position: relative; /* Esce dal posizionamento absolute */
    top: 0;
    transform: none; /* Rimuove la centratura verticale desktop */
    padding-inline: var(--margin-mobile);
    margin-bottom: 40px;
    text-align: center;
  }

  .header-content-wrapper h1 { 
    font-size: 28pt; /* Dimensione mobile originale */
    line-height: 1.2;
  }

  /* Margini mobile per il contenuto futuro */
  .content-wrapper {
    padding-inline: var(--margin-mobile);
    margin-top: 0;
  }
}
</style>