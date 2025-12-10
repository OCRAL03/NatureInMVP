import { useEffect, useState } from 'react'
import api from '../../api/client'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Award, Target, Trophy } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setRole, setUser } from '../auth/authSlice'

type BadgeList = { badges: string[] }

export default function StudentDashboard() {
  const [points, setPoints] = useState<number>(0)
  const [badges, setBadges] = useState<string[]>([])
  const [missionProgress, setMissionProgress] = useState<Record<number, { progress: number; completed: boolean }>>({})
  const [me, setMe] = useState<{ username: string; role: string; profile?: any } | null>(null)
  const dispatch = useDispatch()

  const load = async () => {
    try {
      const u = await api.get('/user/me/')
      setMe(u.data)
      dispatch(setRole(u.data?.role || null))
      dispatch(setUser({ username: u.data?.username, role: u.data?.role }))
    } catch {}
    const m = await api.get('/gamify/metrics')
    setPoints(m.data.total_points || 0)
    const b = await api.get<BadgeList>('/gamify/badges/me')
    setBadges(b.data.badges || [])
  }

  useEffect(() => { load() }, [])

  const updateMission = async (missionId: number, progress: number, completed: boolean) => {
    await api.post('/gamify/missions/progress', { mission_id: missionId, progress, completed })
    setMissionProgress((prev) => ({ ...prev, [missionId]: { progress, completed } }))
    load()
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="p-4 md:col-span-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">{me?.profile?.full_name || me?.username || 'Usuario'}</span>
          {me?.role && <span className="pill pill-green">{me.role}</span>}
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2"><Trophy className="w-5 h-5" /> <span className="font-semibold">Mis puntos</span></div>
        <div className="text-2xl">{points}</div>
      </Card>

      <Card className="p-4 md:col-span-2">
        <div className="flex items-center gap-2 mb-3"><Award className="w-5 h-5" /> <span className="font-semibold">Mis insignias</span></div>
        <div className="flex flex-wrap gap-2">
          {badges.length ? badges.map((b) => (
            <span key={b} className="pill pill-green">{b}</span>
          )) : <div className="text-sm text-gray-600">Sin insignias aún</div>}
        </div>
      </Card>

      <Card className="p-4 md:col-span-3">
        <div className="flex items-center gap-2 mb-3"><Target className="w-5 h-5" /> <span className="font-semibold">Mis misiones</span></div>
        <div className="grid md:grid-cols-3 gap-3">
          {[1,2,3].map((id) => {
            const st = missionProgress[id] || { progress: 0, completed: false }
            return (
              <div key={id} className="activity-card p-3">
                <div className="activity-title">Misión #{id}</div>
                <div className="activity-meta">Progreso: {st.progress}% · {st.completed ? 'Completada' : 'Pendiente'}</div>
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => updateMission(id, Math.min(100, st.progress + 20), false)}>+20%</Button>
                  <Button onClick={() => updateMission(id, 100, true)}>Completar</Button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
