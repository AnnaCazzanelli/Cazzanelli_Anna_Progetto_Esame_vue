<script setup>
import { ref, onMounted, inject, nextTick } from 'vue'
import { collection, query, getDocs, orderBy } from 'firebase/firestore'

/* Firestore via provide/inject */
const db = inject('firestore')

/* Elenco illustrazioni */
const illustrations = ref([])

/* ==========================================================================
   Scroll iniziale
   - Garantisce l’avvio view dall’inizio pagina
   ========================================================================== */
window.scrollTo({ top: 0, left: 0, behavior: 'instant' })


/* Stile badge per categoria */
const CATEGORY_COLORS = {
  'Lavoro su commissione': { bg: '#ffe3e9', bd: '#ffa8c0', fg: '#7a1f3a' },
  'Progetto Personale':    { bg: '#fff3bf', bd: '#ffd43b', fg: '#7a5b00' },
  'Pubblicazione':         { bg: '#e5dbff', bd: '#b197fc', fg: '#3b2f7a' },
  'Challenge Artistica':   { bg: '#f3e8ff', bd: '#d0b3ff', fg: '#4a1d7a' },
  Other:                   { bg: '#f1f3f5', bd: '#dee2e6', fg: '#212529' }
}

function normalizeCategory (raw) {
  const s = String(raw || '').trim()
  if (/commissione/i.test(s))   return 'Lavoro su commissione'
  if (/personale/i.test(s))     return 'Progetto Personale'
  if (/pubblicazione/i.test(s)) return 'Pubblicazione'
  if (/challenge/i.test(s))     return 'Challenge Artistica'
  return s in CATEGORY_COLORS ? s : 'Other'
}

function tagStyle (category) {
  const key = normalizeCategory(category)
  const c = CATEGORY_COLORS[key] || CATEGORY_COLORS.Other
  return {
    background: c.bg,
    border:     `1px solid ${c.bd}`,
    color:      c.fg
  }
}

/* Fetch illustrazioni e tilt decorativo */
async function getIllustrations () {
  const col = collection(db, 'illustrations')
  const q   = query(col, orderBy('order', 'asc'))
  const rs  = await getDocs(q)

  const items = []
  rs.forEach((doc) => items.push({ ...doc.data(), id: doc.id }))
  illustrations.value = items

  await nextTick()
  document.querySelectorAll('.illustration-item').forEach((el) => {
    const tilt = (Math.random() * 2.4 - 1.2).toFixed(2)
    el.style.setProperty('--tilt', `${tilt}deg`)
    el.style.setProperty('--hover-tilt', '1.6deg')
  })
}

/*  Accessibilità: 
   - ariaLabelFor: etichetta descrittiva del link al progetto.
   - altFor: descrizione immagine di copertina. */
function ariaLabelFor (item) {
  const tags = Array.isArray(item.tag) && item.tag.length
    ? `. Tag: ${item.tag.join(', ')}.`
    : ''
  return `Apri l’illustrazione “${item.title}”${tags}`
}
function altFor (item) {
  return `Illustrazione: ${item.title}`
}

/* Lifecycle */
onMounted(getIllustrations)
</script>

<template>
  <main class="page-content" aria-labelledby="page-title">
    <div class="illustrations-container flex flex-col items-center py-4">

      <!-- HERO -->
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
          <h1 id="page-title">Illustrazioni</h1>
        </div>
      </section>

      <!-- GRID elenco illustrazioni -->
      <section class="illustration-content-wrapper w-full max-w-[1400px]">
        <div
          class="illustration-grid grid gap-12 py-8"
          role="list"
          aria-describedby="page-title"
        >
          <RouterLink
            v-for="illustration in illustrations"
            :key="illustration.id"
            class="illustration-item flex flex-col items-center text-center no-underline outline-none"
            role="listitem"
            :to="{ name: 'illustration-details', params: { id: illustration.id } }"
            :aria-label="ariaLabelFor(illustration)"
            :title="`Apri: ${illustration.title}`"
          >
            <figure class="media relative m-0">
              <img
                :src="illustration.img"
                :alt="altFor(illustration)"
                loading="lazy"
                class="block max-w-full h-auto"
              />
              <figcaption
                class="cat-badge absolute top-2.5 left-2.5 px-2.5 py-1 text-[0.75rem] font-semibold select-none"
                :style="tagStyle(illustration.category)"
                aria-hidden="true"
              >
                {{ normalizeCategory(illustration.category) }}
              </figcaption>
            </figure>

            <div class="illustration-details flex flex-col items-center">
              <h3 class="title mt-4 mb-2">
                {{ illustration.title }}
              </h3>

              <div
                v-if="illustration.tag?.length"
                class="illustration-tags flex flex-wrap justify-center gap-1.5 mt-2"
                aria-label="Tag dell’illustrazione"
              >
                <span
                  v-for="tag in illustration.tag"
                  :key="tag"
                  class="tag px-2 py-1 text-[0.8rem]"
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


