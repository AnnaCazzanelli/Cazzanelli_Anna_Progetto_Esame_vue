<script setup>
/* ==========================================================================
   Import e routing
   ========================================================================== */
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

/* ==========================================================================
   Firestore
   ========================================================================== */
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

/* ==========================================================================
   Stato view
   ========================================================================== */
const route = useRoute()
const project = ref(null)
const loading = ref(true)
const notFound = ref(false)
const activeIndex = ref(0)

/* ==========================================================================
   Helpers
   ========================================================================== */
const isImgUrl = (u) =>
  typeof u === 'string' && /\.(webp|png|jpe?g|gif|avif)$/i.test((u || '').trim())

const normKey = (u) => {
  if (typeof u !== 'string') return ''
  const clean = u.trim().toLowerCase().split('?')[0]
  const file = clean.split('/').pop() || ''
  return file.replace(/\.(webp|png|jpe?g|gif|avif)$/i, '')
}

/* ==========================================================================
   Normalizzazione gallery
   ========================================================================== */
const galleryPairs = computed(() => {
  const g = project.value?.gallery
  if (!Array.isArray(g)) return []
  return g
    .map((it) => {
      if (it && typeof it === 'object') {
        const hi = it.high_res?.trim?.() || it.low_res?.trim?.() || ''
        const lo = isImgUrl(it.low_res) ? it.low_res.trim() : (isImgUrl(it.high_res) ? it.high_res.trim() : '')
        return { hi, lo }
      }
      if (typeof it === 'string') {
        const s = it.trim()
        return { hi: s, lo: s }
      }
      return { hi: '', lo: '' }
    })
    .filter((p) => p.hi || p.lo)
})

/* ==========================================================================
   Immagini per lo stage (Patch HD Cover)
   ========================================================================== */
const images = computed(() => {
  if (!project.value) return []
  const out = []
  const added = new Set()
  const coverRaw = (project.value.main_image?.trim?.() || project.value.img || '').trim()
  
  if (isImgUrl(coverRaw)) {
    const coverKey = normKey(coverRaw)
    const hiResMatch = galleryPairs.value.find(p => normKey(p.hi) === coverKey)
    const finalCoverSrc = hiResMatch ? hiResMatch.hi : coverRaw
    out.push({ src: finalCoverSrc, alt: `${project.value.title} – cover` })
    added.add(coverKey)
  }

  for (const p of galleryPairs.value) {
    const src = p.hi?.trim()
    if (!isImgUrl(src)) continue
    const key = normKey(src)
    if (added.has(key)) continue
    out.push({ src, alt: `${project.value.title} – immagine` })
    added.add(key)
  }
  return out
})

/* ==========================================================================
   Miniature immagini
   ========================================================================== */
const thumbs = computed(() => {
  if (!project.value) return []
  const out = []
  const added = new Set()
  const loByKey = new Map()
  for (const p of galleryPairs.value) {
    const lo = isImgUrl(p.lo) ? p.lo : (isImgUrl(p.hi) ? p.hi : '')
    if (lo) loByKey.set(normKey(p.hi || lo), lo)
  }
  const cover = (project.value.main_image?.trim?.() || project.value.img || '').trim()
  if (isImgUrl(cover)) {
    const coverKey = normKey(cover)
    const coverThumb = loByKey.get(coverKey) || cover
    out.push({ src: coverThumb, alt: `${project.value.title} – cover` })
    added.add(normKey(coverThumb))
    added.add(coverKey)
  }
  for (const p of galleryPairs.value) {
    const candidate = isImgUrl(p.lo) ? p.lo : (isImgUrl(p.hi) ? p.hi : '')
    if (!candidate) continue
    const key = normKey(candidate)
    if (!added.has(key)) {
      out.push({ src: candidate, alt: `${project.value.title} – miniatura` })
      added.add(key)
    }
  }
  return out
})

/* ==========================================================================
   Navigazione e Swipe
   ========================================================================== */
const setActive = (i) => { activeIndex.value = i }
const prev = () => { if (activeIndex.value > 0) activeIndex.value-- }
const next = () => { if (activeIndex.value < images.value.length - 1) activeIndex.value++ }

const startX = ref(0), startY = ref(0), deltaX = ref(0)
const SWIPE = { threshold: 45, maxAngle: 60 }
function onTouchStart(e) { const t = e.changedTouches?.[0]; if (!t) return; startX.value = t.clientX; startY.value = t.clientY; deltaX.value = 0 }
function onTouchMove(e) { const t = e.changedTouches?.[0]; if (!t) return; const dx = t.clientX - startX.value, dy = Math.abs(t.clientY - startY.value); deltaX.value = dy < SWIPE.maxAngle ? dx : 0 }
function onTouchEnd() { if (Math.abs(deltaX.value) >= SWIPE.threshold) { deltaX.value < 0 ? next() : prev() }; deltaX.value = 0 }

/* ==========================================================================
   Colori Categorie
   ========================================================================== */
const CATEGORY_COLORS = {
  'Art Direction': { bg: '#fff3bf', bd: '#ffd43b', fg: '#7a5b00' },
  'Web design':    { bg: '#e7f5ff', bd: '#74c0fc', fg: '#1c4f80' },
  'Copywriting':   { bg: '#ffe3e3', bd: '#ffa8a8', fg: '#7a1f1f' },
  Other:           { bg: '#f1f3f5', bd: '#dee2e6', fg: '#212529' }
}
const tagStyle = computed(() => {
  const c = CATEGORY_COLORS[project.value?.category] || CATEGORY_COLORS.Other
  return { background: c.bg, border: `1px solid ${c.bd}`, color: c.fg }
})

