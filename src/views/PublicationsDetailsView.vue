<script setup>
/* ==========================================================================
   Import e routing
   ========================================================================= */
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

/* ==========================================================================
   Stato view
   ========================================================================= */
const route = useRoute()
const pub = ref(null)
const loading = ref(true)
const notFound = ref(false)
const activeIndex = ref(0)

/* ==========================================================================
   Helpers (Immagini)
   ========================================================================= */
const isImgUrl = (u) => typeof u === 'string' && /\.(webp|png|jpe?g|gif|avif)$/i.test((u || '').trim())

const normKey = (u) => {
  if (typeof u !== 'string') return ''
  const clean = u.trim().toLowerCase().split('?')[0]
  const file = clean.split('/').pop() || ''
  return file.replace(/\.(webp|png|jpe?g|gif|avif)$/i, '')
}

/* Scroll iniziale */
window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

/* ==========================================================================
   Normalizzazione Gallery (Adattata a Publications)
   ========================================================================= */
const images = computed(() => {
  if (!pub.value) return []
  const out = []
  const added = new Set()
  
  // 1. Aggiungiamo la main_image (Copertina)
  const coverRaw = (pub.value.main_image || '').trim()
  if (isImgUrl(coverRaw)) {
    out.push({ src: coverRaw, alt: `${pub.value.title} – copertina` })
    added.add(normKey(coverRaw))
  }

  // 2. Aggiungiamo la gallery
  if (Array.isArray(pub.value.gallery)) {
    pub.value.gallery.forEach((src) => {
      if (isImgUrl(src)) {
        const key = normKey(src)
        if (!added.has(key)) {
          out.push({ src, alt: `${pub.value.title} – dettaglio` })
          added.add(key)
        }
      }
    })
  }
  return out
})

// Per le pubblicazioni usiamo le stesse immagini per le miniature
const thumbs = computed(() => images.value)

/* ==========================================================================
   Navigazione
   ========================================================================= */
const setActive = (i) => { activeIndex.value = i }
const prev = () => { if (activeIndex.value > 0) activeIndex.value-- }
const next = () => { if (activeIndex.value < images.value.length - 1) activeIndex.value++ }

watch(activeIndex, async () => {
  const container = document.querySelector('.thumbs')
  const activeThumb = document.querySelector('.thumb.active')
  if (container && activeThumb) {
    const scrollLeft = activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  }
})

/* Swipe touch */
const startX = ref(0)
const deltaX = ref(0)
const onTouchStart = (e) => { startX.value = e.changedTouches[0].clientX; deltaX.value = 0 }
const onTouchMove = (e) => { deltaX.value = e.changedTouches[0].clientX - startX.value }
const onTouchEnd = () => { if (Math.abs(deltaX.value) > 45) { deltaX.value < 0 ? next() : prev() } }

/* ==========================================================================
   Fetch dati
   ========================================================================= */
