import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../api/client'
import { BookOpen, Gamepad2, Compass, Eye, Sun, Moon, Settings, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { setRole, setUser } from '../../modules/auth/authSlice'
import { useTranslation } from 'react-i18next'
import api from '../../api/client'
import { motion, AnimatePresence } from 'framer-motion'
const logoImg = new URL('../../assets/images/naturein_logo.png', import.meta.url).href

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const onLogout = () => { logout(); navigate('/login') }
  const dispatch = useDispatch()
  const role = useSelector((s: RootState) => s.auth.role)
  const user = useSelector((s: RootState) => s.auth.user)
  const { t, i18n } = useTranslation()
  const [showConfig, setShowConfig] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const configBtnRef = useRef<HTMLButtonElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const configPanelRef = useRef<HTMLDivElement>(null)
  const [panelWidth, setPanelWidth] = useState<number | undefined>(undefined)
  const [dragging, setDragging] = useState(false)
  const [userData, setUserData] = useState<any>(null)
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
      api.get('/user/me/').then(res => {
        dispatch(setRole(res.data?.role || null))
        dispatch(setUser({ username: res.data?.username, role: res.data?.role }))
        setUserData(res.data)
      }).catch(() => {})
    }
  }, [token])

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
  const handleClickOutsideConfig = (e: MouseEvent) => {
    const target = e.target as Node
    const clickedOutsidePanel = configPanelRef.current && !configPanelRef.current.contains(target)
    const clickedOutsideButton = configBtnRef.current && !configBtnRef.current.contains(target)
    if (showConfig && clickedOutsidePanel && clickedOutsideButton) {
      setShowConfig(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutsideConfig)
  return () => document.removeEventListener('mousedown', handleClickOutsideConfig)
}, [showConfig])

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }
  
  const getDashboardRoute = () => {
    const roleMap: Record<string, string> = {
      student: '/dashboard/student',
      teacher: '/dashboard/teacher',
      expert: '/dashboard/expert'
    }
    return roleMap[role || 'student'] || '/dashboard/student'
  }

  const getAvatarInitials = () => {
    if (userData?.profile?.full_name) {
      return userData.profile.full_name.charAt(0).toUpperCase()
    }
    if (userData?.username) {
      return userData.username.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const getRoleLabel = () => {
    const roleLabels: Record<string, string> = {
      student: 'Estudiante',
      teacher: 'Docente',
      expert: 'Experto'
    }
    return roleLabels[role || 'student'] || 'Usuario'
  }
  return (
    <nav className="flex items-center p-3 gradient-border bg-surface">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src={logoImg} alt="NatureIn" className="h-7" />
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
        <button 
          ref={configBtnRef} 
          aria-label="Configuración" 
          onClick={() => setShowConfig((v) => !v)} 
          className="btn-outline flex items-center gap-1"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden md:inline">Configuración</span>
        </button>
        
        {showConfig && (
          <motion.div 
            ref={configPanelRef}
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 z-50 bg-surface shadow-lg border border-base rounded-md p-3"
            style={{ width: panelWidth || 200, boxSizing: 'border-box' }}
          >
            <div className="text-sm font-semibold mb-2">Configuración</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted mb-1">Idioma</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => { i18n.changeLanguage('es'); localStorage.setItem('lang', 'es'); document.documentElement.lang = 'es'; setShowConfig(false) }} className="btn-outline text-xs">ES</button>
                  <button onClick={() => { i18n.changeLanguage('en'); localStorage.setItem('lang', 'en'); document.documentElement.lang = 'en'; setShowConfig(false) }} className="btn-outline text-xs">EN</button>
                  <button onClick={() => { i18n.changeLanguage('qu'); localStorage.setItem('lang', 'qu'); document.documentElement.lang = 'qu'; setShowConfig(false) }} className="btn-outline text-xs">QU</button>
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
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md transition-colors"
            >
              {userData?.profile?.avatar_url ? (
                <img 
                  src={userData.profile.avatar_url} 
                  alt={userData.profile.full_name || userData.username}
                  className="w-8 h-8 rounded-full object-cover border-2 border-green-500"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  {getAvatarInitials()}
                </div>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-surface shadow-lg border border-base rounded-md overflow-hidden z-50"
                >
                  {/* Header del menú */}
                  <div className="px-4 py-3 border-b border-base bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-800">
                    <div className="font-semibold text-sm">
                      {userData?.profile?.full_name || userData?.username || 'Usuario'}
                    </div>
                    <div className="text-xs text-muted flex items-center gap-1 mt-1">
                      <User className="w-3 h-3" />
                      {getRoleLabel()}
                    </div>
                  </div>

                  {/* Opciones del menú */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate(getDashboardRoute())
                        setShowUserMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="text-sm">Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        setShowConfig(true)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Configuración</span>
                    </button>

                    <div className="border-t border-base my-2"></div>

                    <button
                      onClick={() => {
                        onLogout()
                        setShowUserMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Cerrar sesión</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  )
}
