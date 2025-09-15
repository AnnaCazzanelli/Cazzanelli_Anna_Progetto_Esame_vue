<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Rive, Fit, Alignment, Layout } from '@rive-app/canvas' // <-- IMPORT CORRETTO

const props = defineProps({
  displayWidth:  { type: Number, default: 580 },
  displayHeight: { type: Number, default: 580 },
  canvasWidth:   { type: Number, default: 900 },
  canvasHeight:  { type: Number, default: 900 },
  // se la tua animazione nel file Rive NON si chiama "wave" cambia qui:
  animationName: { type: String, default: 'wave' },
})

const canvasRef = ref(null)
let riveInstance = null
let observer = null

const isDark = () => document.body.classList.contains('dark-mode')
const srcForTheme = () =>
  isDark()
    ? '/animations/handwave_dark.riv'
    : '/animations/handwave_light.riv'

function cleanup() {
  if (riveInstance) {
    riveInstance.stop()
    riveInstance.cleanup?.()
    riveInstance = null
  }
}

function setCanvasSize() {
  const c = canvasRef.value
  if (!c) return
  c.width  = props.canvasWidth
  c.height = props.canvasHeight
  c.style.width  = `${props.displayWidth}px`
  c.style.height = `${props.displayHeight}px`
}

function initRive() {
  cleanup()
  const canvas = canvasRef.value
  if (!canvas) return

  setCanvasSize()

  riveInstance = new Rive({
    src: srcForTheme(),
    canvas,
    autoplay: true,
    // se in Rive hai creato una STATE MACHINE invece di una semplice animazione,
    // commenta la riga 'animations' e usa al posto suo:
    // stateMachines: ['State Machine 1'],
    animations: [props.animationName],
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoad: () => {
      riveInstance.resizeDrawingSurfaceToCanvas()
    },
  })
}

onMounted(() => {
  initRive()

  // Ricarica il file giusto quando cambia tema (classe .dark-mode sul body)
  observer = new MutationObserver(() => initRive())
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cleanup()
})
</script>

<template>
  <canvas ref="canvasRef" role="img" aria-label="Mano che saluta"></canvas>
</template>

<style scoped>
canvas { display: block; max-width: 100%; height: auto; }
</style>
