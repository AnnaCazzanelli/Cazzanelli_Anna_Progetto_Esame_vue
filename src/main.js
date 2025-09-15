// src/main.js
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Importa Firestore già configurato
import { db } from '@/firebase/config'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Rendi disponibile Firestore a tutti i componenti con provide/inject
app.provide('firestore', db)

app.mount('#app')
