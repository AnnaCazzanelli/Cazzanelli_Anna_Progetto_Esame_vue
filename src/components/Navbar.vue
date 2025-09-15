<script setup>
import { RouterLink } from 'vue-router'
import { ref, watch, onMounted } from 'vue'

/* Stato */
const isMobileMenuOpen = ref(false)
const isDarkMode = ref(false)

/* Toggle menu mobile */
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

/* Toggle dark mode */
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

/* Gestione dark mode nel body */
watch(isDarkMode, (newValue) => {
  if (newValue) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
})

/* Ricorda la preferenza in localStorage */
onMounted(() => {
  const savedMode = localStorage.getItem('isDarkMode')
  if (savedMode) {
    isDarkMode.value = JSON.parse(savedMode)
  }
})

watch(isDarkMode, (newValue) => {
  localStorage.setItem('isDarkMode', JSON.stringify(newValue))
}, { deep: true })
</script>

<template>
  <header class="header">
    <!-- Menu desktop -->
    <nav class="desktop-nav" aria-label="Navigazione principale">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/projects">Progetti</RouterLink>
      <RouterLink to="/illustrations">Illustrazioni</RouterLink>
      <RouterLink to="/contacts">Contatti</RouterLink>
    </nav>

    <!-- Toggle tema -->
    <button
      @click="toggleDarkMode"
      class="theme-toggle"
      aria-label="Cambia tema"
    >
      <img
        v-if="isDarkMode"
        src="/icone/icon-moon.svg"
        alt="Dark Mode"
      />
      <img
        v-else
        src="/icone/icon-sun.svg"
        alt="Light Mode"
      />
    </button>

    <!-- Icona hamburger -->
    <div class="menu-icon" @click="toggleMobileMenu" aria-label="Apri menu">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <!-- Menu mobile -->
    <nav
      class="mobile-nav"
      :class="{ 'is-open': isMobileMenuOpen }"
      aria-label="Navigazione mobile"
    >
      <RouterLink to="/" @click="closeMobileMenu">Home</RouterLink>
      <RouterLink to="/about" @click="closeMobileMenu">About</RouterLink>
      <RouterLink to="/projects" @click="closeMobileMenu">Progetti</RouterLink>
      <RouterLink to="/illustrations" @click="closeMobileMenu">Illustrazioni</RouterLink>
      <RouterLink to="/contacts" @click="closeMobileMenu">Contatti</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
/* Header layout */
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px var(--margin-desktop);
  border-bottom: 2px solid var(--color-accent);
}

/* Desktop nav */
.desktop-nav a {
  font-size: 16pt;
  line-height: 19pt;
  font-family: 'Forma DJR Micro', 'Lato', sans-serif;
  font-weight: 700;
  text-decoration: none;
  color: var(--color-text);
  margin-left: 20px;
}
.desktop-nav a:hover {
  color: var(--color-hover);
}

/* Toggle tema */
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
}
.theme-toggle img {
  width: 28px;
  height: 28px;
}

/* Icona hamburger */
.menu-icon {
  display: none;
  flex-direction: column;
  cursor: pointer;
  margin-left: 10px;
}
.menu-icon span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--color-text);
  margin: 5px 0;
}

/* Mobile nav */
.mobile-nav {
  display: none;
}

/* Mobile */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  .menu-icon {
    display: flex;
  }
  .mobile-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh;
    background-color: var(--color-surface);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: right 0.3s ease-in-out;
    z-index: 999;
  }
  .mobile-nav.is-open {
    right: 0;
  }
  .mobile-nav a {
    font-size: 28pt;
    line-height: 36pt;
    font-weight: 700;
    text-decoration: none;
    color: var(--color-text);
    margin: 15px 0;
  }
  .mobile-nav a:hover {
    color: var(--color-hover);
  }
}
</style>
