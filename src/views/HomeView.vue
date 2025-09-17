<script setup>
import { RouterLink } from 'vue-router'
import Handwave from '@/components/Handwave.vue'

import { ref, computed, onMounted, nextTick, onBeforeUnmount, watch } from 'vue'
import { db } from '@/firebase/config'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'

/* ---------------- State ---------------- */
const loading = ref(true)
const error = ref(null)
const projects = ref([])        // max 4 elementi
const illustrations = ref([])   // max 6 elementi

/* ---------------- Slider (Progetti) ---------------- */
const projViewport = ref(null)
const projTrack   = ref(null)
const projIndex   = ref(0)

const CARD_GAP = 14
const cardWidth     = ref(0)
const visibleCount  = ref(1)

/* computed per il disable (progetti) */
const projMaxIndex      = computed(() => Math.max(0, (projects.value.length || 0) - visibleCount.value))
const projPrevDisabled  = computed(() => projIndex.value <= 0)
const projNextDisabled  = computed(() => projIndex.value >= projMaxIndex.value)

/* ---- Firestore (Progetti) ---- */
async function fetchProjects () {
  const q = query(
    collection(db, 'projects'),
    where('featured', '==', true),
    orderBy('priority', 'asc'),
    limit(4)
  )
  const snap = await getDocs(q)
  projects.value = snap.docs.map(d => ({
    firestoreId: d.id,
    ...d.data()
  }))
}

/* ---- Misure + movimento (Progetti) ---- */
function measureCarousel () {
  const vp = projViewport.value
  const tr = projTrack.value
  if (!vp || !tr) return

  const first = tr.querySelector('.card')
  if (!first) { cardWidth.value = 0; visibleCount.value = 1; return }

  cardWidth.value = Math.max(1, Math.round(first.getBoundingClientRect().width))
  const vpWidth = Math.max(1, Math.round(vp.getBoundingClientRect().width))
  visibleCount.value = Math.max(1, Math.floor((vpWidth + CARD_GAP) / (cardWidth.value + CARD_GAP)))

  projIndex.value = Math.min(projIndex.value, projMaxIndex.value)
  applyTransform()
}
function applyTransform () {
  const tr = projTrack.value
  if (!tr) return
  const step = cardWidth.value + CARD_GAP
  tr.style.transform = `translateX(${-projIndex.value * step}px)`
}
function prevProj () {
  if (!projPrevDisabled.value) { projIndex.value -= 1; applyTransform() }
}
function nextProj () {
  if (!projNextDisabled.value) { projIndex.value += 1; applyTransform() }
}

/* ---------------- Slider (Illustrazioni) ---------------- */
/* Scorrimento a “snap” per card (larghezze variabili) */
const illViewport   = ref(null)
const illTrack      = ref(null)
/* lista offset di snap (px) e indice corrente */
const illSnaps      = ref([])   // es. [0, 210, 540, ...]
const illSnapIndex  = ref(0)

/* computed per il disable (illustrazioni) */
const illPrevDisabled = computed(() => illSnapIndex.value <= 0)
const illNextDisabled = computed(() => illSnapIndex.value >= Math.max(0, illSnaps.value.length - 1))

/* ---- Firestore (Illustrazioni) ---- */
async function fetchIllustrations () {
  const q = query(
    collection(db, 'illustrations'),
    where('featured', '==', true),
    orderBy('priority', 'asc'),
    limit(6)
  )
  const snap = await getDocs(q)
  illustrations.value = snap.docs.map(d => ({
    firestoreId: d.id,
    ...d.data()
  }))
}

/* ---- Misure + movimento (Illustrazioni) ---- */
function measureIllCarousel () {
  const vp = illViewport.value
  const tr = illTrack.value
  if (!vp || !tr) return

  const vpWidth    = Math.round(vp.clientWidth)
  const trackWidth = Math.round(tr.scrollWidth)
  const maxOffset  = Math.max(0, trackWidth - vpWidth)

  // Calcola gli snap allineando la SINISTRA di ogni card al bordo sinistro del viewport,
  // clampando per non superare maxOffset (ultime card consolidate allo stesso snap).
  const children = Array.from(tr.children)
  const rawSnaps = children.map(el => Math.min(el.offsetLeft, maxOffset))

  // De-duplica e ordina (può capitare che più card mappino allo stesso maxOffset)
  const unique = [...new Set(rawSnaps)].sort((a, b) => a - b)
  illSnaps.value = unique

  // Trova lo snap più vicino all’offset corrente (se già impostato)
  const current = illSnaps.value[illSnapIndex.value] ?? 0
  const nearestIndex = nearestSnapIndex(current, illSnaps.value)
  illSnapIndex.value = Math.min(nearestIndex, Math.max(0, illSnaps.value.length - 1))

  applyIllTransform()
}
function nearestSnapIndex(value, snaps) {
  if (!snaps.length) return 0
  let best = 0
  let bestDist = Math.abs(snaps[0] - value)
  for (let i = 1; i < snaps.length; i++) {
    const d = Math.abs(snaps[i] - value)
    if (d < bestDist) { best = i; bestDist = d }
  }
  return best
}
function applyIllTransform () {
  const tr = illTrack.value
  if (!tr || !illSnaps.value.length) return
  const offset = illSnaps.value[illSnapIndex.value] || 0
  tr.style.transform = `translateX(${-offset}px)`
}
function prevIll () {
  if (!illPrevDisabled.value) {
    illSnapIndex.value -= 1
    applyIllTransform()
  }
}
function nextIll () {
  if (!illNextDisabled.value) {
    illSnapIndex.value += 1
    applyIllTransform()
  }
}

