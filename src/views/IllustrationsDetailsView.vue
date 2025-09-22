<!-- src/pages/IllustrationDetailView.vue -->
<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { db } from '@/firebase/config'
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()

const illustration = ref(null)
const loading = ref(true)
const notFound = ref(false)

const orderedIds = ref([])
const currentIndex = computed(() => orderedIds.value.indexOf(String(route.params.id || '')))

async function fetchIllustration() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

  loading.value = true
  notFound.value = false
  illustration.value = null

  const id = String(route.params.id || '').trim()
  if (!id) { notFound.value = true; loading.value = false; return }

  try {
    const snap = await getDoc(doc(db, 'illustrations', id))
    if (!snap.exists()) { notFound.value = true; return }
    illustration.value = { id: snap.id, ...snap.data() }
  } catch (e) {
    console.error('Errore nel recupero illustrazione:', e)
    notFound.value = true
  } finally {
    loading.value = false
    await nextTick()
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }
}

async function fetchOrderedIdsOnce() {
  if (orderedIds.value.length) return
  const q = query(collection(db, 'illustrations'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  orderedIds.value = snap.docs.map(d => d.id)
}

const CATEGORY_COLORS = {
  'Lavoro su commissione': { bg: '#ffe3e9', bd: '#ffa8c0', fg: '#7a1f3a' },
  'Progetto Personale':    { bg: '#fff3bf', bd: '#ffd43b', fg: '#7a5b00' },
  'Pubblicazione':         { bg: '#e5dbff', bd: '#b197fc', fg: '#3b2f7a' },
  'Challenge Artistica':   { bg: '#f3e8ff', bd: '#d0b3ff', fg: '#4a1d7a' },
  Other:                   { bg: '#f1f3f5', bd: '#dee2e6', fg: '#212529' }
}
const currentCategory = computed(() => {
  const raw = (illustration.value?.category || '').trim()
  if (/commissione/i.test(raw))   return 'Lavoro su commissione'
  if (/personale/i.test(raw))     return 'Progetto Personale'
  if (/pubblicazione/i.test(raw)) return 'Pubblicazione'
  if (/challenge/i.test(raw))     return 'Challenge Artistica'
  return raw in CATEGORY_COLORS ? raw : 'Other'
})
const pillStyle = computed(() => {
  const c = CATEGORY_COLORS[currentCategory.value] || CATEGORY_COLORS.Other
  return { background: c.bg, border: `1px solid ${c.bd}`, color: c.fg }
})

const altText = computed(() =>
  illustration.value?.title
    ? `Illustrazione: ${illustration.value.title}`
    : 'Illustrazione'
)

function goPrev() {
  if (currentIndex.value > 0) {
    const target = orderedIds.value[currentIndex.value - 1]
    router.push({ name: 'illustration-details', params: { id: target } })
  }
}
function goNext() {
  if (currentIndex.value >= 0 && currentIndex.value < orderedIds.value.length - 1) {
    const target = orderedIds.value[currentIndex.value + 1]
    router.push({ name: 'illustration-details', params: { id: target } })
  }
}
function onKeydown(e) {
  if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
  if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
}

onMounted(async () => {
  await Promise.all([fetchOrderedIdsOnce(), fetchIllustration()])
})
watch(() => route.params.id, fetchIllustration)
</script>

<template>
  <main class="page bg-surface text-text">
    <!-- Loading -->
    <div v-if="loading" class="loading text-center opacity-80 py-40" role="status" aria-live="polite">
      Caricamento illustrazione…
    </div>

    <!-- Not Found -->
    <div v-else-if="notFound" class="notfound text-center opacity-80 py-40">
      <p>Illustrazione non trovata.</p>
      <RouterLink to="/illustrations" class="back-link text-accent no-underline">
        Torna alla sezione illustrazioni
      </RouterLink>
    </div>

    <!-- OK -->
    <div v-else-if="illustration" class="container max-w-[1120px] mx-auto relative">
      <!-- Back -->
      <RouterLink
        to="/illustrations"
        class="back-btn absolute -top-[60px] left-0 w-12 h-12 bg-transparent inline-flex items-center justify-center no-underline transition
               hover:bg-black/5 dark:hover:bg-white/10 hover:scale-105 active:scale-95
               focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
        aria-label="Torna alle illustrazioni"
        title="Torna alle illustrazioni"
      >
        <img src="/icone/icon-arrowsx.svg" alt="" aria-hidden="true" class="icon w-6 h-6 block" />
        <span class="sr-only">Torna alle illustrazioni</span>
      </RouterLink>

      <!-- Titolo -->
      <h1 class="title text-accent text-center">
        {{ illustration.title }}
      </h1>

      <!-- Viewer -->
      <section
        class="viewer grid items-center gap-6 mb-14"
        aria-label="Illustrazione"
        tabindex="0"
        @keydown="onKeydown"
      >
        <!-- Prev -->
        <button
          class="nav w-12 h-12 bg-transparent inline-flex items-center justify-center transition
                 hover:bg-black/5 dark:hover:bg-white/10 hover:scale-105 active:scale-95
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]
                 disabled:opacity-35 disabled:hover:scale-100 disabled:hover:bg-transparent"
          type="button"
          :disabled="currentIndex <= 0"
          aria-label="Illustrazione precedente"
          title="Illustrazione precedente"
          @click="goPrev"
        >
          <img src="/icone/icon-prev.svg" alt="" aria-hidden="true" class="icon w-6 h-6 block pointer-events-none" />
        </button>

        <!-- Stage -->
        <figure class="stage bg-[var(--color-surface)] min-h-[420px] grid place-items-center overflow-hidden">
          <img
            :src="illustration.img"
            :alt="altText"
            class="stage-img block w-auto max-w-full"
            loading="eager"
          />
        </figure>

        <!-- Next -->
        <button
          class="nav w-12 h-12 bg-transparent inline-flex items-center justify-center transition
                 hover:bg-black/5 dark:hover:bg-white/10 hover:scale-105 active:scale-95
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]
                 disabled:opacity-35 disabled:hover:scale-100 disabled:hover:bg-transparent"
          type="button"
          :disabled="currentIndex === orderedIds.length - 1"
          aria-label="Illustrazione successiva"
          title="Illustrazione successiva"
          @click="goNext"
        >
          <img src="/icone/icon-next.svg" alt="" aria-hidden="true" class="icon w-6 h-6 block pointer-events-none" />
        </button>
      </section>

      <!-- Meta -->
      <section class="meta grid gap-[72px] mt-4" aria-label="Dettagli illustrazione">
        <div class="col">
          <h3 class="text-accent">Data</h3>
          <p v-if="illustration.year">{{ illustration.year }}</p>

          <h3 class="text-accent">Tipo di progetto</h3>
          <p>
            <span class="pill" :style="pillStyle">
              {{ currentCategory }}
            </span>
          </p>

          <h3 class="text-accent">Tag</h3>
          <ul v-if="illustration.tag?.length" class="tags" aria-label="Tag dell’illustrazione">
            <li v-for="t in illustration.tag" :key="t" class="pill" :style="pillStyle">
              {{ t }}
            </li>
          </ul>

          <h3 class="text-accent">Tecnica (Tools)</h3>
          <p v-if="illustration.tools">{{ illustration.tools }}</p>
        </div>

        <div class="col">
          <h3 class="text-accent">Description:</h3>
          <p v-if="illustration.description" class="desc">
            {{ illustration.description }}
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.sr-only{
  position:absolute!important;
  width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;
}

