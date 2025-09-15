<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const projects = ref([])
const loading = ref(true)
const error = ref(null)

/* Palette pill per macro-categoria */
const CATEGORY_COLORS = {
  'Art Direction': { bg: '#fff3bf', bd: '#ffd43b', fg: '#7a5b00' },
  'Web design':    { bg: '#e7f5ff', bd: '#74c0fc', fg: '#1c4f80' },
  'Copywriting':   { bg: '#ffe3e3', bd: '#ffa8a8', fg: '#7a1f1f' },
  Other:           { bg: '#f1f3f5', bd: '#dee2e6', fg: '#212529' }
}

function badgeStyle(category) {
  const c = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
  return {
    background: c.bg,
    border: `1px solid ${c.bd}`,
    color: c.fg
  }
}

/* ARIA helpers */
function ariaLabelFor(p) {
  const cat = p.category || 'Categoria non specificata'
  const tags = Array.isArray(p.tag) && p.tag.length ? `. Tag: ${p.tag.join(', ')}.` : ''
  return `Apri il progetto “${p.title}”. Categoria: ${cat}${tags}`
}
function altFor(p) {
  return `Immagine di copertina del progetto “${p.title}”`
}

/* Fetch progetti */
async function getProjects () {
  loading.value = true
  error.value = null
  try {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    const items = []
    snap.forEach(d => {
      const data = d.data() || {}
      items.push({
        firestoreId: d.id,   // ID reale per la rotta
        ...data              // può contenere un eventuale campo 'id' (slug)
      })
    })
    projects.value = items
  } catch (e) {
    console.error('Errore nel recupero dei progetti:', e)
    error.value = 'Impossibile caricare i progetti.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  getProjects()
})
</script>

<template>
  <main class="page-content" aria-labelledby="page-title">
    <div class="projects-container">
      <!-- HERO decorativa -->
      <section class="hero-container" role="region" aria-labelledby="page-title">
        <div class="hero-image-container" aria-hidden="true"></div>
        <div class="header-content-wrapper">
          <h1 id="page-title">Progetti Digitali</h1>
          
        </div>
      </section>

      <p v-if="error" class="error-text" role="alert">{{ error }}</p>

      <!-- SKELETON -->
      <section
        v-if="loading"
        class="project-grid"
        role="list"
        aria-busy="true"
        aria-labelledby="page-subtitle"
      >
        <div
          v-for="n in 4"
          :key="n"
          class="project-item skeleton"
          role="listitem"
          aria-hidden="true"
        >
          <div class="project-image-container skeleton-box">
            <span class="cat-badge skeleton-pill"> </span>
          </div>
          <div class="skeleton-line title"></div>
          <div class="tag-row">
            <span v-for="i in 3" :key="i" class="tag skeleton-pill"> </span>
          </div>
        </div>
      </section>

      <!-- GRID -->
      <section
        v-else
        class="project-grid"
        role="list"
        aria-labelledby="page-subtitle"
      >
        <RouterLink
          v-for="p in projects"
          :key="p.firestoreId"
          class="project-item"
          role="listitem"
          :to="{ name: 'project-details', params: { id: p.firestoreId } }"
          :aria-label="ariaLabelFor(p)"
          :title="`Apri: ${p.title}`"
        >
          <figure class="project-image-container">
            <img :src="p.img" :alt="altFor(p)" class="project-image" />
            <figcaption
              class="cat-badge"
              :style="badgeStyle(p.category)"
              aria-hidden="true"
            >
              {{ p.category || 'Other' }}
            </figcaption>
          </figure>

          <h3 class="project-title">{{ p.title }}</h3>

          <ul
            v-if="p.tag?.length"
            class="project-tags"
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

    <div class="sr-only" role="status" aria-live="polite">
      {{ loading ? 'Caricamento progetti in corso…' : 'Elenco progetti caricato' }}
    </div>
  </main>
</template>

<style scoped>
/* --- Screen Reader Only --- */
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

/* --- Layout --- */
.page-content {
  padding-left: 40px;
  padding-right: 40px;
}

.projects-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* --- Hero --- */
.hero-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  
}

.hero-image-container {
  position: absolute;
  inset: 0;
  background-image: url('/images/projects/copertina/project_lightmode.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right center;
}

.header-content-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
}

/* --- Project Grid --- */
.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 2rem auto;
}

.project-item {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  outline: none;
}

.project-item:focus-visible {
  outline: 3px solid #94b7ff;
  outline-offset: 4px;
  border-radius: 10px;
}

/* --- Project Card --- */
.project-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1200 / 800;
  overflow: hidden;
  background: var(--color-surface, #f5f5f5);
  margin: 0;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.project-item:hover .project-image {
  transform: scale(1.01);
}

.project-title {
  margin-top: 0.75rem;
}

/* --- Category Badge --- */
.cat-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: saturate(120%) blur(2px);
  user-select: none;
}

/* --- Tags --- */
.project-tags {
  list-style: none;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  gap: 0.35rem;
  padding: 0;
}

.tag {
  font-size: 0.85rem;
}

.pill {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid currentColor;
}

/* --- Error --- */
.error-text {
  color: #d00;
  margin: 0.5rem 0 1rem;
}

/* --- Skeleton --- */
@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 0.3; }
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

/* --- Dark Mode --- */
body.dark-mode .hero-image-container {
  background-image: url('/images/projects/copertina/project_darkmode.png');
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .project-grid {
    grid-template-columns: 1fr;
  }

  .hero-image-container {
    background-position: right top;
    transform: translateY(-12%);
    opacity: 0.9;
  }
}
</style>