/* ---- Lifecycle ---- */
let onResize
onMounted(async () => {
  try {
    await Promise.all([fetchProjects(), fetchIllustrations()])
    await nextTick()
    measureCarousel()
    measureIllCarousel()
    onResize = () => { measureCarousel(); measureIllCarousel() }
    window.addEventListener('resize', onResize, { passive: true })
    // rimesura dopo il layout delle immagini
    setTimeout(() => { measureCarousel(); measureIllCarousel() }, 120)
  } catch (e) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
})
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
watch(projects,        async () => { await nextTick(); measureCarousel() })
watch(illustrations,   async () => { await nextTick(); measureIllCarousel() })
</script>

<template>
  <main class="home" aria-labelledby="home-title">
    <!-- ================= HERO (invariata) ================= -->
    <section class="hero" role="region" aria-labelledby="home-title">
      <article class="intro">
        <h1 id="home-title" class="title">Ciao</h1>
        <h2 class="subtitle">Sono Anna Cazzanelli</h2>
        <h3 class="role">Digital Designer &amp; Illustratrice</h3>
        <p class="payoff">Se vuoi saperne di più di me</p>
        <RouterLink
          to="/about"
          class="cta"
          aria-label="Vai alla pagina About per saperne di più su Anna Cazzanelli"
          title="Scopri di più"
        >
          Clicca qui
        </RouterLink>
      </article>

      <div class="hand-wrap" aria-hidden="true">
        <Handwave :canvas-width="900" :canvas-height="900" />
      </div>
    </section>

    <!-- ================= CAROSELLO PROGETTI ================= -->
    <section class="carousel-section-projects-carousel" role="region" aria-labelledby="projects-title">
      <h2 id="projects-title" class="section-title">Alcuni progetti di Digital Design</h2>

      <div v-if="loading" class="carousel-loading" role="status" aria-live="polite">Caricamento…</div>
      <p v-else-if="error" class="carousel-error" role="alert">{{ error }}</p>

      <div v-else class="carousel-wrap" aria-label="Carosello progetti selezionati">
        <button
          class="nav prev"
          type="button"
          @click="prevProj"
          :disabled="projPrevDisabled"
          aria-label="Progetto precedente"
          title="Precedente"
        >
          <img src="/icone/icon-prev.svg" class="icon" alt="" />
        </button>

        <div class="carousel-viewport" ref="projViewport">
          <div class="carousel-track" ref="projTrack">
            <RouterLink
              v-for="p in projects"
              :key="p.firestoreId"
              class="card"
              :to="{ name: 'project-details', params: { id: p.firestoreId } }"
              :aria-label="`Apri progetto: ${p.title || p.firestoreId}`"
              :title="`Apri progetto: ${p.title || 'Senza titolo'}`"
            >
              <figure class="card-frame" aria-label="Anteprima progetto">
                <img
                  :src="p.img || p.main_image"
                  :alt="p.title ? `Anteprima progetto: ${p.title}` : 'Anteprima progetto'"
                  loading="lazy"
                />
              </figure>
              <h3 class="card-title">{{ p.title || 'Senza titolo' }}</h3>
            </RouterLink>
          </div>
        </div>

        <button
          class="nav next"
          type="button"
          @click="nextProj"
          :disabled="projNextDisabled"
          aria-label="Prossimo progetto"
          title="Successivo"
        >
          <img src="/icone/icon-next.svg" class="icon" alt="" />
        </button>
      </div>

      <div class="section-cta-projects">
        <RouterLink
          to="/projects"
          class="cta-see-all"
          aria-label="Vai alla pagina Progetti per vedere tutto"
          title="Vedi tutti i progetti"
        >
          <span>Scopri di più</span>
          <img src="/icone/icon-arrowdx.svg" class="icon" alt="" />
        </RouterLink>
      </div>
    </section>

    <!-- ================= CAROSELLO ILLUSTRAZIONI ================= -->
    <section class="carousel-section-illustrations-carousel" role="region" aria-labelledby="illustrations-title">
      <h2 id="illustrations-title" class="section-title">Alcune illustrazioni</h2>

      <div v-if="loading" class="carousel-loading" role="status" aria-live="polite">Caricamento…</div>
      <p v-else-if="error" class="carousel-error" role="alert">{{ error }}</p>

      <div v-else class="carousel-wrap" aria-label="Carosello illustrazioni selezionate">
        <button
          class="nav prev"
          type="button"
          @click="prevIll"
          :disabled="illPrevDisabled"
          aria-label="Illustrazione precedente"
          title="Precedente"
        >
          <img src="/icone/icon-prev.svg" class="icon" alt="" />
        </button>

        <div class="carousel-viewport" ref="illViewport">
          <div class="carousel-track" ref="illTrack">
            <RouterLink
              v-for="i in illustrations"
              :key="i.firestoreId"
              class="card-illustration"
              :to="{ name: 'illustration-details', params: { id: i.firestoreId } }"
              :aria-label="`Apri illustrazione: ${i.title || i.firestoreId}`"
              :title="`Apri illustrazione: ${i.title || 'Senza titolo'}`"
            >
              <img
                :src="i.img || i.main_image"
                :alt="i.title ? `Anteprima illustrazione: ${i.title}` : 'Anteprima illustrazione'"
                loading="lazy"
              />
            </RouterLink>
          </div>
        </div>

        <button
          class="nav next"
          type="button"
          @click="nextIll"
          :disabled="illNextDisabled"
          aria-label="Prossima illustrazione"
          title="Successivo"
        >
          <img src="/icone/icon-next.svg" class="icon" alt="" />
        </button>
      </div>

      <div class="section-cta-projects">
        <RouterLink
          to="/illustrations"
          class="cta-see-all"
          aria-label="Vai alla pagina Illustrazioni per vedere tutto"
          title="Vedi tutte le illustrazioni"
        >
          <span>Scopri di più</span>
          <img src="/icone/icon-arrowdx.svg" class="icon" alt="" />
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ---------------- Base ---------------- */
.home{
  padding-top: 8px;
  padding-bottom: 64px;
  background: var(--color-surface);
  color: var(--color-text);
}

