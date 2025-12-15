/**
 * Tipos TypeScript para el Dashboard de Docentes
 * NatureIn MVP - Sistema de gestión educativa
 */

export interface TeacherProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  subject: string;
  institution: string;
  avatar_url?: string;
}

export interface StudentSummary {
  id: number;
  username: string;
  full_name: string;
  email: string;
  grade: string;
  section: string;
  points: number;
  rank: string | null;
  badges_count: number;
  sightings_count: number;
  activities_completed: number;
  activities_total: number;
  last_active: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  type: 'quiz' | 'exploration' | 'research' | 'reading';
  reward_points: number;
  deadline: string | null;
  created_by: number;
  created_at: string;
  assigned_to: number[];
  completion_count: number;
  total_assigned: number;
  status: 'active' | 'completed' | 'expired';
}

export interface SightingPending {
  id: number;
  user: {
    id: number;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  species: string;
  common_name?: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  photo_url: string;
  description: string;
  notes: string;
  confidence_level?: number;
  created_at: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_by?: number;
  verified_at?: string;
  verification_comment?: string;
  reward_points?: number;
}

export interface TeacherStats {
  total_students: number;
  active_today: number;
  average_points: number;
  top_student: {
    id: number;
    full_name: string;
    points: number;
  } | null;
  total_activities: number;
  pending_sightings: number;
  completion_rate: number;
  engagement_rate: number;
}

export interface ContentItem {
  id: number;
  title: string;
  type: 'species' | 'route' | 'article';
  created_at: string;
  views: number;
  assigned_to_activities: number;
}

export interface GameAssignment {
  id: number;
  game_id: number;
  game_title: string;
  student_id: number;
  student_name: string;
  assigned_at: string;
  completed: boolean;
  score: number | null;
  time_spent: number | null;
}

export type TabKey = 'overview' | 'students' | 'activities' | 'content';