/* Layout */
.page{ padding:48px var(--margin-desktop) 112px; }
@media (max-width:768px){ .page{ padding:32px var(--margin-mobile) 96px; } }

.title{ font-size:clamp(32px,4.2vw,56px); line-height:1.1; margin:56px 0 40px; }

/* Viewer */
.viewer{ grid-template-columns: 48px 1fr 48px; }
@media (max-width:768px){
  .viewer{ grid-template-columns:1fr; gap:16px; margin-bottom:40px; }
  .nav{ display:none; }
}

.stage-img{
  height:clamp(360px,62vh,720px);
  max-height:80vh;
  object-fit:contain;
}
@media (max-width:768px){
  .stage{ min-height:300px; padding:8px 0; }
  .stage-img{ width:100%; height:auto; max-height:70vh; }
}

/* Meta */
.meta{ grid-template-columns:1fr 2fr; }
@media (max-width:768px){ .meta{ grid-template-columns:1fr; gap:28px; } }

.meta h3{ font-size:clamp(20px,1.9vw,24px); margin:0 0 12px; color:var(--color-accent); }
.desc, .meta .col p{ font-size:clamp(15px,1.05vw,18px); line-height:1.8; margin:0 0 14px; }

.tags{ display:flex; gap:12px; flex-wrap:wrap; align-items:center; margin:0 0 14px; list-style:none; padding:0; }
.pill{ padding:8px 12px; border-radius:999px; font-size:.95rem; font-family:var(--font-body); line-height:1; border:1px solid currentColor; }
</style>
