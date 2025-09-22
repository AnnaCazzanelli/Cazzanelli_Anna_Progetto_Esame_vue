<script setup>
/* ==========================================================================
   Stato e dati
   - projects: elenco dei progetti caricati da Firestore.
   - loading / error: gestione stato UI.
   ========================================================================== */
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const projects = ref([])
const loading  = ref(true)
const error    = ref(null)

/* ==========================================================================
   Scroll iniziale
   - Garantisce l’avvio view dall’inizio pagina
   ========================================================================== */
window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

/* ==========================================================================
   Stile badge per categoria
   - Mappa colori per categorie note + fallback "Other".
   - badgeStyle: restituisce uno style inline coerente con la categoria.
   ========================================================================== */
const CATEGORY_COLORS = {
  'Art Direction': { bg: '#fff3bf', bd: '#ffd43b', fg: '#7a5b00' },
  'Web design':    { bg: '#e7f5ff', bd: '#74c0fc', fg: '#1c4f80' },
  'Copywriting':   { bg: '#ffe3e3', bd: '#ffa8a8', fg: '#7a1f1f' },
  Other:           { bg: '#f1f3f5', bd: '#dee2e6', fg: '#212529' }
}

function badgeStyle (category) {
  const c = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
  return {
    background: c.bg,
    border: `1px solid ${c.bd}`,
    color: c.fg
  }
}

/* ==========================================================================
   Accessibilità: 
   - ariaLabelFor: etichetta descrittiva del link al progetto.
   - altFor: descrizione immagine di copertina.
   ========================================================================== */
function ariaLabelFor (p) {
  const cat  = p.category || 'Categoria non specificata'
  const tags = Array.isArray(p.tag) && p.tag.length
    ? `. Tag: ${p.tag.join(', ')}.`
    : ''
  return `Apri il progetto “${p.title}”. Categoria: ${cat}${tags}`
}

function altFor (p) {
  return `Immagine di copertina del progetto “${p.title}”`
}

/* ==========================================================================
   Fetch dati
   - getProjects: lettura ordinata per campo "order".
   - Gestione errori con messaggio utente.
   ========================================================================== */
async function getProjects () {
  loading.value = true
  error.value = null
  try {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    projects.value = snap.docs.map(d => ({
      firestoreId: d.id,
      ...(d.data() || {})
    }))
  } catch (e) {
    error.value = 'Impossibile caricare i progetti.'
  } finally {
    loading.value = false
  }
}

/* ==========================================================================
   Lifecycle
   - Scroll all’inizio pagina.
   - Avvio fetch iniziale.
   ========================================================================== */
onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  getProjects()
})
</script>