async function fetchPublication() {
  loading.value = true
  notFound.value = false
  const id = String(route.params.id || '').trim()
  try {
    const snap = await getDoc(doc(db, 'publications', id))
    if (!snap.exists()) { notFound.value = true; return }
    pub.value = { id: snap.id, ...snap.data() }
  } catch (e) {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchPublication)
watch(() => route.params.id, fetchPublication)
</script>

<template>
  <main class="page bg-surface text-text">
    
    <div v-if="loading" class="loading py-40 text-center opacity-80">Caricamento pubblicazione…</div>

    <div v-else-if="notFound" class="notfound py-40 text-center opacity-80">
      <p>Pubblicazione non trovata.</p>
      <RouterLink to="/publications" class="back-link text-accent">Torna alle pubblicazioni</RouterLink>
    </div>

    <div v-else-if="pub" class="container max-w-[1200px] mx-auto relative">
      
      <RouterLink 
        to="/publications" 
        class="back-btn absolute -top-[60px] left-0 w-12 h-12 inline-flex items-center justify-center transition hover:bg-black/5 dark:hover:bg-white/10"
      >
        <img src="/icone/icon-arrowsx.svg" alt="Torna indietro" class="icon w-6 h-6" />
      </RouterLink>

      <h1 class="title text-accent text-center">{{ pub.title }}</h1>

      <section class="viewer grid grid-cols-[48px_1fr_48px] items-center gap-6 mb-14">
        
        <button class="nav nav-left" :disabled="activeIndex === 0" @click="prev">
          <img src="/icone/icon-prev.svg" alt="" class="w-6 h-6" />
        </button>

        <div class="stage bg-surface grid place-items-center overflow-hidden" 
             @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove" @touchend="onTouchEnd">
          <img 
            v-if="images[activeIndex]"
            :src="images[activeIndex].src" 
            :alt="images[activeIndex].alt" 
            class="stage-img block h-[clamp(450px,75vh,850px)] w-auto max-w-full object-contain" 
          />
        </div>

        <button class="nav nav-right" :disabled="activeIndex === images.length - 1" @click="next">
          <img src="/icone/icon-next.svg" alt="" class="w-6 h-6" />
        </button>

      </section>

      <section v-if="thumbs.length > 1" class="thumbs flex gap-4 overflow-x-auto scroll-smooth no-scrollbar mb-14 px-20">
        <button 
          v-for="(t, i) in thumbs" 
          :key="t.src + i" 
          class="thumb flex-shrink-0 w-[80px] h-[112px] overflow-hidden border-2 transition opacity-60" 
          :class="{ 'active opacity-100 border-[var(--color-accent)]': i === activeIndex }" 
          @click="setActive(i)"
        >
          <img :src="t.src" :alt="t.alt" class="w-full h-full object-cover" />
        </button>
      </section>

      <section class="meta grid grid-cols-[1fr_2fr] gap-[72px] pt-10 border-t border-black/5 dark:border-white/5">
        
        <div class="col">
          <h3 class="text-accent">Dati pubblicazione</h3>
          
          <div class="meta-item mb-6">
            <h4 class="text-sm uppercase opacity-50 mb-1">Anno</h4>
            <p>{{ pub.date }}</p>
          </div>

          <div class="meta-item mb-6">
            <h4 class="text-sm uppercase opacity-50 mb-1">Editore</h4>
            <p>{{ pub.publisher }}</p>
          </div>

          <div v-if="pub.author" class="meta-item mb-6">
            <h4 class="text-sm uppercase opacity-50 mb-1">Autore</h4>
            <p>{{ pub.author }}</p>
          </div>
        </div>

        <div class="col">
          <h3 class="text-accent">Description:</h3>
          <div v-if="pub.description" class="desc leading-relaxed">
            <p v-html="pub.description"></p>
          </div>
        </div>

      </section>

    </div>
  </main>
</template>

<style scoped>
/* Copiato da ProjectDetailView */
.page { padding: 48px var(--margin-desktop) 112px; }
.title { font-size: clamp(32px, 4.2vw, 56px); line-height: 1.1; margin: 56px 0 48px; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.nav {
  width: 48px; height: 48px; display: inline-flex; align-items: center; justify-content: center;
  transition: all 0.2s; border: none; background: transparent; cursor: pointer;
}
.nav:hover:not(:disabled) { background: rgba(0,0,0,0.05); }
:deep(body.dark-mode) .nav:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
.nav:disabled { opacity: 0.1; cursor: not-allowed; }

/* Adattamento per miniature verticali (569/800 ratio) */
.thumb {
  width: 80px; /* Più strette di project */
  height: 112px;
  border-radius: 4px;
  border-color: transparent;
}

.meta h3 { font-size: clamp(20px, 1.9vw, 24px); margin-bottom: 24px; font-weight: 700; }
.meta-item p { font-size: 18px; font-weight: 500; }
.desc p { font-size: clamp(15px, 1.05vw, 18px); line-height: 1.8; white-space: pre-line; }

@media (max-width: 768px) {
  .page { padding: 32px var(--margin-mobile) 96px; }
  .viewer { grid-template-columns: 1fr; }
  .nav { display: none; }
  .meta { grid-template-columns: 1fr; gap: 32px; }
  .thumbs { px: 0; justify-content: center; }
}
</style>