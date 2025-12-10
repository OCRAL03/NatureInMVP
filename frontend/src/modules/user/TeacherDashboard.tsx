import { useEffect, useState } from 'react'
import api from '../../api/client'
import Card from '../../components/ui/Card'
import RoleSidebar from '../../components/layout/RoleSidebar'
import { BarChart3, ListOrdered } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setRole, setUser } from '../auth/authSlice'
import Button from '../../components/ui/Button'

type RankItem = { user_id: number; puntos: number; rango?: string | null }

export default function TeacherDashboard() {
  const [ranking, setRanking] = useState<RankItem[]>([])
  const [loading, setLoading] = useState(false)
  const [me, setMe] = useState<{ username: string; role: string; profile?: any } | null>(null)
  const dispatch = useDispatch()

  const loadRanking = async () => {
    setLoading(true)
    try {
      try {
        const u = await api.get('/auth/me/')
        setMe(u.data)
        dispatch(setRole(u.data?.role || null))
        dispatch(setUser({ username: u.data?.username, role: u.data?.role }))
      } catch {}
      const res = await api.get<RankItem[]>('/gamify/ranking')
      setRanking(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadRanking() }, [])

  return (
    <div className="flex gap-4">
      <RoleSidebar role="teacher" />
      <div className="grid md:grid-cols-3 gap-4 flex-1">
      <Card className="p-4 md:col-span-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">{me?.profile?.full_name || me?.username || 'Usuario'}</span>
          {me?.role && <span className="pill pill-green">{me.role}</span>}
        </div>
      </Card>
      <Card className="p-4 md:col-span-2">
        <div className="flex items-center gap-2 mb-2"><ListOrdered className="w-5 h-5" /> <span className="font-semibold">Ranking del aula</span></div>
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="py-2">#</th>
                <th className="py-2">Usuario</th>
                <th className="py-2">Puntos</th>
                <th className="py-2">Rango</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, idx) => (
                <tr key={r.user_id} className="border-t">
                  <td className="py-2">{idx + 1}</td>
                  <td className="py-2">{r.user_id}</td>
                  <td className="py-2">{r.puntos}</td>
                  <td className="py-2">{r.rango || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-5 h-5" /> <span className="font-semibold">Métricas</span></div>
        <div className="text-sm text-muted">Próximas: tasa de finalización, participación y eventos top.</div>
        <div className="mt-4">
          <Button onClick={async () => {
            try {
              const selected = JSON.parse(localStorage.getItem('teacher_guide_species') || '[]') || []
              const res = await api.post('/content/teaching/guides', { species: selected }, { responseType: 'blob' })
              const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
              const a = document.createElement('a')
              a.href = url
              a.download = 'guia_pedagogica.pdf'
              document.body.appendChild(a)
              a.click()
              a.remove()
              window.URL.revokeObjectURL(url)
            } catch (e) {
              alert('No fue posible generar la guía')
            }
          }}>Descargar guía pedagógica</Button>
        </div>
      </Card>
    </div>
    </div>
  )
}
