/**
 * Tipos TypeScript para el Dashboard de Expertos
 * NatureIn MVP - Sistema de Validación Científica
 */

export interface ExpertProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  specialty: string; // "Ornitología", "Botánica", "Herpetología", etc.
  institution: string;
  certifications: string[];
  avatar_url?: string;
  bio?: string;
}

export interface ValidationStats {
  total_reviews: number;
  approved_count: number;
  rejected_count: number;
  pending_count: number;
  avg_review_time: number; // Minutos
  reviews_this_week: number;
  reviews_this_month: number;
  approval_rate: number; // Porcentaje 0-100
}

export interface SightingReview {
  id: number;
  user: {
    id: number;
    username: string;
    full_name: string;
    avatar_url?: string;
    grade?: string;
    section?: string;
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
  confidence_level?: number; // 0-1
  created_at: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  
  // Campos de validación experta
  taxonomy_verified?: boolean;
  scientific_notes?: string;
  suggested_corrections?: string;
  taxonomy_suggestion?: {
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
    species?: string;
    common_name?: string;
  };
  verified_by?: number;
  verified_at?: string;
  verification_comment?: string;
  reward_points?: number;
  
  // Campos adicionales para expertos
  rarity_level?: 'common' | 'uncommon' | 'rare' | 'endemic' | 'endangered';
  observation_quality?: 'needs_id' | 'research' | 'casual';
  flagged_for_review?: boolean;
  expert_consensus_needed?: boolean;
}

export interface FichaReview {
  id: number;
  title: string;
  scientific_name: string;
  common_name: string;
  author: {
    id: number;
    full_name: string;
    role: 'teacher' | 'student' | 'expert';
  };
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  description: string;
  morphology: string;
  habitat: string;
  distribution: string;
  behavior: string;
  conservation_status: string;
  iucn_status?: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX' | 'DD' | 'NE';
  images: string[];
  references: string[];
  created_at: string;
  updated_at: string;
  validation_status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  scientific_accuracy?: number; // 1-5 estrellas
  reviewed_by?: number;
  reviewed_at?: string;
  review_comments?: string;
  corrections?: FichaCorrection[];
  quality_score?: number; // 0-100
}

export interface FichaCorrection {
  field: string;
  original_value: string;
  suggested_value: string;
  comment: string;
  severity: 'minor' | 'major' | 'critical';
}

export interface FichaValidation {
  ficha_id: number;
  action: 'approve' | 'approve_with_corrections' | 'reject' | 'request_changes';
  scientific_accuracy: number; // 1-5
  taxonomy_verified: boolean;
  corrections: FichaCorrection[];
  general_comments: string;
  suggestions: string;
  references_to_add?: string[];
}

export interface FichaFilters {
  search: string;
  status: FichaReview['validation_status'] | 'all';
  organism_type: 'all' | 'animal' | 'plant' | 'fungi' | 'other';
  author_role: 'all' | 'teacher' | 'student';
  date_from: string;
  date_to: string;
  sort_by: 'date' | 'name' | 'accuracy';
  sort_order: 'asc' | 'desc';
}

export interface ReviewFilters {
  search: string;
  status: SightingReview['verification_status'] | 'all';
  confidenceMin: number;
  confidenceMax: number;
  rarity: SightingReview['rarity_level'] | 'all';
  dateFrom: string;
  dateTo: string;
  student: number | null;
  sortBy: 'date' | 'confidence' | 'species';
  sortOrder: 'asc' | 'desc';
}

export interface ExpertAction {
  action: 'approve' | 'reject' | 'request_info' | 'flag';
  sightingId: number;
  points?: number;
  scientificNotes?: string;
  taxonomyCorrection?: boolean;
  suggestionData?: Partial<SightingReview['taxonomy_suggestion']>;
  reason?: string;
  questions?: string;
}

export type ExpertTabKey = 'overview' | 'sightings' | 'fichas' | 'analytics' | 'reports' | 'certifications' | 'training';

// ============================================
// ANALYTICS TYPES (Fase 3)
// ============================================

export interface BiodiversityStats {
  total_species: number;
  species_validated: number;
  unique_families: number;
  unique_kingdoms: number;
  endemic_species: number;
  threatened_species: number;
}

export interface TaxonomyDistribution {
  kingdom: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface FamilyDistribution {
  family: string;
  kingdom: string;
  count: number;
  percentage: number;
}

export interface ValidationMetrics {
  period: 'week' | 'month' | 'quarter' | 'year' | 'all' | 'custom';
  total_validations: number;
  approved: number;
  rejected: number;
  needs_revision: number;
  avg_accuracy_score: number; // 1-5
  avg_response_time: number; // horas
  quality_trend: 'improving' | 'stable' | 'declining';
}

export interface TemporalData {
  date: string; // ISO date
  approved: number;
  rejected: number;
  needs_revision: number;
  total: number;
}

export interface ConservationStats {
  iucn_status: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX' | 'DD' | 'NE';
  count: number;
  percentage: number;
}

export interface ExpertContribution {
  expert_name: string;
  total_validations: number;
  approval_rate: number;
  avg_accuracy: number;
  specialty: string;
}

export interface AnalyticsPeriod {
  label: string;
  value: 'week' | 'month' | 'quarter' | 'year' | 'all';
  days: number;
}

// ============================================
// REPORT TYPES (Fase 4)
// ============================================

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'validation' | 'biodiversity' | 'activity' | 'custom';
  requiredData: string[];
}

export interface ReportConfig {
  template_id: string;
  title: string;
  period: AnalyticsPeriod['value'];
  date_from: string;
  date_to: string;
  include_sections: {
    summary: boolean;
    validation_stats: boolean;
    biodiversity_analysis: boolean;
    temporal_trends: boolean;
    species_list: boolean;
    expert_notes: boolean;
    recommendations: boolean;
  };
  filters: {
    kingdoms?: string[];
    validation_status?: ('approved' | 'rejected' | 'pending' | 'needs_revision')[];
    min_accuracy?: number;
  };
  format: 'pdf' | 'excel' | 'csv' | 'json';
  language: 'es' | 'en';
}

export interface ReportData {
  metadata: {
    title: string;
    generated_at: string;
    generated_by: string;
    period: string;
    date_range: {
      from: string;
      to: string;
    };
  };
  summary: {
    total_validations: number;
    total_species: number;
    approval_rate: number;
    avg_accuracy: number;
  };
  validation_stats: ValidationMetrics;
  biodiversity: BiodiversityStats;
  taxonomy_distribution: TaxonomyDistribution[];
  temporal_data: TemporalData[];
  species_list: SpeciesSummary[];
  expert_notes?: string;
  recommendations?: string[];
}

export interface SpeciesSummary {
  id: number;
  scientific_name: string;
  common_name: string;
  kingdom: string;
  family: string;
  validation_status: 'approved' | 'rejected' | 'pending' | 'needs_revision';
  accuracy_score?: number;
  validated_at?: string;
  iucn_status?: string;
}

export interface ReportExportOptions {
  filename: string;
  format: ReportConfig['format'];
  compress?: boolean;
  include_images?: boolean;
  page_size?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
}

export interface ReportGenerationResult {
  success: boolean;
  report_id?: string;
  download_url?: string;
  error?: string;
  estimated_size?: number;
}