async function fetchProject() {
  loading.value = true; notFound.value = false; project.value = null; activeIndex.value = 0
  const id = String(route.params.id || '').trim()
  try {
    const snap = await getDoc(doc(db, 'projects', id))
    if (!snap.exists()) { notFound.value = true; return }
    project.value = { id: snap.id, ...snap.data() }
    window.scrollTo({ top: 0, behavior: 'instant' })
  } catch (e) { notFound.value = true } finally { loading.value = false }
}
onMounted(fetchProject); watch(() => route.params.id, fetchProject)
</script>

<template>
  <main class="page bg-surface text-text">
    <div v-if="loading" class="loading">Caricamento progetto…</div>
    <div v-else-if="notFound" class="notfound">
      <p>Progetto non trovato.</p>
      <RouterLink to="/projects" class="back-link">Torna ai progetti</RouterLink>
    </div>

    <div v-else-if="project" class="container">
      <RouterLink to="/projects" class="back-btn">
        <img src="/icone/icon-arrowsx.svg" alt="" class="icon" />
      </RouterLink>

      <h1 class="title text-accent text-center">{{ project.title }}</h1>

      <div v-if="project.behance_url" class="behance-header-link">
        <a :href="project.behance_url" target="_blank" rel="noopener noreferrer">
          <img src="/icone/icon-behance.svg" alt="" class="behance-mini-icon" />
          Approfondisci il progetto su Behance
        </a>
      </div>

      <section class="viewer">
        <button class="nav" :disabled="activeIndex === 0" @click="prev">
          <img src="/icone/icon-prev.svg" alt="" class="icon" />
        </button>
        <div class="stage" @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove" @touchend="onTouchEnd">
          <img :src="images[activeIndex].src" :alt="images[activeIndex].alt" class="stage-img" />
        </div>
        <button class="nav" :disabled="activeIndex === images.length - 1" @click="next">
          <img src="/icone/icon-next.svg" alt="" class="icon" />
        </button>
      </section>

      <section v-if="thumbs.length > 1" class="thumbs">
        <button v-for="(t, i) in thumbs" :key="i" class="thumb" :class="{ active: i === activeIndex }" @click="setActive(i)">
          <img :src="t.src" :alt="t.alt" />
        </button>
      </section>

      <section class="meta">
        <div class="col">
          <h3>Data</h3>
          <p v-if="project.year">{{ project.year }}</p>
          <h3>Tipo di progetto</h3>
          <p><span class="pill" :style="tagStyle">{{ project.category || 'Other' }}</span></p>
          <h3>Tag</h3>
          <ul v-if="project.tag?.length" class="tags">
            <li v-for="(t, i) in project.tag" :key="i" class="pill" :style="tagStyle">{{ t }}</li>
          </ul>
        </div>
        <div class="col">
          <h3>Description:</h3>
          <p v-if="project.description" class="desc">{{ project.description }}</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* Ripristino stili originali */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
.page { padding: 48px var(--margin-desktop) 112px; }
.container { max-width: 1200px; margin: 0 auto; position: relative; }
.loading, .notfound { padding: 160px 0; text-align: center; opacity: 0.8; }
.back-link { color: var(--color-accent); text-decoration: none; }
.back-btn { position: absolute; top: -60px; left: 0; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.back-btn:hover { background: rgba(0,0,0,0.06); }
.title { font-size: clamp(32px, 4.2vw, 56px); line-height: 1.1; margin: 56px 0 10px; } /* Ridotto margine bottom per il link */

/* Stile Behance Sotto Titolo */
.behance-header-link { text-align: center; margin-bottom: 40px; }
.behance-header-link a { display: inline-flex; align-items: center; gap: 8px; color: var(--color-accent); text-decoration: none; font-weight: 500; font-size: 1rem; opacity: 0.8; transition: opacity 0.2s; }
.behance-header-link a:hover { opacity: 1; text-decoration: underline; }
.behance-mini-icon { width: 14px; height: 14px; transform: rotate(-45deg); } /* Ruotata per sembrare un link esterno */

.viewer { display: grid; grid-template-columns: 56px 1fr 56px; align-items: center; gap: 24px; margin: 0 0 56px; }
.stage { width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; outline: none; touch-action: pan-y; }
.stage-img { height: clamp(360px, 62vh, 720px); width: auto; max-width: 100%; object-fit: contain; display: block; }
.nav { width: 48px; height: 48px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.nav:disabled { opacity: 0.35; cursor: not-allowed; }
.thumbs { display: flex; gap: 40px; align-items: center; flex-wrap: wrap; margin: 40px 80px; }
.thumb { width: 112px; height: 112px; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; cursor: pointer; padding: 0; }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb.active { outline: 3px solid var(--color-accent); }
.meta { display: grid; grid-template-columns: 1fr 2fr; gap: 72px; margin-top: 16px; padding-top: 40px; }
.meta h3 { font-size: clamp(20px, 1.9vw, 24px); margin: 0 0 16px; color: var(--color-accent); }
.desc, .meta .col p { font-size: clamp(15px, 1.05vw, 18px); line-height: 1.8; margin: 0 0 14px; }
.tags { display: flex; gap: 12px; flex-wrap: wrap; list-style: none; padding: 0; }
.pill { padding: 8px 12px; border-radius: 999px; font-size: 0.95rem; border: 1px solid currentColor; }

@media (max-width: 768px) {
  .page { padding: 32px var(--margin-mobile) 96px; }
  .viewer { grid-template-columns: 1fr; gap: 16px; }
  .nav { display: none; }
  .stage-img { width: 100%; height: auto; max-height: 70vh; }
  .thumbs { gap: 16px; margin: 0 0 56px; }
  .meta { grid-template-columns: 1fr; gap: 28px; }
  .back-btn { top: -80px; left: 8px; }
}
</style>