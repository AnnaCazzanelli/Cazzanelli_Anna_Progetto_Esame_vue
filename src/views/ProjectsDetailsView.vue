<template>
  <main class="page">
    <!-- Stato: caricamento -->
    <div v-if="loading" class="loading" role="status" aria-live="polite">
      Caricamento progetto…
    </div>

    <!-- Stato: non trovato -->
    <div v-else-if="notFound" class="notfound">
      <p>Progetto non trovato.</p>
      <RouterLink to="/projects" class="back-link">Torna ai progetti</RouterLink>
    </div>

    <!-- Stato: progetto ok -->
    <div v-else-if="project" class="container">
      <!-- Back -->
      <RouterLink
        to="/projects"
        class="back-btn"
        aria-label="Torna ai progetti"
        title="Torna ai progetti"
      >
        <img src="/icone/icon-arrowsx.svg" alt="" aria-hidden="true" class="icon" />
        <span class="sr-only">Torna ai progetti</span>
      </RouterLink>

      <!-- Titolo -->
      <h1 class="title">{{ project.title }}</h1>

      <!-- Viewer / Carosello -->
      <section class="viewer" aria-label="Galleria immagini del progetto">
        <button
          class="nav"
          type="button"
          :disabled="activeIndex === 0 || images.length <= 1"
          @click="prev"
          aria-label="Immagine precedente"
          title="Immagine precedente"
        >
          <img src="/icone/icon-prev.svg" alt="" aria-hidden="true" class="icon" />
        </button>

        <div
          class="stage"
          tabindex="0"
          aria-live="polite"
          @keydown.left.prevent="prev"
          @keydown.right.prevent="next"
          @touchstart.passive="onTouchStart"
          @touchmove.passive="onTouchMove"
          @touchend="onTouchEnd"
        >
          <img
            :src="images[activeIndex].src"
            :alt="images[activeIndex].alt"
            class="stage-img"
            loading="eager"
          />
        </div>

        <button
          class="nav"
          type="button"
          :disabled="activeIndex === images.length - 1 || images.length <= 1"
          @click="next"
          aria-label="Immagine successiva"
          title="Immagine successiva"
        >
          <img src="/icone/icon-next.svg" alt="" aria-hidden="true" class="icon" />
        </button>
      </section>

      <!-- Thumbs -->
      <section v-if="thumbs.length > 1" class="thumbs" aria-label="Miniature immagini">
        <button
          v-for="(t, i) in thumbs"
          :key="t.src + i"
          class="thumb"
          :class="{ active: i === activeIndex }"
          type="button"
          :aria-label="`Mostra immagine ${i+1}`"
          :title="`Mostra immagine ${i+1}`"
          @click="setActive(i)"
        >
          <img :src="t.src" :alt="t.alt" />
        </button>
      </section>

    <section class="meta" aria-label="Dettagli progetto">
  <div class="col">
    <h3>Data</h3>
    <p v-if="project.year">
      {{ project.year }}
    </p>

    <h3>Tipo di progetto</h3>
    <p>
      <span
        class="pill"
        :style="tagStyle"
      >
        {{ project.category || 'Other' }}
      </span>
    </p>

    <h3>Tag</h3>
    <ul
      v-if="project.tag?.length"
      class="tags"
      aria-label="Tag del progetto"
    >
      <li
        v-for="(t, i) in project.tag"
        :key="i"
        class="pill"
        :style="tagStyle"
      >
        {{ t }}
      </li>
      
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()

const project = ref(null)
const loading = ref(true)
const notFound = ref(false)
const activeIndex = ref(0)

/* Helpers */
const isImgUrl = (u) =>
  typeof u === 'string' && /\.(webp|png|jpe?g|gif|avif)$/i.test((u || '').trim())
const normKey = (u) => {
  if (typeof u !== 'string') return ''
  const clean = u.trim().toLowerCase().split('?')[0]
  const file = clean.split('/').pop() || ''
  return file.replace(/\.(webp|png|jpe?g|gif|avif)$/i, '')
}

