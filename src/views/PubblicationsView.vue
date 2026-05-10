<script setup>
import { onMounted } from 'vue'

/* Assicuriamoci che la pagina parta dall'alto */
onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
})
</script>

<template>
  <main class="page-content" aria-labelledby="page-title">
    <div class="publications-hero-wrapper flex flex-col items-center">

      <section class="hero-container relative w-full overflow-hidden">
        <div class="hero-image-container absolute inset-0" aria-hidden="true"></div>
        
        <div class="header-content-wrapper absolute inset-x-0 top-1/2 -translate-y-1/2 text-center w-full px-[var(--margin-desktop)]">
          <h1 id="page-title">Pubblicazioni</h1>
        </div>
      </section>

      <section class="placeholder-content h-[50vh] flex items-center justify-center opacity-30">
        <p>Contenuto in arrivo...</p>
      </section>

    </div>
  </main>
</template>

<style scoped>
/* --- HERO (DESKTOP) --- */
.hero-container {
  height: 350px;
  width: 100%;
}

.hero-image-container {
  background-image: url('/images/pubblication/pubblication_lightmode.png');
  background-size: contain; 
  background-repeat: no-repeat; 
  background-position: right center;
  transition: background-image 0.3s ease;
}

/* Gestione Dark Mode */
:deep(body.dark-mode) .hero-image-container,
.dark-mode .hero-image-container {
  background-image: url('/images/pubblication/pubblication_darkmode.png');
}

.header-content-wrapper h1 { 
  font-size: 64pt; 
  line-height: 1.1; 
  color: var(--color-accent); 
  font-family: var(--font-display); /* O la font che usi per i titoli */
}

/* --- RESPONSIVE MOBILE --- */
@media (max-width: 768px) {
  .hero-container {
    height: auto; 
    display: flex;
    flex-direction: column;
    overflow: visible;
    padding-top: 20px;
  }

  .hero-image-container {
    position: relative; 
    width: 100%;
    height: 250px; 
    background-position: center; 
    background-size: contain;
    margin-bottom: 10px;
    transform: none;
  }

  .header-content-wrapper {
    position: relative;
    top: 0;
    transform: none;
    padding-inline: var(--margin-mobile);
    margin-bottom: 40px;
    text-align: center;
  }

  .header-content-wrapper h1 { 
    font-size: 28pt; 
    line-height: 1.2;
  }
}
</style>