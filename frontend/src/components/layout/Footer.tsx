import React from 'react'
const logoImg = new URL('../../assets/images/naturein_logo.png', import.meta.url).href

export default function Footer() {
  return (
    <footer className="mt-8 bg-surface rounded-card min-h-20">
      <div className="gradient-border" />
      <div className="p-4">
        <div className="w-full flex flex-col md:flex-row items-center md:items-center justify-between gap-4 px-4 md:px-0">
          <div className="shrink-0">
            <img src={logoImg} alt="NatureIn" className="h-10" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-grid grid-cols-1 md:grid-cols-3 gap-3 justify-items-center">
              <a className="pill pill-green clickable-green w-fit" href="https://www.gob.pe/34191-objetivos-de-desarrollo-sostenible-ods" target="_blank" rel="noreferrer">ODS 15: Vida de Ecosistemas Terrestres</a>
              <a className="pill pill-yellow clickable-green w-fit" href="https://www.gob.pe/34191-objetivos-de-desarrollo-sostenible-ods" target="_blank" rel="noreferrer">ODS 13: Acción por el Clima</a>
              <a className="pill pill-blue clickable-green w-fit" href="https://www.gob.pe/34191-objetivos-de-desarrollo-sostenible-ods" target="_blank" rel="noreferrer">ODS 4: Educación de Calidad</a>
            </div>
          </div>
          <div className="footer-links text-muted shrink-0">
            <div className="flex flex-col items-end text-right gap-2 text-sm">
              <a href="#" className="hover:underline">Contacto</a>
              <a href="#" className="hover:underline">Accesibilidad</a>
              <a href="#" className="hover:underline">Privacidad</a>
            </div>
          </div>
        </div>
        <div className="text-xs text-muted mt-2 w-full flex justify-center">
          <div className="max-w-sm w-full text-center">
            © NatureIn. Biodiversidad de Tingo María, Perú.
          </div>
        </div>
      </div>
    </footer>
  )
}
