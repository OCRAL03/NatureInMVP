/**
 * Tipos compartidos para el dashboard de usuarios
 */

export interface UserProfile {
  id: number
  username: string
  email: string
  role: 'student' | 'teacher' | 'expert'
  full_name: string
  institution?: string
  grade?: string
  section?: string
  subject?: string
  study_area?: string
  avatar_url?: string
  date_joined: string
}

export interface UserStats {
  total_sightings: number
  verified_sightings: number
  pending_sightings: number
  total_activities: number
}

export interface GamifyMetrics {
  total_points: number
  rank: string | null
  rank_position?: number
  badges: string[]
  level: UserLevel
}

export interface UserLevel {
  name: string
  tier: number
  min_points: number
  max_points: number
  progress_percentage: number
}

export interface Badge {
  name: string
  description?: string
  icon?: string
  awarded_at?: string
}

export interface Mission {
  id: number
  title: string
  description: string
  reward_points: number
  category: 'exploration' | 'knowledge' | 'community' | 'conservation'
  difficulty: 'easy' | 'medium' | 'hard'
  icon?: string
}

export interface UserMissionProgress {
  mission_id: number
  mission: Mission
  progress: number
  completed: boolean
  updated_at: string
}

export interface Activity {
  id: number
  activity_type: 'login' | 'sighting' | 'content_view' | 'badge_earned' | 'profile_update'
  description: string
  created_at: string
  metadata?: Record<string, any>
}

export interface DashboardData {
  profile: UserProfile
  stats: UserStats
  gamify: GamifyMetrics
  missions: UserMissionProgress[]
  recent_activities: Activity[]
}

export interface LoadingState<T> {
  data: T | null
  loading: boolean
  error: string | null
}