<template>
  <main class="page-content" aria-labelledby="page-title">

    <!-- Contenitore principale: colonna, centrato, padding verticale -->
    <div class="projects-container flex flex-col items-center py-4">

      <!-- HERO-->
      <section
        class="hero-container relative w-full h-[400px] overflow-hidden"
        role="region"
        aria-labelledby="page-title"
      >
        <!-- Immagine hero -->
        <div class="hero-image-container absolute inset-0" aria-hidden="true"></div>

        <!-- Titolo: centratura verticale e padding inline responsivo -->
        <div
          class="header-content-wrapper absolute inset-x-0 top-1/2 -translate-y-1/2 text-center w-full px-[var(--margin-desktop)]"
        >
          <h1 id="page-title">Progetti Digitali</h1>
        </div>
      </section>

      <!-- Messaggio errore -->
      <p v-if="error" class="text-[#d00] my-2" role="alert">
        {{ error }}
      </p>

      <!-- SKELETON: placeholder griglia durante il caricamento -->
      <section
        v-if="loading"
        role="list"
        aria-busy="true"
        aria-labelledby="page-subtitle"
        class="grid grid-cols-1 md:grid-cols-2
               gap-x-8 gap-y-16 md:gap-y-20 phone:gap-y-28
               max-w-[1400px] w-full mt-0 mb-12"
      >
        <div
          v-for="n in 4"
          :key="n"
          class="project-item skeleton flex flex-col items-center text-center"
          role="listitem"
          aria-hidden="true"
        >
          <div
            class="relative w-full aspect-[1200/800] overflow-hidden bg-[var(--color-surface)] m-0 skeleton-box"
          >
            <span class="cat-badge skeleton-pill absolute top-[10px] left-[10px]"></span>
          </div>

          <div class="skeleton-line title"></div>

          <div class="flex flex-wrap justify-center mt-2 gap-1">
            <span v-for="i in 3" :key="i" class="tag skeleton-pill"></span>
          </div>
        </div>
      </section>

      <!-- GRID: elenco progetti -->
      <section
        v-else
        role="list"
        aria-labelledby="page-subtitle"
        class="grid grid-cols-1 md:grid-cols-2
               gap-x-8 gap-y-16 md:gap-y-20 phone:gap-y-28
               max-w-[1400px] w-full mt-0 mb-12"
      >
        <RouterLink
          v-for="p in projects"
          :key="p.firestoreId"
          class="project-item no-underline text-inherit flex flex-col items-center text-center cursor-pointer outline-none"
          role="listitem"
          :to="{ name: 'project-details', params: { id: p.firestoreId } }"
          :aria-label="ariaLabelFor(p)"
          :title="`Apri: ${p.title}`"
        >
          <figure
            class="relative w-full aspect-[1200/800] overflow-hidden bg-[var(--color-surface)] m-0"
          >
            <img
              :src="p.img"
              :alt="altFor(p)"
              class="w-full h-full object-cover transition-transform duration-200 ease-in-out"
            />

            <figcaption
              class="cat-badge"
              :style="badgeStyle(p.category)"
              aria-hidden="true"
            >
              {{ p.category || 'Other' }}
            </figcaption>
          </figure>

          <h3 class="mt-3">
            {{ p.title }}
          </h3>

          <ul
            v-if="p.tag?.length"
            class="list-none flex flex-wrap justify-center mt-2 gap-[0.35rem] p-0"
            aria-label="Tag del progetto"
          >
            <li
              v-for="tag in p.tag"
              :key="tag"
              class="tag pill"
              :style="badgeStyle(p.category)"
            >
              {{ tag }}
            </li>
          </ul>
        </RouterLink>
      </section>
    </div>

    <!-- Annuncio di stato non visibile (screen reader) -->
    <div class="sr-only" role="status" aria-live="polite">
      {{ loading ? 'Caricamento progetti in corso…' : 'Elenco progetti caricato' }}
    </div>
  </main>
</template>

<style scoped>

/* Accessibilità: elemento solo-per-screen-reader */
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

/* Hero image light/dark mode */
.hero-image-container {
  background-image: url('/images/projects/copertina/project_lightmode.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right center;
  transform: translateY(-8%);
}

body.dark-mode .hero-image-container {
  background-image: url('/images/projects/copertina/project_darkmode.png');
}

/* ==========================================================================
   Header (titolo) centrato verticalmente
   - Padding inline responsivo per allineamento con margini globali.
   ========================================================================== */
.header-content-wrapper {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  text-align: center;
  width: 100%;
  padding-inline: var(--margin-desktop);
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .header-content-wrapper {
    padding-inline: var(--margin-mobile);
  }
}

/* Tipografia H1 su tablet/mobile (desktop gestito dai token) */
@media (max-width: 1024px) and (min-width: 769px) {
  .header-content-wrapper h1 {
    font-size: 40pt;
    line-height: 50pt;
  }
}

@media (max-width: 768px) {
  .header-content-wrapper h1 {
    font-size: 28pt;
    line-height: 36pt;
  }
}

/* ==========================================================================
   Focus e hover card progetto
   ========================================================================== */
.project-item:focus-visible {
  outline: 3px solid #94b7ff;
  outline-offset: 4px;
  border-radius: 10px;
}

.project-item:hover img {
  transform: scale(1.01);
}

/* ==========================================================================
   Badge categoria e tag
   - cat-badge: pill decorativa posizionata sul media.
   - .tag / .pill: stile per lista tag sotto il titolo.
   ========================================================================== */
.cat-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--font-body);
  backdrop-filter: saturate(120%) blur(2px);
  user-select: none;
}

.tag {
  font-size: 0.85rem;
}

.pill {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid currentColor;
}

/* ==========================================================================
   Scheletro (loading state)
   ========================================================================== */
@keyframes pulse {
  0%   { opacity: 0.6; }
  50%  { opacity: 0.3; }
  100% { opacity: 0.6; }
}

.skeleton {
  pointer-events: none;
}

.skeleton-box,
.skeleton-line,
.skeleton-pill {
  background: currentColor;
  color: transparent;
  opacity: 0.35;
  animation: pulse 1.6s infinite ease-in-out;
}

.skeleton-line.title {
  width: 60%;
  height: 16px;
  border-radius: 4px;
  margin-top: 12px;
}

.skeleton-pill {
  height: 18px;
  border-radius: 9999px;
  min-width: 56px;
  display: inline-block;
}
</style>
