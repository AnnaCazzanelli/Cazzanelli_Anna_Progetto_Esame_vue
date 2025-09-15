<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { db } from '@/firebase/config'
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()

const illustration = ref(null)
const loading = ref(true)
const notFound = ref(false)

/* elenco ordinato per prev/next */
const orderedIds = ref([])
const currentIndex = computed(() => orderedIds.value.indexOf(String(route.params.id || '')))

/* fetch singola illustrazione */
async function fetchIllustration() {
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
  }
}

/* fetch ordinamento una sola volta */
async function fetchOrderedIdsOnce() {
  if (orderedIds.value.length) return
  const q = query(collection(db, 'illustrations'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  orderedIds.value = snap.docs.map(d => d.id)
}

/* palette per categoria */
const CATEGORY_COLORS = {
  'Lavoro su commissione': { bg: '#ffe3e9', bd: '#ffa8c0', fg: '#7a1f3a' },
  'Progetto Personale':    { bg: '#fff3bf', bd: '#ffd43b', fg: '#7a5b00' },
  'Pubblicazione':         { bg: '#e5dbff', bd: '#b197fc', fg: '#3b2f7a' },
  'Challenge Artistica':   { bg: '#f3e8ff', bd: '#d0b3ff', fg: '#4a1d7a' },
  Other:                   { bg: '#f1f3f5', bd: '#dee2e6', fg: '#212529' }
}

/* normalizzazione categoria */
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

/* alt */
const altText = computed(() =>
  illustration.value?.title
    ? `Illustrazione: ${illustration.value.title}`
    : 'Illustrazione'
)

/* prev/next */
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
  <main class="page">
    <div
      v-if="loading"
      class="loading"
      role="status"
      aria-live="polite"
    >
      Caricamento illustrazione…
    </div>

    <div
      v-else-if="notFound"
      class="notfound"
    >
      <p>Illustrazione non trovata.</p>
      <RouterLink
        to="/illustrations"
        class="back-link"
      >
        Torna alla sezione illustrazioni
      </RouterLink>
    </div>

    <div
      v-else-if="illustration"
      class="container"
    >
      <RouterLink
        to="/illustrations"
        class="back-btn"
        aria-label="Torna alle illustrazioni"
        title="Torna alle illustrazioni"
      >
        <img
          src="/icone/icon-arrowsx.svg"
          alt=""
          aria-hidden="true"
          class="icon"
        />
        <span class="sr-only">Torna alle illustrazioni</span>
      </RouterLink>

      <h1 class="title">{{ illustration.title }}</h1>

      <section
        class="viewer"
        aria-label="Illustrazione"
        tabindex="0"
        @keydown="onKeydown"
      >
        <button
          class="nav"
          type="button"
          :disabled="currentIndex <= 0"
          aria-label="Illustrazione precedente"
          title="Illustrazione precedente"
          @click="goPrev"
        >
          <img
            src="/icone/icon-prev.svg"
            alt=""
            aria-hidden="true"
            class="icon"
          />
        </button>

        <figure class="stage">
          <img
            :src="illustration.img"
            :alt="altText"
            class="stage-img"
            loading="eager"
          />
        </figure>

        <button
          class="nav"
          type="button"
          :disabled="currentIndex === orderedIds.length - 1"
          aria-label="Illustrazione successiva"
          title="Illustrazione successiva"
          @click="goNext"
        >
          <img
            src="/icone/icon-next.svg"
            alt=""
            aria-hidden="true"
            class="icon"
          />
        </button>
      </section>

      <section
        class="meta"
        aria-label="Dettagli illustrazione"
      >
        <div class="col">
          <h3>Data</h3>
          <p v-if="illustration.year">{{ illustration.year }}</p>

          <h3>Tipo di progetto</h3>
          <p>
            <span
              class="pill"
              :style="pillStyle"
            >
              {{ currentCategory }}
            </span>
          </p>

          <h3>Tag</h3>
          <ul
            v-if="illustration.tag?.length"
            class="tags"
            aria-label="Tag dell’illustrazione"
          >
            <li
              v-for="t in illustration.tag"
              :key="t"
              class="pill"
              :style="pillStyle"
            >
              {{ t }}
            </li>
          </ul>

          <h3>Tecnica (Tools)</h3>
          <p v-if="illustration.tools">{{ illustration.tools }}</p>
        </div>

        <div class="col">
          <h3>Description:</h3>
          <p
            v-if="illustration.description"
            class="desc"
          >
            {{ illustration.description }}
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* SR only */
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

/* Layout */
.page {
  padding: 48px var(--margin-desktop) 112px;
  background: var(--color-surface);
  color: var(--color-text);
}

.container {
  max-width: 1120px;
  margin: 0 auto;
  position: relative;
}

.loading,
.notfound {
  padding: 160px 0;
  text-align: center;
  opacity: .8;
}

.back-link {
  color: var(--color-accent);
  text-decoration: none;
}

/* Back */
.back-btn {
  position: absolute;
  top: -60px; /* più alto del titolo */
  left: 0;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background-color .2s, transform .1s;
}

.back-btn .icon {
  width: 24px;
  height: 24px;
  display: block;
}

.back-btn:hover { background: rgba(0, 0, 0, .06); }
.back-btn:active { transform: scale(.98); }
.back-btn:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

/* Titolo */
.title {
  font-size: clamp(32px, 4.2vw, 56px);
  line-height: 1.1;
  text-align: center;
  margin: 56px 0 40px;
  color: var(--color-accent);
}

/* Viewer singola immagine + prev/next */
.viewer {
  --viewer-nav: 56px;
  --viewer-gap: 24px;
  display: grid;
  grid-template-columns: var(--viewer-nav) 1fr var(--viewer-nav);
  align-items: center;
  gap: var(--viewer-gap);
  margin-bottom: 56px;
}

.stage {
  background: var(--color-surface);
  min-height: 420px;
  display: grid;
  place-items: center;
  overflow: hidden;
}

/* 🔧 Immagine: proporzioni SEMPRE rispettate (no crop) */
.stage-img {
  width: auto;
  max-width: 100%;
  height: clamp(360px, 62vh, 720px); /* desktop/tablet responsivo */
  max-height: 80vh;
  object-fit: contain;               /* niente tagli */
  display: block;
}

.nav {
  height: var(--viewer-nav);
  width: var(--viewer-nav);
  border: none;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color .2s, transform .1s;
}

.nav .icon {
  width: 24px;
  height: 24px;
  display: block;
  pointer-events: none;
}

.nav:hover { background: rgba(0, 0, 0, .06); transform: scale(1.05); }
.nav:active { transform: scale(.95); }
.nav:disabled { opacity: .35; cursor: not-allowed; }

/* Meta */
.meta {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 72px;
  margin-top: 16px;
}

.meta h3 {
  font-size: clamp(20px, 1.9vw, 24px);
  margin: 0 0 12px;
  color: var(--color-accent);
}

.meta .col p,
.desc {
  font-size: clamp(15px, 1.05vw, 18px);
  line-height: 1.8;
  margin: 0 0 14px;
  color: var(--color-text);
}

/* Tag pills */
.tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin: 0 0 14px;
  list-style: none;
  padding: 0;
}

.pill {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid currentColor;
  font-size: .95rem;
  line-height: 1;
}

/* Mobile */
@media (max-width: 768px) {
  .page { padding: 32px var(--margin-mobile) 96px; }

  .viewer {
    grid-template-columns: 1fr;      /* frecce sopra/sotto o nascoste */
    gap: 16px;
    margin-bottom: 40px;
  }

  .nav { display: none; }            /* se vuoi tenerle anche su mobile, rimuovi questa riga */

  .stage {
    min-height: 300px;
    padding: 8px 0;                  /* respiro verticale */
  }

  /* 🔧 Mobile: scala l’immagine senza tagliare */
  .stage-img {
    width: 100%;
    height: auto;
    max-height: 70vh;
    object-fit: contain;
  }

  .meta {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .back-btn { top: -80px; left: 8px; }
}
</style>
