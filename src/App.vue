<script setup>
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import CtaSection from './components/CtaSection.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
</script>

<template>
  <div class="app-wrapper">
    <Navbar />
    <RouterView />

    <!-- Mostra CTA e Footer solo se non sei nella pagina Contatti -->
    <template v-if="route.name !== 'contacts'">
      <CtaSection />
      
    </template>
    <Footer />
  </div>
</template>
