import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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
    fullName: '',
    email: '',
    institution: '',
    studyArea: '',
    grade: '',
    section: '',
    subject: ''
  })

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { tab, role, formData })
  }

  const location = useLocation()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const qTab = params.get('tab')
    if (qTab === 'register' || qTab === 'login') {
      setTab(qTab)
    }
  }, [location.search])

  const headline = tab === 'login' ? 'Bienvenido a NatureIn' : role === 'experto' ? 'Comparte tu conocimiento científico' : role === 'docente' ? 'Guía y motiva a tus estudiantes' : 'Aprende jugando con la biodiversidad'
  const subcopy = tab === 'login' ? 'Ingresa para continuar tu exploración y misiones' : 'Crea tu cuenta según tu rol para personalizar tu experiencia'

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        <div className="card p-6">
          <div className="mb-4">
            <div className="text-2xl font-bold">{headline}</div>
            <div className="text-sm text-gray-700 mt-1">{subcopy}</div>
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
              <div className="text-sm font-semibold text-gray-700">Selecciona tu rol</div>
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
              <label className="text-sm font-semibold text-gray-700">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  className="input-field gradient-border focus-blue pl-14 w-full min-h-[44px]"
                  placeholder="Juan Pérez García"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="text-xs text-gray-600">Nombres y apellidos completos</div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                className="input-field gradient-border focus-blue pl-14 w-full min-h-[44px]"
                placeholder={tab === 'login' ? 'Ingresa tu usuario' : 'Elige un usuario'}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            {tab === 'register' && (
              <div className="text-xs text-gray-600">Será tu identificador para iniciar sesión</div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field gradient-border focus-blue pl-14 pr-10 w-full min-h-[44px]"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-xs text-gray-600">
              {tab === 'register' ? 'Mínimo 8 caracteres, combina letras y números' : 'Tu contraseña segura'}
            </div>
          </div>

          {tab === 'register' && role === 'estudiante' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Grado y sección</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select
                    className="input-field gradient-border focus-blue pl-14 w-full min-h-[44px]"
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
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select
                    className="input-field gradient-border focus-blue pl-14 w-full min-h-[44px]"
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
            </div>
          )}

          {tab === 'register' && role === 'docente' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Área o curso</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  className="input-field gradient-border focus-blue pl-14 w-full min-h-[44px]"
                  placeholder="Ciencia y Ambiente, Biología, etc."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
            </div>
          )}

          {tab === 'register' && role === 'experto' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Área de especialidad</label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  className="input-field gradient-border focus-blue pl-14 w-full min-h-[44px]"
                  placeholder="Biología, Ecología, etc."
                  value={formData.studyArea}
                  onChange={(e) => setFormData({ ...formData, studyArea: e.target.value })}
                />
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  className="input-field gradient-border focus-blue pl-14 w-full min-h-[44px]"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="text-xs text-gray-600">Para recuperar tu cuenta</div>
            </div>
          )}

          {tab === 'register' && role !== 'experto' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Institución educativa</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  className="input-field gradient-border focus-blue pl-14 w-full min-h-[44px]"
                  placeholder="Nombre de tu colegio o universidad"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                />
              </div>
            </div>
          )}

          <button onClick={handleSubmit} className="btn-cta btn-pill w-full mt-2">{tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</button>
          </div>
        </div>
        <div className="hidden md:block rounded-card overflow-hidden bg-white relative">
          <img src={tab === 'login' ? imgCascadaPavas : imgCotomono} alt={tab === 'login' ? 'Cascada Pavas' : 'Cotomono'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </div>
    </div>
  )
}