/* 2 colonne SEMPRE (testo | mano) */
.hero{
  max-width: 1280px;
  margin-left: var(--margin-desktop);
  margin-right: var(--margin-desktop);
  padding-top: 32px;
  padding-bottom: 56px;
  display: grid;
  grid-template-columns: 1.2fr clamp(300px, 36vw, 520px);
  align-items: center;
  gap: 56px;
  transform: translateY(-32px);
  scroll-margin-top: 80px;
}
.intro{ min-width: 0; }

.title{
  margin: 0 0 10px 0;
  color: var(--color-accent);
  font-weight: 800;
  line-height: 1.03;
  white-space: nowrap;
  font-size: clamp(140px, 17vw, 400px);
}
.subtitle{
  margin: 0 0 6px 0;
  font-weight: 700;
  line-height: 1.18;
  white-space: nowrap;
  font-size: clamp(20px, 3.4vw, 44px);
  letter-spacing: .2px;
}
.role{
  margin: 0 0 18px 0;
  font-weight: 500;
  line-height: 1.24;
  white-space: nowrap;
  font-size: clamp(18px, 2.8vw, 34px);
  opacity: .95;
}
.payoff{
  margin: 8px 0 16px 0;
  font-size: clamp(16px, 1.4vw, 18px);
  line-height: 1.65;
  opacity: .9;
}

/* CTA hero */
.cta{
  display: inline-block;
  padding: 14px 22px;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  color: var(--color-text);
  border: 1px solid var(--color-accent);
  background-color: color-mix(in srgb, var(--color-accent) 70%, transparent);
  transition: transform .08s ease, background-color .2s ease, box-shadow .2s ease;
}
.cta:hover{
  background-color: color-mix(in srgb, var(--color-accent) 82%, transparent);
  box-shadow: 0 4px 18px rgba(0,0,0,.08);
}
.cta:active{ transform: scale(.98); }
.cta:focus-visible{ outline: 3px solid var(--color-accent); outline-offset: 3px; }

/* Colonna mano */
.hand-wrap{
  width: clamp(300px, 36vw, 520px);
  justify-self: end;
  margin-top: -40px;
}

