import { useState } from 'react';
import api from '../../../../api/client.ts';
import type { SightingReview, ExpertAction } from '../types';

interface ReviewResult {
  success: boolean;
  message: string;
}

/**
 * Hook para gestionar la revisión de avistamientos por expertos
 * Incluye aprobación, rechazo, solicitud de información y marcado para revisión por pares
 */
export function useSightingReview() {
  const [sightings, setSightings] = useState<SightingReview[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Aprobar un avistamiento con validación científica
   */
  const approveSighting = async (
    sightingId: number,
    points: number,
    scientificNotes: string,
    taxonomyVerified: boolean = true,
    taxonomySuggestion?: SightingReview['taxonomy_suggestion']
  ): Promise<ReviewResult> => {
    setLoading(true);

    try {
      await api.post(`/expert/sightings/${sightingId}/approve/`, {
        points,
        scientific_notes: scientificNotes,
        taxonomy_verified: taxonomyVerified,
      });

      // Actualizar estado local
      setSightings(prev => prev.map(sighting => {
        if (sighting.id === sightingId) {
          return {
            ...sighting,
            verification_status: 'verified' as const,
            taxonomy_verified: taxonomyVerified,
            scientific_notes: scientificNotes,
            taxonomy_suggestion: taxonomySuggestion,
            verified_at: new Date().toISOString(),
            verification_comment: scientificNotes,
            reward_points: points,
            observation_quality: points >= 150 ? 'research' : sighting.observation_quality,
          };
        }
        return sighting;
      }));

      setLoading(false);

      return {
        success: true,
        message: `Avistamiento aprobado. ${points} puntos otorgados al estudiante.`,
      };
    } catch (error) {
      setLoading(false);
      console.error('Error aprobando avistamiento:', error);
      return {
        success: false,
        message: 'Error al aprobar el avistamiento. Intenta nuevamente.',
      };
    }
  };

  /**
   * Rechazar un avistamiento con explicación científica
   */
  const rejectSighting = async (
    sightingId: number,
    reason: string,
    suggestions?: string
  ): Promise<ReviewResult> => {
    setLoading(true);

    if (!reason.trim()) {
      setLoading(false);
      return {
        success: false,
        message: 'Se requiere una explicación científica para rechazar el avistamiento',
      };
    }

    try {
      await api.post(`/expert/sightings/${sightingId}/reject/`, {
        reason,
        suggestions,
      });

      // Actualizar estado local
      setSightings(prev => prev.map(sighting => {
        if (sighting.id === sightingId) {
          return {
            ...sighting,
            verification_status: 'rejected' as const,
            taxonomy_verified: false,
            scientific_notes: reason,
            suggested_corrections: suggestions,
            verified_at: new Date().toISOString(),
            verification_comment: reason,
          };
        }
        return sighting;
      }));

      setLoading(false);

      return {
        success: true,
        message: 'Avistamiento rechazado con feedback educativo enviado al estudiante',
      };
    } catch (error) {
      setLoading(false);
      console.error('Error rechazando avistamiento:', error);
      return {
        success: false,
        message: 'Error al rechazar el avistamiento. Intenta nuevamente.',
      };
    }
  };

  /**
   * Solicitar más información al estudiante
   */
  const requestMoreInfo = async (
    sightingId: number,
    questions: string
  ): Promise<ReviewResult> => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 400));

    // En producción, esto enviaría una notificación al estudiante
    console.log(`Solicitando más información para avistamiento #${sightingId}:`, questions);

    setLoading(false);

    return {
      success: true,
      message: 'Solicitud de información enviada al estudiante',
    };
  };

  /**
   * Marcar avistamiento para revisión por otro experto (peer review)
   */
  const flagForPeerReview = async (
    sightingId: number,
    requiredSpecialty: string,
    notes: string
  ): Promise<ReviewResult> => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 400));

    setSightings(prev => prev.map(sighting => {
      if (sighting.id === sightingId) {
        return {
          ...sighting,
          flagged_for_review: true,
          expert_consensus_needed: true,
          scientific_notes: `Requiere revisión de experto en ${requiredSpecialty}. ${notes}`,
        };
      }
      return sighting;
    }));

    setLoading(false);

    return {
      success: true,
      message: `Marcado para revisión por experto en ${requiredSpecialty}`,
    };
  };

  /**
   * Revisión masiva (aprobar/rechazar múltiples)
   */
  const bulkReview = async (
    sightingIds: number[],
    action: 'approve' | 'reject',
    defaultPoints: number = 50,
    defaultReason: string = ''
  ): Promise<ReviewResult> => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const count = sightingIds.length;

    setSightings(prev => prev.map(sighting => {
      if (sightingIds.includes(sighting.id)) {
        if (action === 'approve') {
          return {
            ...sighting,
            verification_status: 'verified' as const,
            taxonomy_verified: true,
            verified_by: 1,
            verified_at: new Date().toISOString(),
            reward_points: defaultPoints,
          };
        } else {
          return {
            ...sighting,
            verification_status: 'rejected' as const,
            taxonomy_verified: false,
            verified_by: 1,
            verified_at: new Date().toISOString(),
            verification_comment: defaultReason,
          };
        }
      }
      return sighting;
    }));

    setLoading(false);

    return {
      success: true,
      message: `${count} avistamientos ${action === 'approve' ? 'aprobados' : 'rechazados'} exitosamente`,
    };
  };

  /**
   * Obtener estadísticas de revisión
   */
  const getReviewStats = () => {
    const total = sightings.length;
    const pending = sightings.filter(s => s.verification_status === 'pending').length;
    const verified = sightings.filter(s => s.verification_status === 'verified').length;
    const rejected = sightings.filter(s => s.verification_status === 'rejected').length;
    const flagged = sightings.filter(s => s.flagged_for_review).length;
    const needsConsensus = sightings.filter(s => s.expert_consensus_needed).length;

    return {
      total,
      pending,
      verified,
      rejected,
      flagged,
      needsConsensus,
      approvalRate: total > 0 ? Math.round((verified / (verified + rejected)) * 100) : 0,
    };
  };

  /**
   * Filtrar avistamientos por múltiples criterios
   */
  const filterSightings = (
    searchTerm: string = '',
    status: SightingReview['verification_status'] | 'all' = 'all',
    confidenceMin: number = 0,
    confidenceMax: number = 1,
    rarity: SightingReview['rarity_level'] | 'all' = 'all',
    quality: SightingReview['observation_quality'] | 'all' = 'all',
    flaggedOnly: boolean = false
  ) => {
    return sightings.filter(sighting => {
      const matchesSearch = 
        sighting.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sighting.common_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sighting.user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = status === 'all' || sighting.verification_status === status;
      
      const matchesConfidence = 
        !sighting.confidence_level || 
        (sighting.confidence_level >= confidenceMin && sighting.confidence_level <= confidenceMax);
      
      const matchesRarity = rarity === 'all' || sighting.rarity_level === rarity;
      
      const matchesQuality = quality === 'all' || sighting.observation_quality === quality;
      
      const matchesFlagged = !flaggedOnly || sighting.flagged_for_review;

      return matchesSearch && matchesStatus && matchesConfidence && matchesRarity && matchesQuality && matchesFlagged;
    });
  };

  /**
   * Actualizar la lista de avistamientos (para sincronizar con datos externos)
   */
  const setSightingsList = (newSightings: SightingReview[]) => {
    setSightings(newSightings);
  };

  return {
    sightings,
    loading,
    approveSighting,
    rejectSighting,
    requestMoreInfo,
    flagForPeerReview,
    bulkReview,
    getReviewStats,
    filterSightings,
    setSightingsList,
  };
}
