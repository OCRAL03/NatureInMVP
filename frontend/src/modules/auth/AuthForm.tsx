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
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
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
        setNeedsEmailVerification(true)
        setErrors({ general: data?.message || 'Revisa tu correo para verificar la cuenta.' })
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        if (err.response.status === 403 && err.response.data?.code === 'email_unverified') {
          setNeedsEmailVerification(true)
          setErrors({ general: err.response.data?.detail })
        } else {
          setErrors(err.response.data)
        }
      } else {
        // Si es otro tipo de error, mostramos un mensaje general
        setErrors({ general: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.' })
      }
    }
  }

  async function requestEmailCode() {
    const apiMod = (await import('../../api/client')).default
    try {
      await apiMod.post('/auth/email/verify/request/', { username: formData.username, email: formData.email })
      setErrors({ general: 'Código enviado. Revisa tu correo.' })
    } catch (e: any) {
      setErrors({ general: e.response?.data?.detail || 'No se pudo enviar el código.' })
    }
  }

  async function confirmEmailCode() {
    const apiMod = (await import('../../api/client')).default
    try {
      const payload: any = { code: verificationCode }
      if (formData.username) payload.username = formData.username
      else if (formData.email) payload.email = formData.email
      const { data } = await apiMod.post('/auth/email/verify/confirm/', payload)
      setNeedsEmailVerification(false)
      setErrors({ general: data?.message || 'Correo verificado. Ahora puedes iniciar sesión.' })
      if (tab === 'login') {
        await submitAuth()
      }
    } catch (e: any) {
      const status = e.response?.status
      const detail = e.response?.data?.detail
      setErrors({ general: detail || 'Código inválido.' })
      if (status === 403) {
        // límite de intentos alcanzado o expirado
        setNeedsEmailVerification(false)
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
          <form onSubmit={(e) => { e.preventDefault(); submitAuth() }} noValidate>
          <div className="mb-4 text-center">
            <div className="text-2xl font-bold">{headline}</div>
            <div className="text-sm text-muted mt-1">{subcopy}</div>
          </div>
          <div className="flex justify-center gap-3 mb-6">
            <button
              className={`${tab === 'login' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-300/60' : 'bg-white text-emerald-700 border border-emerald-600 hover:bg-emerald-50'} px-6 py-2 rounded-none transition focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2`}
              onClick={() => setTab('login')}
              type="button"
              aria-pressed={tab === 'login'}
            >
              Ingresar
            </button>
            <button
              className={`${tab === 'register' ? 'bg-emerald-600 text-white shadow-lg shadow-cyan-300/60' : 'bg-white text-emerald-700 border border-emerald-600 hover:bg-emerald-50'} px-6 py-2 rounded-none transition focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2`}
              onClick={() => setTab('register')}
              type="button"
              aria-pressed={tab === 'register'}
            >
              Registrarse
            </button>
          </div>

          <div className="space-y-5">
          {tab === 'register' && (
            <div className="space-y-3">
              <div className="text-sm font-semibold">Selecciona tu rol</div>
              <div className="flex gap-2" role="group" aria-label="Selecciona tu rol">
                <button
                  type="button"
                  className={`btn-pill ${role==='estudiante'?'btn-cta':'btn-outline'} ${role==='estudiante'?'':'clickable-green'} flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2`}
                  onClick={() => setRole('estudiante')}
                  aria-pressed={role==='estudiante'}
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" /> Estudiante
                </button>
                <button
                  type="button"
                  className={`btn-pill ${role==='docente'?'btn-cta':'btn-outline'} ${role==='docente'?'':'clickable-green'} flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2`}
                  onClick={() => setRole('docente')}
                  aria-pressed={role==='docente'}
                >
                  <Building className="w-4 h-4" aria-hidden="true" /> Docente
                </button>
                <button
                  type="button"
                  className={`btn-pill ${role==='experto'?'btn-cta':'btn-outline'} ${role==='experto'?'':'clickable-green'} flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2`}
                  onClick={() => setRole('experto')}
                  aria-pressed={role==='experto'}
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" /> Experto
                </button>
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div className="space-y-2">
              <label htmlFor="full_name" className="text-sm font-semibold">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                  placeholder="Juan Pérez García"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  id="full_name"
                  name="full_name"
                  aria-invalid={!!errors.full_name}
                  aria-describedby={errors.full_name ? 'full_name-error' : 'full_name-help'}
                  required
                />
              </div>
              {errors.full_name && <div id="full_name-error" className="text-xs text-red-500 mt-1" aria-live="polite">{errors.full_name}</div>}
              <div id="full_name-help" className="text-xs text-muted">Nombres y apellidos completos</div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-semibold">Usuario</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                placeholder={tab === 'login' ? 'Ingresa tu usuario' : 'Elige un usuario'}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                id="username"
                name="username"
                autoComplete="username"
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'username-error' : (tab === 'register' ? 'username-help' : undefined)}
                required
              />
            </div>
            {errors.username && <div id="username-error" className="text-xs text-red-500 mt-1" aria-live="polite">{errors.username}</div>}
            {tab === 'register' && (
              <div id="username-help" className="text-xs text-muted">Será tu identificador para iniciar sesión</div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field gradient-border focus-blue input-with-icon pr-12 w-full min-h-[44px]"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                id="password"
                name="password"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                aria-invalid={!!errors.password || !!errors.password_confirm}
                aria-describedby={
                  errors.password ? 'password-error' :
                  errors.password_confirm ? 'password-confirm-error' :
                  (tab === 'register' ? 'password-help' : undefined)
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <div id="password-error" className="text-xs text-red-500 mt-1" aria-live="polite">{errors.password}</div>}
            {errors.password_confirm && <div id="password-confirm-error" className="text-xs text-red-500 mt-1" aria-live="polite">{errors.password_confirm}</div>}
            <div id="password-help" className="text-xs text-muted">
              {tab === 'register' ? 'Mínimo 8 caracteres, combina letras y números' : 'Tu contraseña segura'}
            </div>
          </div>

          {tab === 'register' && role === 'estudiante' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold">Grado y sección</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" aria-hidden="true" />
                  <select
                    className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    id="grade"
                    name="grade"
                    aria-invalid={!!errors.grade}
                    aria-describedby={errors.grade ? 'grade-error' : undefined}
                    required
                  >
                    <option value="" disabled>Grado</option>
                    {gradeOptions.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" aria-hidden="true" />
                  <select
                    className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    id="section"
                    name="section"
                    aria-invalid={!!errors.section}
                    aria-describedby={errors.section ? 'section-error' : undefined}
                    required
                  >
                    <option value="" disabled>Sección</option>
                    {sectionOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.grade && <div id="grade-error" className="text-xs text-red-500 mt-1" aria-live="polite">{errors.grade}</div>}
              {errors.section && <div id="section-error" className="text-xs text-red-500 mt-1" aria-live="polite">{errors.section}</div>}
              {errors.role && <div id="role-error" className="text-xs text-red-500 mt-1" aria-live="polite">{errors.role}</div>}
            </div>
          )}

          {tab === 'register' && role === 'docente' && (
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-semibold">Área o curso</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                  placeholder="Ciencia y Ambiente, Biología, etc."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  id="subject"
                  name="subject"
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  required
                />
              </div>
              {errors.subject && <div id="subject-error" className="text-xs text-red-500 mt-1" aria-live="polite">{errors.subject}</div>}
            </div>
          )}

          {tab === 'register' && role === 'experto' && (
            <div className="space-y-2">
              <label htmlFor="studyArea" className="text-sm font-semibold">Área de especialidad</label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                  placeholder="Biología, Ecología, etc."
                  value={formData.studyArea}
                  onChange={(e) => setFormData({ ...formData, studyArea: e.target.value })}
                  id="studyArea"
                  name="studyArea"
                  aria-invalid={!!errors.study_area}
                  aria-describedby={errors.study_area ? 'studyArea-error' : undefined}
                  required
                />
              </div>
              {errors.study_area && <div id="studyArea-error" className="text-xs text-red-500 mt-1" aria-live="polite">{errors.study_area}</div>}
            </div>
          )}

          {tab === 'register' && (
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" aria-hidden="true" />
                <input
                  type="email"
                  className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  id="email"
                  name="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : 'email-help'}
                  required
                />
              </div>
              {errors.email && <div id="email-error" className="text-xs text-red-500 mt-1" aria-live="polite">{errors.email}</div>}
              <div id="email-help" className="text-xs text-muted">Para recuperar tu cuenta</div>
            </div>
          )}

          {tab === 'register' && role !== 'experto' && (
            <div className="space-y-2">
              <label htmlFor="institution" className="text-sm font-semibold">Institución educativa</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" aria-hidden="true" />
                <select
                  className="input-field gradient-border focus-blue input-with-icon w-full min-h-[44px]"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  id="institution"
                  name="institution"
                  aria-invalid={!!errors.institution}
                  aria-describedby={errors.institution ? 'institution-error' : undefined}
                  required
                >
                  <option value="">Elige tu institución</option>
                  {institutions.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              {errors.institution && <div id="institution-error" className="text-xs text-red-500 mt-1" aria-live="polite">{errors.institution}</div>}
            </div>
          )}

          {errors.general && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm" role="alert" aria-live="polite">{errors.general}</div>
          )}

          {needsEmailVerification && (
            <div className="mt-3 space-y-2">
              <div className="text-sm">Verifica tu correo electrónico para continuar.</div>
              <div className="flex gap-2">
                <button type="button" className="btn-outline btn-pill focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2" onClick={requestEmailCode}>
                  Enviar código
                </button>
                <input
                  type="text"
                  className="input-field focus-blue w-32"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  aria-label="Código de verificación"
                />
                <button type="button" className="btn-cta btn-pill focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2" onClick={confirmEmailCode}>
                  Verificar
                </button>
              </div>
            </div>
          )}

          </div>
          <button
            type="submit"
            className="btn-cta btn-pill w-full mt-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
          >
            {tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
          </form>
        </div>
      </div>
    </div>
  )
}