@media (min-width: 1400px){
  .hero{ grid-template-columns: 1.1fr clamp(360px, 38vw, 560px); }
  .hand-wrap{ width: clamp(360px, 38vw, 560px); margin-top: -30px; }
}
@media (max-width: 980px){
  .hero{
    margin-left: var(--margin-mobile);
    margin-right: var(--margin-mobile);
    grid-template-columns: 1fr clamp(220px, 30vw, 320px);
    gap: 36px;
    padding-top: 28px;
    padding-bottom: 44px;
    transform: translateY(-18px);
    scroll-margin-top: 72px;
  }
  .title{ font-size: clamp(110px, 16vw, 260px); }
  .subtitle{ font-size: clamp(19px, 3.1vw, 36px); }
  .role{ font-size: clamp(17px, 2.4vw, 30px); }
  .hand-wrap{ width: clamp(220px, 30vw, 320px); }
}
@media (max-width: 600px){
  .hero{
    grid-template-columns: 1fr clamp(180px, 28vw, 240px);
    gap: 24px;
    transform: translateY(-10px);
    scroll-margin-top: 64px;
  }
  .title{ font-size: clamp(88px, 18vw, 200px); }
  .subtitle{ font-size: clamp(18px, 4.0vw, 28px); }
  .role{ font-size: clamp(16px, 3.4vw, 24px); }
  .hand-wrap{ width: clamp(180px, 28vw, 240px); }
}
@media (prefers-reduced-motion: reduce){
  .hero{ transform: none !important; }
}

/* =================== SEZIONI CAROSELLO =================== */
.carousel-section-projects-carousel,
.carousel-section-illustrations-carousel{
  max-width: 1280px;
  margin-left: var(--margin-desktop);
  margin-right: var(--margin-desktop);
  padding-top: 80px;
  padding-bottom: 24px;
}
.carousel-section-projects-carousel{ border-top: 2px solid var(--color-accent); }

.section-title{
  margin-top: 20px;
  margin-bottom: 80px;
  font-size: clamp(22px, 2.6vw, 32px);
  line-height: 1.2;
  color: var(--color-accent);
}

.carousel-loading{ opacity: .7; }
.carousel-error{ color: #b00020; }

.carousel-wrap{
  display: grid;
  grid-template-columns: 48px 1fr 48px; /* prev | viewport | next */
  align-items: center;
  gap: 8px;
}

/* Bottoni prev/next */
.nav{
  width: 48px; height: 48px;
  border: none; border-radius: 50%;
  background: transparent;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background-color .2s, transform .1s;
}
.nav:hover{ background-color: rgba(0,0,0,.06); }
.nav:active{ transform: scale(.96); }
.nav .icon{ width: 24px; height: 24px; display: block; pointer-events: none; }

/* stato disabilitato come da Project Details */
.nav:disabled{
  opacity:.35;
  cursor:not-allowed;
}

/* Viewport/Track */
.carousel-viewport{ overflow: hidden; }
.carousel-track{
  display: flex; gap: 14px;
  will-change: transform;
  transition: transform .35s ease;
}

/* ---------- Card PROGETTO (bordo solo intorno all’immagine) ---------- */
.card{
  flex: 0 0 auto;
  width: 100%;
  max-width: 350px;
  text-decoration: none;
  color: inherit;
  background: transparent;
  display: flex;
  flex-direction: column;
}
.card-frame{

  background: var(--color-surface);
  margin: 0;
  padding: 10px;
  display: grid;
  place-items: center;
}
.card-frame img{
  display: block;
  width: 100%;
  height: 220px;
  object-fit: contain;
  background-color: var(--color-surface);
}
.card-title{
  margin: 12px 8px 0;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  color: var(--color-accent);
}

/* ---------- Card ILLUSTRAZIONE (larghezze variabili) ---------- */
.card-illustration{
  flex: 0 0 auto;
  border-radius: 0;
  background: var(--color-surface);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: grid;
  place-items: center;
  padding: 8px;
}
.card-illustration img{
  height: 280px;
  width: auto;
  max-width: 520px;
  object-fit: contain;
  display: block;
  background-color: var(--color-surface);
}
@media (max-width: 980px){ .card-illustration img{ height: 280px; } }
@media (max-width: 600px){ .card-illustration img{ height: 240px; } }

/* CTA "Scopri di più" */
.section-cta-projects{
  margin-top: -40px;
  display: flex;
  justify-content: flex-end;
}
.cta-see-all{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  color: var(--color-accent);
  opacity: .9;
  transition: opacity .2s ease;
  margin-top: 80px;
}
.cta-see-all:hover{ color: var(--color-hover); }
.cta-see-all .icon{ width: 24px; height: 24px; flex-shrink: 0; display: block; }
</style>