/* Normalizza gallery */
const galleryPairs = computed(() => {
  const g = project.value?.gallery
  if (!Array.isArray(g)) return []
  return g
    .map((it) => {
      if (it && typeof it === 'object') {
        const hi = it.high_res?.trim?.() || it.low_res?.trim?.() || ''
        const lo = isImgUrl(it.low_res)
          ? it.low_res.trim()
          : isImgUrl(it.high_res)
            ? it.high_res.trim()
            : ''
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

/* Stage: cover + gallery.hi (no duplicati per basename) */
const images = computed(() => {
  if (!project.value) return []
  const out = []
  const added = new Set()

  const cover = (project.value.main_image?.trim?.() || project.value.img || '').trim()
  if (isImgUrl(cover)) {
    out.push({ src: cover, alt: `${project.value.title} – cover` })
    added.add(normKey(cover))
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

/* Thumbs: usa low_res se presente, allineate allo stage */
const thumbs = computed(() => {
  if (!project.value) return []
  const out = []
  const added = new Set()

  const loByKey = new Map()
  for (const p of galleryPairs.value) {
    const lo = isImgUrl(p.lo) ? p.lo : (isImgUrl(p.hi) ? p.hi : '')
    if (!lo) continue
    loByKey.set(normKey(p.hi || lo), lo)
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
    if (added.has(key)) continue
    out.push({ src: candidate, alt: `${project.value.title} – miniatura` })
    added.add(key)
  }

  return out
})

/* Navigazione viewer */
const setActive = (i) => { activeIndex.value = i }
const prev = () => { if (activeIndex.value > 0) activeIndex.value-- }
const next = () => { if (activeIndex.value < images.value.length - 1) activeIndex.value++ }

/* Swipe mobile */
const startX = ref(0), startY = ref(0), deltaX = ref(0)
const SWIPE = { threshold: 45, maxAngle: 60 }
function onTouchStart(e) {
  const t = e.changedTouches?.[0]; if (!t) return
  startX.value = t.clientX; startY.value = t.clientY; deltaX.value = 0
}
function onTouchMove(e) {
  const t = e.changedTouches?.[0]; if (!t) return
  const dx = t.clientX - startX.value; const dy = Math.abs(t.clientY - startY.value)
  deltaX.value = dy < SWIPE.maxAngle ? dx : 0
}
function onTouchEnd() {
  const dx = deltaX.value
  if (Math.abs(dx) >= SWIPE.threshold) { dx < 0 ? next() : prev() }
  deltaX.value = 0
}

/* Pill colore per macro-categoria */
const CATEGORY_COLORS = {
  'Art Direction': { bg: '#fff3bf', bd: '#ffd43b', fg: '#7a5b00' },
  'Web design':    { bg: '#e7f5ff', bd: '#74c0fc', fg: '#1c4f80' },
  'Copywriting':   { bg: '#ffe3e3', bd: '#ffa8a8', fg: '#7a1f1f' },
  'Other':         { bg: '#f1f3f5', bd: '#dee2e6', fg: '#212529' }
}
const tagStyle = computed(() => {
  const cat = project.value?.category
  const c = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other
  return { background: c.bg, border: `1px solid ${c.bd}`, color: c.fg }
})

/* Fetch */
async function fetchProject() {
  loading.value = true
  notFound.value = false
  project.value = null
  activeIndex.value = 0

  const id = String(route.params.id || '').trim()
  if (!id) { notFound.value = true; loading.value = false; return }

  try {
    const snap = await getDoc(doc(db, 'projects', id))
    if (!snap.exists()) { notFound.value = true; return }
    project.value = { id: snap.id, ...snap.data() }
  } catch (e) {
    console.error('Errore nel recupero del documento:', e)
    notFound.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchProject)
watch(() => route.params.id, fetchProject)
</script>

<style scoped>
/* SR only */
.sr-only{
  position:absolute!important;
  width:1px;
  height:1px;
  padding:0;
  margin:-1px;
  overflow:hidden;
  clip:rect(0,0,0,0);
  white-space:nowrap;
  border:0;
}

/* Layout */
.page{
  padding:48px var(--margin-desktop) 112px;
  background:var(--color-surface);
  color:var(--color-text);
}
.container{
  max-width:1200px;
  margin:0 auto;
  position:relative
}
.loading,.notfound{
  padding:160px 0;
  text-align:center;
  opacity:.8
}
.back-link{
  color:var(--color-accent);
  text-decoration:none
}

/* Back (senza bordo) */
.back-btn{
  position:absolute;
  top:-60px;
  left:0;
  width:48px;
  height:48px;
  border-radius:50%;
  border:none;                         /* ← rimosso */
  display:inline-flex;
  align-items:center;
  justify-content:center;
  background:transparent;              /* più “clean” */
  text-decoration:none;
  transition:background-color .2s, transform .1s;
}
.back-btn .icon{
  width:24px;
  height:24px;
  display:block
}
.back-btn:hover{
  background:rgba(0,0,0,.06)
}
.back-btn:active{
  transform:scale(.98)
}
.back-btn:focus-visible{
  outline:3px solid var(--color-accent);
  outline-offset:2px
}

/* Titolo */
.title{
  font-size:clamp(32px,4.2vw,56px);
  line-height:1.1;
  text-align:center;
  margin:56px 0 48px;
  color:var(--color-accent);
}

/* Viewer */
.viewer{
  --viewer-nav:56px;
  --viewer-gap:24px;
  display:grid;
  grid-template-columns:var(--viewer-nav) 1fr var(--viewer-nav);
  align-items:center;
  gap:var(--viewer-gap);
  margin:0 0 56px;
}
.stage{
  border:1px solid #e9ecef;
  border-radius:var(--border-radius-card);
  min-height:420px;
  display:grid;place-items:center;
  overflow:hidden;outline:none;
  touch-action:pan-y;
  background:var(--color-surface);
}
.stage-img{
  width:100%;
  height:auto;
  object-fit:contain
}

/* Nav (senza bordo) */
.nav{
  height:var(--viewer-nav);width:var(--viewer-nav);
  border:none;                        /* ← rimosso */
  border-radius:50%;
  background:transparent;             /* coerente col back */
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:0;transition:background-color .2s, transform .1s;
}
.nav .icon{
  width:24px;
  height:24px;
  display:block;
  pointer-events:none
}
.nav:hover{
  background-color:rgba(0,0,0,.06);
  transform:scale(1.05)
}
.nav:active{
  transform:scale(.95)
}
.nav:disabled{
  opacity:.35;
  cursor:not-allowed
}

/* Thumbs */
.thumbs{
  display:flex;
  gap:40px;
  align-items:center;
  flex-wrap:wrap;
  margin-top:40px;
  margin-bottom:40px;
  margin-left:calc(var(--viewer-nav) + var(--viewer-gap));
  margin-right:calc(var(--viewer-nav) + var(--viewer-gap));
}
.thumb{
  width:112px;height:112px;
  border:1px solid #e9ecef;
  border-radius:var(--border-radius-card);
  overflow:hidden;
  background:var(--color-surface);
  cursor:pointer;
  padding:0;
}
.thumb img{
  width:100%;height:100%;
  object-fit:cover;
  display:block;
  background:var(--color-surface);
}
.thumb.active{
  outline:3px solid  var(--color-accent)
}

/* Meta */
.meta{
  display:grid;
  grid-template-columns:1fr 2fr;
  gap:72px;
  margin-top:16px;
  padding-top:40px;
}
.meta h3{
  font-size:clamp(20px,1.9vw,24px);
  margin:0 0 16px;
  color:var(--color-accent)
}
.desc,.meta .col p{
  font-size:clamp(15px,1.05vw,18px);
  line-height:1.8;
  margin:0 0 14px
}

/* Tag pills */
.tags{
  display:flex;
  gap:12px;
  flex-wrap:wrap;
  align-items:center;
  margin-top:8px;
  list-style:none;
  padding:0
}
.pill{
  padding:8px 12px;
  border-radius:999px;
  font-size:.95rem;
  font-family:var(--font-body);
  line-height:1;
  border:1px solid currentColor
}

/* Mobile */
@media (max-width:768px){
  .page{padding:32px var(--margin-mobile) 96px}
  .viewer{grid-template-columns:1fr;gap:16px;margin-bottom:40px}
  .nav{display:none} /* swipe su mobile */
  .stage{min-height:300px}
  .thumb{width:92px;height:92px}
  .thumbs{gap:16px;margin:0 0 56px}
  .meta{grid-template-columns:1fr;gap:28px;padding-top:28px}
  .back-btn{top:-80px;left:8px}
}
</style>
