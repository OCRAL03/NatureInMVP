import { motion } from 'framer-motion'
import React from 'react'
import type { Place, SpeciesInfo } from './utils'

type Props = {
  selectedPlace: Place | null
  speciesDetails: Record<string, SpeciesInfo[]>
  setSelectedPlace: (p: Place | null) => void
  selectedImage: string | null
  setSelectedImage: (s: string | null) => void
  handlePlaceClick: (p: Place) => void
}

export default function PlaceDetailsPanel({ selectedPlace, speciesDetails, setSelectedPlace, selectedImage, setSelectedImage, handlePlaceClick }: Props) {
  if (!selectedPlace) return null

  const currentSpecies = speciesDetails[selectedPlace.title] || []

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-center items-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="relative">
          <img src={selectedImage || selectedPlace.img} alt={selectedPlace.title} className="w-full h-48 object-cover rounded-t-lg" />
          <button
            onClick={() => { setSelectedPlace(null); setSelectedImage(null) }}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg text-gray-800 hover:bg-gray-100 z-[1001]"
            aria-label="Cerrar detalles del lugar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-3xl font-bold text-primary mb-3">{selectedPlace.title}</h3>

          <div className="flex gap-2 mb-3">
            {(selectedPlace.images || [selectedPlace.img]).map((im, i) => (
              <button key={i} onClick={() => setSelectedImage(im)} className="w-20 h-12 overflow-hidden rounded-md border border-gray-200">
                <img src={im} alt={`${selectedPlace.title} ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <h4 className="text-lg font-semibold mt-4 mb-2">Descripción del Lugar </h4>
          <p className="text-gray-700 mb-4">{selectedPlace.description}</p>

          <h4 className="text-lg font-semibold mt-4 mb-2">Pequeña Reseña (Experiencia del Visitante) ⭐</h4>
          <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-600 bg-green-50 p-2 rounded">"{selectedPlace.review}"</blockquote>

          <h4 className="text-lg font-semibold mt-4 mb-2">Avistamiento de Especies Recientes </h4>
          <div className="space-y-3">
            {currentSpecies && currentSpecies.length > 0 ? (
              currentSpecies.map((s, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                  {s.image ? (
                    <img src={s.image} alt={s.name} className="w-12 h-12 object-cover rounded-full shadow" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-surface border border-base flex items-center justify-center text-xs text-gray-500">No Img</div>
                  )}
                  <div>
                    <div className="text-base font-medium">{s.name}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted italic p-2 bg-yellow-50 rounded">No hay avistamientos registrados. Añade uno en Avistamientos para enriquecer la información.</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}