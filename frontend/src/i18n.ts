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

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false }
})

export default i18n
