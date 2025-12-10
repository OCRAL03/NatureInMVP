import { useEffect, useState } from 'react'
import api from '../../api/client'
import { useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Lock, Mail, Building, BookOpen, Sparkles } from 'lucide-react'
const imgCascadaPavas = new URL('../../assets/images/explorar/cascada pavas.png', import.meta.url).href
const imgCotomono = new URL('../../assets/images/explorar/cotomono.png', import.meta.url).href
const gradeOptions = ['1°','2°','3°','4°','5°']
const sectionOptions = ['A','B','C','D']

export default function LoginForm() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState<'estudiante' | 'docente' | 'experto'>('estudiante')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    institution: '',
    studyArea: '',
    grade: '',
    section: '',
    subject: ''
  })
  const [institutions, setInstitutions] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, any>>({})

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/user/institutions')
        const names = (res.data || []).map((i: any) => i.name)
        setInstitutions(names)
      } catch {}
    }
    if (tab === 'register' && role !== 'experto') load()
  }, [tab, role])

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    submitAuth()
  }

  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const qTab = params.get('tab')
    if (qTab === 'register' || qTab === 'login') {
      setTab(qTab)
    }
  }, [location.search])

  const headline = tab === 'login' ? 'Bienvenido a NatureIn' : role === 'experto' ? 'Comparte tu conocimiento científico' : role === 'docente' ? 'Guía y motiva a tus estudiantes' : 'Aprende jugando con la biodiversidad'
  const subcopy = tab === 'login' ? 'Ingresa para continuar tu exploración y misiones' : 'Crea tu cuenta según tu rol para personalizar tu experiencia'

  async function submitAuth() {
    setErrors({}) // Limpia errores previos
    const apiMod = (await import('../../api/client')).default
    try {
      if (tab === 'login') {
        const { data } = await apiMod.post('/auth/token/', { username: formData.username, password: formData.password })
        const access = data?.access || data?.token || ''
        const refresh = data?.refresh
        if (access) localStorage.setItem('token', access)
        if (refresh) localStorage.setItem('refresh', refresh)
        
        // Obtener rol del usuario para redirigir al dashboard correcto
        try {
          const { data: userData } = await apiMod.get('/user/me/')
          const userRole = userData?.role || 'student'
          
          // Redirigir según rol
          const roleDashboardMap: Record<string, string> = {
            student: '/dashboard/student',
            teacher: '/dashboard/teacher',
            expert: '/dashboard/expert'
          }
          navigate(roleDashboardMap[userRole] || '/dashboard/student')
        } catch {
          // Si falla obtener el rol, redirigir a content por defecto
          navigate('/content')
        }
      } else {
        const roleMap: Record<string, string> = { estudiante: 'student', docente: 'teacher', experto: 'expert' }
        const roleCode = roleMap[role]
        const payload: any = {
          username: formData.username,
          password: formData.password,
          password_confirm: formData.password,
          role: roleCode,
          full_name: formData.full_name,
          email: formData.email,
          institution: formData.institution,
          grade: formData.grade,
          section: formData.section,
          subject: formData.subject,
          study_area: formData.studyArea
        }
        const { data } = await apiMod.post('/user/register/', payload)
        const access = data?.access
        const refresh = data?.refresh
        if (access) localStorage.setItem('token', access)
        if (refresh) localStorage.setItem('refresh', refresh)
        
        // Después de registro, redirigir según rol
        const roleDashboardMap: Record<string, string> = {
          student: '/dashboard/student',
          teacher: '/dashboard/teacher',
          expert: '/dashboard/expert'
        }
        navigate(roleDashboardMap[roleCode] || '/dashboard/student')
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        // Si el backend envía errores de validación, los guardamos
        setErrors(err.response.data)
      } else {
        // Si es otro tipo de error, mostramos un mensaje general
        setErrors({ general: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.' })
      }
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0">
        <img src={tab === 'login' ? imgCascadaPavas : imgCotomono} alt={tab === 'login' ? 'Cascada Pavas' : 'Cotomono'} className="w-full h-full object-cover" />
        
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="card p-6 bg-white/90 max-w-md w-full">
          <div className="mb-4 text-center">
            <div className="text-2xl font-bold">{headline}</div>
            <div className="text-sm text-muted mt-1">{subcopy}</div>
          </div>
          <div className="flex justify-center gap-3 mb-6">
            <button
              className={`${tab === 'login' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-300/60' : 'bg-white text-emerald-700 border border-emerald-600 hover:bg-emerald-50'} px-6 py-2 rounded-none transition`}
              onClick={() => setTab('login')}
              type="button"
            >
              Ingresar
            </button>
            <button
              className={`${tab === 'register' ? 'bg-emerald-600 text-white shadow-lg shadow-cyan-300/60' : 'bg-white text-emerald-700 border border-emerald-600 hover:bg-emerald-50'} px-6 py-2 rounded-none transition`}
              onClick={() => setTab('register')}
              type="button"
            >
              Registrarse
            </button>
          </div>

          <div className="space-y-5">
          {tab === 'register' && (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-muted">Selecciona tu rol</div>
              <div className="flex gap-2">
                <button type="button" className={`btn-pill ${role==='estudiante'?'btn-cta':'btn-outline'} ${role==='estudiante'?'':'clickable-green'} flex items-center gap-2`} onClick={() => setRole('estudiante')}>
                  <BookOpen className="w-4 h-4" /> Estudiante
                </button>
                <button type="button" className={`btn-pill ${role==='docente'?'btn-cta':'btn-outline'} ${role==='docente'?'':'clickable-green'} flex items-center gap-2`} onClick={() => setRole('docente')}>
                  <Building className="w-4 h-4" /> Docente
                </button>
                <button type="button" className={`btn-pill ${role==='experto'?'btn-cta':'btn-outline'} ${role==='experto'?'':'clickable-green'} flex items-center gap-2`} onClick={() => setRole('experto')}>
                  <Sparkles className="w-4 h-4" /> Experto
                </button>
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <input
                  type="text"
                  className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                  placeholder="Juan Pérez García"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              {errors.full_name && <div className="text-xs text-red-500 mt-1">{errors.full_name}</div>}
              <div className="text-xs text-muted">Nombres y apellidos completos</div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted">Usuario</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
              <input
                type="text"
                className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                placeholder={tab === 'login' ? 'Ingresa tu usuario' : 'Elige un usuario'}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            {errors.username && <div className="text-xs text-red-500 mt-1">{errors.username}</div>}
            {tab === 'register' && (
              <div className="text-xs text-muted">Será tu identificador para iniciar sesión</div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field gradient-border focus-blue input-with-icon pr-12 w-full min-h-[44px]"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
            {errors.password_confirm && <div className="text-xs text-red-500 mt-1">{errors.password_confirm}</div>}
            <div className="text-xs text-muted">
              {tab === 'register' ? 'Mínimo 8 caracteres, combina letras y números' : 'Tu contraseña segura'}
            </div>
          </div>

          {tab === 'register' && role === 'estudiante' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted">Grado y sección</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                  <select
                    className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  >
                    <option value="" disabled>Grado</option>
                    {gradeOptions.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                  <select
                    className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  >
                    <option value="" disabled>Sección</option>
                    {sectionOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.grade && <div className="text-xs text-red-500 mt-1">{errors.grade}</div>}
              {errors.section && <div className="text-xs text-red-500 mt-1">{errors.section}</div>}
              {errors.role && <div className="text-xs text-red-500 mt-1">{errors.role}</div>}
            </div>
          )}

          {tab === 'register' && role === 'docente' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted">Área o curso</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <input
                  type="text"
                  className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                  placeholder="Ciencia y Ambiente, Biología, etc."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              {errors.subject && <div className="text-xs text-red-500 mt-1">{errors.subject}</div>}
            </div>
          )}

          {tab === 'register' && role === 'experto' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted">Área de especialidad</label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <input
                  type="text"
                  className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                  placeholder="Biología, Ecología, etc."
                  value={formData.studyArea}
                  onChange={(e) => setFormData({ ...formData, studyArea: e.target.value })}
                />
              </div>
              {errors.study_area && <div className="text-xs text-red-500 mt-1">{errors.study_area}</div>}
            </div>
          )}

          {tab === 'register' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <input
                  type="email"
                  className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
              <div className="text-xs text-muted">Para recuperar tu cuenta</div>
            </div>
          )}

          {tab === 'register' && role !== 'experto' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted">Institución educativa</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <select
                  className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                >
                  <option value="">Elige tu institución</option>
                  {institutions.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Contenedor para errores generales */}
          {errors.general && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">{errors.general}</div>
          )}

          <button onClick={handleSubmit} className="btn-cta btn-pill w-full mt-2">{tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
