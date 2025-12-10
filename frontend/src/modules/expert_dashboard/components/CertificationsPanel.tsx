/**
 * Panel de Certificaciones para Expertos
 * Permite otorgar badges y certificados a usuarios destacados
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, Medal, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import api from '../../../api/client';

interface User {
  id: number;
  username: string;
  full_name: string;
  total_points: number;
  badges_count: number;
  sightings_count: number;
  verified_sightings: number;
  approval_rate: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  color: string;
}

const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'explorer',
    name: 'Explorador',
    description: 'Registró 10+ avistamientos verificados',
    icon: '🔍',
    criteria: '10 avistamientos verificados',
    color: 'blue'
  },
  {
    id: 'expert_eye',
    name: 'Ojo Experto',
    description: 'Tasa de aprobación superior al 80%',
    icon: '👁️',
    criteria: 'Aprobación > 80%',
    color: 'green'
  },
  {
    id: 'species_master',
    name: 'Maestro de Especies',
    description: 'Identificó correctamente 20+ especies diferentes',
    icon: '🦜',
    criteria: '20+ especies únicas',
    color: 'purple'
  },
  {
    id: 'field_scientist',
    name: 'Científico de Campo',
    description: 'Contribuyó con 50+ observaciones de calidad',
    icon: '🔬',
    criteria: '50+ observaciones',
    color: 'amber'
  },
  {
    id: 'biodiversity_champion',
    name: 'Campeón de Biodiversidad',
    description: 'Documentó especies de 5+ familias diferentes',
    icon: '🌿',
    criteria: '5+ familias taxonómicas',
    color: 'emerald'
  }
];

export default function CertificationsPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  useEffect(() => {
    loadTopUsers();
  }, []);

  const loadTopUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expert/certifications/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      // Fallback a datos mock si falla
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'carlos_nature',
          full_name: 'Carlos Mendoza',
          total_points: 1250,
          badges_count: 3,
          sightings_count: 45,
          verified_sightings: 38,
          approval_rate: 84.4
        }
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleAwardBadge = async (userId: number, badgeId: string) => {
    try {
      const response = await api.post('/expert/certifications/award-badge/', {
        user_id: userId,
        badge_id: badgeId
      });

      alert(`Badge "${response.data.badge_name}" otorgado exitosamente a ${response.data.user}`);
      setSelectedUser(null);
      setSelectedBadge(null);
      loadTopUsers();
    } catch (error: any) {
      console.error('Error otorgando badge:', error);
      const message = error.response?.data?.detail || 'Error al otorgar badge';
      alert(message);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-texto)' }}>
              <Award className="w-6 h-6 inline mr-2" />
              Sistema de Certificaciones
            </h2>
            <p className="text-muted">
              Otorga badges y reconocimientos a usuarios destacados
            </p>
          </div>
        </div>
      </div>

      {/* Badges Disponibles */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-texto)' }}>
          Badges Disponibles
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_BADGES.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedBadge?.id === badge.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
              onClick={() => setSelectedBadge(badge)}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <h4 className="font-semibold mb-1" style={{ color: 'var(--color-texto)' }}>
                {badge.name}
              </h4>
              <p className="text-xs text-muted mb-2">{badge.description}</p>
              <div className="text-xs font-medium" style={{ color: `var(--color-${badge.color})` }}>
                {badge.criteria}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-texto)' }}>
            Usuarios Destacados
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              style={{ color: 'var(--color-texto)' }}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted">Cargando usuarios...</div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg transition-all ${
                  selectedUser === user.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                          {user.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                          {user.full_name}
                        </h4>
                        <p className="text-xs text-muted">@{user.username}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div className="text-center p-2 rounded bg-white dark:bg-gray-900/50">
                        <div className="text-lg font-bold text-blue-600">{user.total_points}</div>
                        <div className="text-xs text-muted">Puntos</div>
                      </div>
                      <div className="text-center p-2 rounded bg-white dark:bg-gray-900/50">
                        <div className="text-lg font-bold text-amber-600">{user.badges_count}</div>
                        <div className="text-xs text-muted">Badges</div>
                      </div>
                      <div className="text-center p-2 rounded bg-white dark:bg-gray-900/50">
                        <div className="text-lg font-bold text-green-600">{user.verified_sightings}</div>
                        <div className="text-xs text-muted">Verificados</div>
                      </div>
                      <div className="text-center p-2 rounded bg-white dark:bg-gray-900/50">
                        <div className="text-lg font-bold text-purple-600">{user.approval_rate.toFixed(1)}%</div>
                        <div className="text-xs text-muted">Aprobación</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                    className="ml-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    {selectedUser === user.id ? 'Cancelar' : 'Otorgar Badge'}
                  </button>
                </div>

                {/* Award Badge Section */}
                {selectedUser === user.id && selectedBadge && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{selectedBadge.icon}</div>
                        <div>
                          <div className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                            {selectedBadge.name}
                          </div>
                          <div className="text-xs text-muted">{selectedBadge.description}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAwardBadge(user.id, selectedBadge.id)}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirmar
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-8 text-muted">
            No se encontraron usuarios
          </div>
        )}
      </div>
    </div>
  );
}
