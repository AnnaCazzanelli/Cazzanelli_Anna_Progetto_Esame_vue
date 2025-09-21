<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const projects = ref([])
const loading  = ref(true)
const error    = ref(null)

const CATEGORY_COLORS = {
  'Art Direction': { bg: '#fff3bf', bd: '#ffd43b', fg: '#7a5b00' },
  'Web design':    { bg: '#e7f5ff', bd: '#74c0fc', fg: '#1c4f80' },
  'Copywriting':   { bg: '#ffe3e3', bd: '#ffa8a8', fg: '#7a1f1f' },
  Other:           { bg: '#f1f3f5', bd: '#dee2e6', fg: '#212529' }
}
function badgeStyle(category) {
  const c = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
  return { background: c.bg, border: `1px solid ${c.bd}`, color: c.fg }
}

function ariaLabelFor(p) {
  const cat  = p.category || 'Categoria non specificata'
  const tags = Array.isArray(p.tag) && p.tag.length ? `. Tag: ${p.tag.join(', ')}.` : ''
  return `Apri il progetto “${p.title}”. Categoria: ${cat}${tags}`
}
function altFor(p) { return `Immagine di copertina del progetto “${p.title}”` }

async function getProjects () {
  loading.value = true
  error.value = null
  try {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    projects.value = snap.docs.map(d => ({ firestoreId: d.id, ...(d.data() || {}) }))
  } catch (e) {
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
  <main
    aria-labelledby="page-title"
    class="bg-surface text-text px-[var(--margin-desktop)] phone:px-[var(--margin-mobile)]"
  >
    <div class="flex flex-col items-center">
      <!-- HERO -->
      <section class="relative w-full h-[400px] overflow-hidden mb-10 phone:mb-3">
        <div class="hero-image absolute inset-0"></div>

        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center px-[var(--margin-mobile)]">
          <h1
            id="page-title"
            class="m-0 font-extrabold text-accent tracking-tight
                   text-[28px] xs:text-[32px] sm:text-[40px]
                   md:text-[clamp(44px,6.2vw,96px)]
                   phone:leading-tight"
          >
            Progetti Digitali
          </h1>
        </div>
      </section>

      <p v-if="error" class="text-[#d00] my-2" role="alert">{{ error }}</p>

      <!-- SKELETON -->
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
          <div class="relative w-full aspect-[1200/800] overflow-hidden bg-[var(--color-surface)] m-0 skeleton-box">
            <span class="cat-badge skeleton-pill absolute top-[10px] left-[10px]"></span>
          </div>
          <div class="skeleton-line title"></div>
          <div class="flex flex-wrap justify-center mt-2 gap-1">
            <span v-for="i in 3" :key="i" class="tag skeleton-pill"></span>
          </div>
        </div>
      </section>

      <!-- GRID -->
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
          <figure class="relative w-full aspect-[1200/800] overflow-hidden bg-[var(--color-surface)] m-0">
            <img :src="p.img" :alt="altFor(p)" class="w-full h-full object-cover transition-transform duration-200 ease-in-out" />
            <figcaption class="cat-badge" :style="badgeStyle(p.category)" aria-hidden="true">
              {{ p.category || 'Other' }}
            </figcaption>
          </figure>

          <h3 class="mt-3">{{ p.title }}</h3>

          <ul v-if="p.tag?.length" class="list-none flex flex-wrap justify-center mt-2 gap-[0.35rem] p-0" aria-label="Tag del progetto">
            <li v-for="tag in p.tag" :key="tag" class="tag pill" :style="badgeStyle(p.category)">
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
.sr-only{
  position:absolute!important; width:1px; height:1px; padding:0; margin:-1px;
  overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
}

.hero-image{
  background-image: url('/images/projects/copertina/project_lightmode.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right center;
  transform: translateY(-8%);
}
body.dark-mode .hero-image{
  background-image: url('/images/projects/copertina/project_darkmode.png');
}
@media (max-width: 1024px) and (min-width: 769px){
  .hero-image{ background-position:right center; transform: translateY(-10%); opacity:.95; }
}
@media (max-width: 768px){
  .hero-image{ background-position:right top; transform: translateY(-12%); opacity:.9; }
}

.project-item:focus-visible{
  outline: 3px solid #94b7ff;
  outline-offset: 4px;
  border-radius: 10px;
}
.project-item:hover img{ transform: scale(1.01); }

.cat-badge{
  position:absolute; top:10px; left:10px;
  padding:6px 10px; border-radius: 999px;
  font-size:.75rem; font-weight:600;
  font-family: var(--font-body);
  backdrop-filter: saturate(120%) blur(2px);
  user-select:none;
}

.tag{ font-size:.85rem; }
.pill{ padding:6px 10px; border-radius:999px; border:1px solid currentColor; }

@keyframes pulse{ 0%{opacity:.6} 50%{opacity:.3} 100%{opacity:.6} }
.skeleton{ pointer-events:none; }
.skeleton-box,.skeleton-line,.skeleton-pill{ background: currentColor; color:transparent; opacity:.35; animation:pulse 1.6s infinite ease-in-out; }
.skeleton-line.title{ width:60%; height:16px; border-radius:4px; margin-top:12px; }
.skeleton-pill{ height:18px; border-radius:9999px; min-width:56px; display:inline-block; }
</style>
