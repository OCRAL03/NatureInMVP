import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-8 bg-white rounded-card">
      <div className="gradient-border" />
      <div className="p-6">
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-4 px-4 md:px-0">
          <div className="shrink-0">
            <img src="/assets/naturein_logo.svg" alt="NatureIn" className="h-10" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-grid grid-cols-1 md:grid-cols-3 gap-3 justify-items-center">
              <a className="pill pill-green clickable-green w-fit" href="https://www.gob.pe/34191-objetivos-de-desarrollo-sostenible-ods" target="_blank" rel="noreferrer">ODS 15: Vida de Ecosistemas Terrestres</a>
              <a className="pill pill-yellow clickable-green w-fit" href="https://www.gob.pe/34191-objetivos-de-desarrollo-sostenible-ods" target="_blank" rel="noreferrer">ODS 13: Acción por el Clima</a>
              <a className="pill pill-blue clickable-green w-fit" href="https://www.gob.pe/34191-objetivos-de-desarrollo-sostenible-ods" target="_blank" rel="noreferrer">ODS 4: Educación de Calidad</a>
            </div>
          </div>
          <div className="footer-links text-gray-700 shrink-0">
            <div className="flex flex-col items-end text-right gap-2">
              <a href="#" className="hover:underline">Contacto</a>
              <a href="#" className="hover:underline">Accesibilidad</a>
              <a href="#" className="hover:underline">Privacidad</a>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-2 w-full flex justify-end">
          © NatureIn. Biodiversidad de Tingo María, Perú.
        </div>
      </div>
    </footer>
  )
}
