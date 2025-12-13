export type SpeciesInfo = { name: string; image?: string }
export type Place = { title: string; coords: [number, number]; img: string; images?: string[]; localSpecies?: SpeciesInfo[]; description: string; review: string }

export const initLocalSpecies = (p: Place) => p.localSpecies || []

export const getSuggestedActivities = (place?: Place) => {
  const placeName = place?.title || 'la zona'
  return [
    { id: 'explore', title: `Explora ${placeName}`, desc: `Revisa los lugares y su resumen en ${placeName}.`, to: '/explore/activity' },
    { id: 'mission', title: `Misión: Identifica 3 especies en ${placeName}`, desc: `Busca y registra 3 especies observadas en ${placeName}.`, to: '/sightings' },
    { id: 'lti', title: `Juego: Clasifica especies de ${placeName}`, desc: `Mini-juego para reforzar el aprendizaje sobre especies locales.`, to: '/gamify' },
  ]
}
