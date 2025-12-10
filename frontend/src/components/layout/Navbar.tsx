import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../api/client'
import { BookOpen, Gamepad2, Compass, Eye, Sun, Moon, Globe, Settings } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { setRole, setUser } from '../../modules/auth/authSlice'
import { useTranslation } from 'react-i18next'
import api from '../../api/client'
import { motion } from 'framer-motion'
const logoImg = new URL('../../assets/images/naturein_logo.png', import.meta.url).href
const faviconImg = new URL('../../assets/icons/favicon.ico', import.meta.url).href

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const onLogout = () => { logout(); navigate('/login') }
  const dispatch = useDispatch()
  const role = useSelector((s: RootState) => s.auth.role)
  const { t, i18n } = useTranslation()
  const [showConfig, setShowConfig] = useState(false)
  const configBtnRef = useRef<HTMLButtonElement>(null)
  const [panelWidth, setPanelWidth] = useState<number | undefined>(undefined)
  const [dragging, setDragging] = useState(false)
  useEffect(() => {
    if (showConfig && configBtnRef.current) setPanelWidth(configBtnRef.current.offsetWidth)
  }, [showConfig])
  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (!dragging) return; setPanelWidth((w) => Math.max(140, Math.min(360, (w ?? 200) + e.movementX))) }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [dragging])

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') document.documentElement.classList.add('dark')
    if (token) {
      api.get('/auth/me/').then(res => { dispatch(setRole(res.data?.role || null)); dispatch(setUser({ username: res.data?.username, role: res.data?.role })) }).catch(() => {})
    }
  }, [])

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }
  const toggleLang = () => {
    const next = i18n.language === 'es' ? 'qu' : i18n.language === 'qu' ? 'en' : 'es'
    i18n.changeLanguage(next)
    try { localStorage.setItem('lang', next) } catch {}
    if (typeof document !== 'undefined') document.documentElement.lang = next
    setShowConfig(false)
  }
  return (
    <nav className="flex items-center p-3 gradient-border bg-surface">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src={logoImg} alt="NatureIn" className="h-7 hidden md:block" />
          <img src={faviconImg} alt="NatureIn" className="h-7 md:hidden" />
        </Link>
      </div>
      <div className="flex-1 flex justify-center gap-4">
        <Link to="/content" className="text-muted hover:text-green-700 flex items-center gap-1" title={t('nav.learn')}>
          <BookOpen className="w-5 h-5 md:hidden" />
          <span className="hidden md:inline">{t('nav.learn')}</span>
        </Link>
        <Link to="/gamify" className="text-muted hover:text-green-700 flex items-center gap-1" title={t('nav.play')}>
          <Gamepad2 className="w-5 h-5 md:hidden" />
          <span className="hidden md:inline">{t('nav.play')}</span>
        </Link>
        <Link to="/explore" className="text-muted hover:text-green-700 flex items-center gap-1" title={t('nav.explore')}>
          <Compass className="w-5 h-5 md:hidden" />
          <span className="hidden md:inline">{t('nav.explore')}</span>
        </Link>
        <Link to="/sightings" className="text-muted hover:text-green-700 flex items-center gap-1" title={t('nav.sightings')}>
          <Eye className="w-5 h-5 md:hidden" />
          <span className="hidden md:inline">{t('nav.sightings')}</span>
        </Link>
        
      </div>
      <div className="flex items-center gap-3 relative">
        <button ref={configBtnRef} aria-label="Configuración" onClick={() => setShowConfig((v) => !v)} className="btn-outline flex items-center gap-1"><Settings className="w-4 h-4" /><span className="config-label">Configuración</span></button>
        {showConfig && (
          <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 0 }}
            className="absolute left-0 top-full mt-0 z-50 bg-surface shadow-lg border border-base rounded-md p-2"
            style={{ width: panelWidth, boxSizing: 'border-box' }}
          >
            <div className="text-sm font-semibold mb-2">Configuración</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted mb-1">Idioma</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => { i18n.changeLanguage('es'); try { localStorage.setItem('lang', 'es') } catch {}; if (typeof document !== 'undefined') document.documentElement.lang = 'es'; setShowConfig(false) }} className="btn-outline text-xs">ES</button>
                  <button onClick={() => { i18n.changeLanguage('en'); try { localStorage.setItem('lang', 'en') } catch {}; if (typeof document !== 'undefined') document.documentElement.lang = 'en'; setShowConfig(false) }} className="btn-outline text-xs">EN</button>
                  <button onClick={() => { i18n.changeLanguage('qu'); try { localStorage.setItem('lang', 'qu') } catch {}; if (typeof document !== 'undefined') document.documentElement.lang = 'qu'; setShowConfig(false) }} className="btn-outline text-xs">QU</button>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted mb-1">Tema</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => { toggleTheme(); setShowConfig(false) }} className="btn-outline flex items-center gap-1 text-xs">
                    {document.documentElement.classList.contains('dark') ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {document.documentElement.classList.contains('dark') ? 'Claro' : 'Oscuro'}
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 h-full w-2 cursor-ew-resize" onMouseDown={() => setDragging(true)} />
          </motion.div>
        )}
        {!token ? (
          <>
            <Link to="/login?tab=register" className="btn-cta btn-cta-registrate hidden md:inline">Regístrate</Link>
            <Link to="/login?tab=login" className="btn-primary hidden md:inline">Inicia sesión</Link>
            <Link to="/login?tab=register" className="btn-cta btn-cta-registrate md:hidden">Únete</Link>
          </>
        ) : (
          <button className="btn-primary" onClick={onLogout}>{role ? `Logout (${role})` : 'Logout'}</button>
        )}
      </div>
    </nav>
  )
}
