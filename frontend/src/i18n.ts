import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  es: {
    translation: {
      nav: { learn: 'Aprender', play: 'Jugar', explore: 'Explorar', sightings: 'Avistamientos' },
      actions: { startExploring: 'Empieza a Explorar' },
      headings: { explorePlaces: 'Explora Lugares', learnPlaying: 'Aprende Jugando', welcome: 'Bienvenido a NatureIn' },
      texts: { welcomeDesc: 'Adéntrate a conocer la belleza de Tingo María. Explora lugares y especies.' }
    }
  },
  en: {
    translation: {
      nav: { learn: 'Learn', play: 'Play', explore: 'Explore', sightings: 'Sightings' },
      actions: { startExploring: 'Start Exploring' },
      headings: { explorePlaces: 'Explore Places', learnPlaying: 'Learn by Playing', welcome: 'Welcome to NatureIn' },
      texts: { welcomeDesc: 'Dive into the beauty of Tingo María. Explore places and species.' }
    }
  },
  qu: {
    translation: {
      nav: { learn: 'Yachay', play: 'Pukllay', explore: 'Maskakuy', sightings: 'Rikukuna' },
      actions: { startExploring: 'Maskakuyta Qallariy' },
      headings: { explorePlaces: 'Maskakuy Suti', learnPlaying: 'Pukllaywan Yachay', welcome: 'NatureInman Allin Hamuy' },
      texts: { welcomeDesc: 'Tingo María sumaq llaqtata yachay. Maskakuy sutinakunata.' }
    }
  }
}

const supported = ['es', 'en', 'qu']
let initial = 'es'
try {
  const saved = typeof window !== 'undefined' ? (localStorage.getItem('lang') || '') : ''
  const browser = typeof navigator !== 'undefined' ? (navigator.language || 'es').slice(0, 2) : 'es'
  const pick = (saved && supported.includes(saved)) ? saved : (supported.includes(browser) ? browser : 'es')
  initial = pick
} catch {}

i18n.use(initReactI18next).init({
  resources,
  lng: initial,
  fallbackLng: 'es',
  interpolation: { escapeValue: false }
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = initial
}

export default i18n