/* Hero: background image + dark mode */
.hero-image-container {
  background-image: url('/images/illustration/copertina/illustration_lightmode.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right center;
  transform: translateY(-8%);
}
body.dark-mode .hero-image-container {
  background-image: url('/images/illustration/copertina/illustration_darkmode.png');
}

/* Wrapper titolo: centratura verticale e padding inline responsivo */
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

/* H1 responsivo su tablet/mobile (desktop via token) */
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

/* Griglia: 3/2/1 colonne con densità e fix ultimi elementi */
.illustration-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-flow: dense;
}
@media (min-width: 1200px) {
  .illustration-grid > .illustration-item:nth-child(8n + 1),
  .illustration-grid > .illustration-item:nth-child(8n + 5) {
    grid-column: span 2;
  }
  .illustration-grid > .illustration-item:last-child:nth-child(3n + 1) {
    grid-column: 1 / -1 !important;
  }
  .illustration-grid > .illustration-item:nth-last-child(2):nth-child(3n + 1),
  .illustration-grid > .illustration-item:last-child:nth-child(3n + 2) {
    grid-column: span 1 !important;
  }
}
@media (max-width: 1199px) and (min-width: 769px) {
  .illustration-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .illustration-grid > .illustration-item:nth-child(6n + 1) {
    grid-column: span 2;
  }
  .illustration-grid > .illustration-item:last-child:nth-child(2n + 1) {
    grid-column: 1 / -1 !important;
  }
}
@media (max-width: 768px) {
  .illustration-grid {
    grid-template-columns: 1fr;
  }
}

/* Card: base e focus */
.illustration-item {
  --tilt: 0deg;
  --hover-tilt: 1.5deg;
  --lift: 8px;
  will-change: transform;
}
.illustration-item:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 6px;
}

/* Media: figura + immagine + badge categoria */
.media {
  transform: rotate(var(--tilt));
  transition:
    transform 220ms ease,
    filter 220ms ease;
}
.media img {
  border: 1px solid rgba(var(--text-rgb) / 0.12);
  box-shadow:
    0 1px 2px rgba(var(--text-rgb) / 0.20),
    0 8px 20px rgba(var(--text-rgb) / 0.12);
  background: var(--color-surface);
}
.cat-badge {
  border: 1px solid currentColor;
  backdrop-filter: saturate(120%) blur(2px);
  border-radius: 9999px;
}

/* Hover/focus: leggera rotazione, lift e lieve incremento di contrasto */
.illustration-item:hover .media,
.illustration-item:focus-visible .media {
  transform:
    rotate(calc(var(--tilt) + var(--hover-tilt)))
    translateY(calc(-1 * var(--lift)))
    scale(1.02);
  filter: contrast(1.03) saturate(1.02);
}

/* Mobile: disattiva trasformazioni per stabilità */
@media (max-width: 768px) {
  .media {
    transform: none !important;
  }
  .illustration-item:hover .media,
  .illustration-item:focus-visible .media {
    transform: none !important;
    filter: none !important;
  }
}

/* Tipografia titolo e stile tag */
.title {
  font-size: 18pt;
  line-height: 27pt;
}
.tag {
  border: 1px solid currentColor;
  border-radius: 9999px;
}

/* Hero: fine-tuning su tablet e mobile */
@media (max-width: 1024px) and (min-width: 769px) {
  .hero-image-container {
    background-position: right center;
    transform: translateY(-10%);
    opacity: 0.95;
  }
}
@media (max-width: 768px) {
  .hero-image-container {
    background-position: right top;
    transform: translateY(-10%);
    opacity: 0.9;
  }
}

/* Reduced motion: rimuove animazioni/transizioni non essenziali */
@media (prefers-reduced-motion: reduce) {
  .media {
    transition: none;
  }
  .illustration-item:hover .media,
  .illustration-item:focus-visible .media {
    transform: none;
    filter: none;
  }
}
</style>
