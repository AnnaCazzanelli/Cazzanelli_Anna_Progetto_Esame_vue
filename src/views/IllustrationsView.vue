<script setup>
import { ref, onMounted, inject } from 'vue'
import { collection, query, getDocs, orderBy } from 'firebase/firestore'

const db = inject('firestore')
const illustrations = ref([])

/* Palette per categoria */
const CATEGORY_COLORS = {
  'Lavoro su commissione': { bg: '#ffe3e9', bd: '#ffa8c0', fg: '#7a1f3a' },
  'Progetto Personale':    { bg: '#fff3bf', bd: '#ffd43b', fg: '#7a5b00' },
  'Pubblicazione':         { bg: '#e5dbff', bd: '#b197fc', fg: '#3b2f7a' },
  'Challenge Artistica':   { bg: '#f3e8ff', bd: '#d0b3ff', fg: '#4a1d7a' },
  Other:                   { bg: '#f1f3f5', bd: '#dee2e6', fg: '#212529' },
}

/* Normalizza il testo della categoria */
function normalizeCategory (raw) {
  const s = String(raw || '').trim()
  if (/commissione/i.test(s))   return 'Lavoro su commissione'
  if (/personale/i.test(s))     return 'Progetto Personale'
  if (/pubblicazione/i.test(s)) return 'Pubblicazione'
  if (/challenge/i.test(s))     return 'Challenge Artistica'
  return s in CATEGORY_COLORS ? s : 'Other'
}

/* Stile delle pill in base alla categoria */
function tagStyle (category) {
  const key = normalizeCategory(category)
  const c = CATEGORY_COLORS[key] || CATEGORY_COLORS.Other
  return {
    background: c.bg,
    border:     `1px solid ${c.bd}`,
    color:      c.fg,
  }
}

async function getIllustrations () {
  const col = collection(db, 'illustrations')
  const q   = query(col, orderBy('order', 'asc'))
  const rs  = await getDocs(q)

  const items = []
  rs.forEach((doc) => {
    items.push({ ...doc.data(), id: doc.id })
  })
  illustrations.value = items
}

/* Helpers accessibilità */
function ariaLabelFor (item) {
  const tags =
    Array.isArray(item.tag) && item.tag.length
      ? `. Tag: ${item.tag.join(', ')}.`
      : ''
  return `Apri l’illustrazione “${item.title}”${tags}`
}

function altFor (item) {
  return `Illustrazione: ${item.title}`
}

onMounted(() => {
  getIllustrations()
})
</script>

<template>
  <main class="page-content" aria-labelledby="page-title">
    <div class="illustrations-container">
      <!-- HERO decorativa -->
      <section
        class="hero-container"
        role="region"
        aria-labelledby="page-title"
      >
        <div class="hero-image-container" aria-hidden="true"></div>

        <div class="header-content-wrapper">
          <h1 id="page-title">Illustrazioni</h1>
        </div>
      </section>

      <!-- GRID -->
      <section class="illustration-content-wrapper">
        <div
          class="illustration-grid"
          role="list"
          aria-describedby="page-title"
        >
          <RouterLink
            v-for="illustration in illustrations"
            :key="illustration.id"
            class="illustration-item"
            role="listitem"
            :to="{
              name: 'illustration-details',
              params: { id: illustration.id },
            }"
            :aria-label="ariaLabelFor(illustration)"
            :title="`Apri: ${illustration.title}`"
          >
            <!-- immagine + pill di categoria -->
            <figure class="media">
              <img
                :src="illustration.img"
                :alt="altFor(illustration)"
                loading="lazy"
              />
              <figcaption
                class="cat-badge"
                :style="tagStyle(illustration.category)"
                aria-hidden="true"
              >
                {{ normalizeCategory(illustration.category) }}
              </figcaption>
            </figure>

            <div class="illustration-details">
              <h3 class="title">
                {{ illustration.title }}
              </h3>

              <div
                v-if="illustration.tag?.length"
                class="illustration-tags"
                aria-label="Tag dell’illustrazione"
              >
                <span
                  v-for="tag in illustration.tag"
                  :key="tag"
                  class="tag"
                  :style="tagStyle(illustration.category)"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* struttura */
.illustrations-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
}

/* hero */
.hero-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  
}
.hero-image-container {
  position: absolute;
  inset: 0;
  background-image: url('/images/illustration/copertina/illustration_lightmode.png');
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

/* grid */
.illustration-content-wrapper {
  width: 100%;
  max-width: 1400px;
}
.illustration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 4rem;
  padding: 2rem 0;
}

/* card (RouterLink) */
.illustration-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: inherit;
  outline: none;
}
.illustration-item:focus-visible {
  outline: 3px solid #94b7ff;
  outline-offset: 4px;
  border-radius: 10px;
}

/* figure con pill di categoria */
.media {
  position: relative;
  margin: 0;
}
.media img {
  max-width: 100%;
  height: auto;
  display: block; /* nessuna modifica alle dimensioni */
}
.cat-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid currentColor; /* visibilità su fondi chiari */
  backdrop-filter: saturate(120%) blur(2px);
  user-select: none;
}

/* dettagli sotto */
.illustration-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: medium;
  margin: 1rem 0 0.5rem 0;
}

/* tag */
.illustration-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.5rem;
}
.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.8rem;
  border: 1px solid currentColor;
}

/* dark mode hero */
body.dark-mode .hero-image-container {
  background-image: url('/images/illustration/copertina/illustration_darkmode.png');
}

/* mobile */
@media (max-width: 768px) {
  .illustration-grid {
    grid-template-columns: 1fr;
  }
  .hero-image-container {
    background-position: right top;
    transform: translateY(-10%);
    opacity: 0.9;
  }
  
}
</style>
