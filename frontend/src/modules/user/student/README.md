# Dashboard de Estudiante - NatureIn MVP

## 📊 Descripción

Dashboard completo para estudiantes con métricas de gamificación, sistema de niveles, badges, misiones y seguimiento de actividades.

## 🏗️ Arquitectura

### Frontend (`frontend/src/modules/user_dashboard/`)

```
user_dashboard/
├── StudentDashboard.tsx          # Componente principal
├── types.ts                       # Interfaces TypeScript
├── components/
│   ├── StatsCard.tsx             # Tarjeta de estadística reutilizable
│   ├── LevelIndicator.tsx        # Indicador visual de nivel
│   ├── BadgesList.tsx            # Lista de insignias
│   ├── ActivityFeed.tsx          # Feed de actividades recientes
│   └── MissionsList.tsx          # Lista de misiones con progreso
└── hooks/
    └── useDashboardData.ts       # Hook para cargar datos
```

### Backend

**Endpoint agregado optimizado:** `/api/user/dashboard/`
- Retorna perfil, estadísticas, gamificación y misiones en una sola llamada
- Reduce latencia y cantidad de requests

**Sistema de niveles (8 tiers):**
1. Explorador Novato (0-99 pts)
2. Observador Curioso (100-299 pts)
3. Rastreador de la Naturaleza (300-599 pts)
4. Guardián Verde (600-999 pts)
5. Protector de la Biodiversidad (1000-1999 pts)
6. Maestro Naturalista (2000-3999 pts)
7. Sabio de la Selva (4000-7999 pts)
8. Leyenda Viviente (8000+ pts)

## 🚀 Configuración Inicial

### 1. Ejecutar scripts de backend

#### Crear rangos en la base de datos:

```bash
# Desde el directorio backend/
python manage.py shell
```

Luego dentro del shell:
```python
exec(open('scripts/create_ranks.py').read())
```

#### Crear misiones de ejemplo:

```python
exec(open('scripts/create_sample_missions.py').read())
```

O ejecutar directamente:
```bash
python manage.py shell < scripts/create_ranks.py
python manage.py shell < scripts/create_sample_missions.py
```

### 2. Iniciar servicios

**Backend:**
```bash
cd backend
python manage.py runserver 1220
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🎯 Funcionalidades

### Dashboard de Estudiante

1. **Header Personalizado**
   - Avatar del usuario
   - Nombre completo
   - Institución, grado y sección
   - Posición en el ranking global

2. **Indicador de Nivel**
   - Nombre del nivel actual
   - Tier visual con colores según progreso
   - Barra de progreso animada
   - Puntos actuales vs puntos necesarios

3. **Métricas Principales** (4 tarjetas)
   - Puntos totales y rango
   - Avistamientos totales y verificados
   - Insignias ganadas
   - Actividades registradas

4. **Sistema de Insignias**
   - Visualización con iconos emoji
   - Agrupadas en grid responsive
   - Mensaje motivacional si no hay badges

5. **Misiones**
   - Separadas en Activas y Completadas
   - Barra de progreso por misión
   - Categorías: exploration, knowledge, community, conservation
   - Dificultad: fácil, media, difícil
   - Puntos de recompensa visibles

6. **Feed de Actividad Reciente**
   - Últimas 10 actividades
   - Iconos según tipo de actividad
   - Timestamps relativos (hace X min/horas/días)

7. **Cards Adicionales**
   - Avistamientos pendientes de verificación
   - Consejo motivacional del día

## 🔄 Flujo de Autenticación

Después de login/registro exitoso, el sistema:
1. Obtiene el rol del usuario (`/auth/me/`)
2. Redirige automáticamente según rol:
   - `student` → `/dashboard/student`
   - `teacher` → `/dashboard/teacher`
   - `expert` → `/dashboard/expert`

## 📝 Misiones Creadas

1. **Primer Avistamiento** (20 pts) - Registra tu primer avistamiento
2. **Explorador de la Biodiversidad** (50 pts) - 5 avistamientos diferentes
3. **Guardián del Bosque** (75 pts) - Visita 3 zonas diferentes
4. **Maestro de la Observación** (100 pts) - 3 avistamientos verificados
5. **Conocedor de Especies** (30 pts) - Consulta 10 fichas
6. **Fotógrafo Naturalista** (60 pts) - 5 fotos de alta calidad
7. **Amigo de las Aves** (80 pts) - 5 especies de aves
8. **Conservacionista Activo** (120 pts) - 10 actividades educativas
9. **Explorador Semanal** (150 pts) - 7 días consecutivos
10. **Leyenda de la Naturaleza** (200 pts) - 500 puntos totales

## 🎨 Estilos

El dashboard mantiene la identidad visual del proyecto:
- Colores: verde principal (#4CAF50) y azul (#2196F3)
- Bordes con degradado
- Cards con sombra y hover effects
- Responsive design (mobile-first)
- Animaciones suaves en barras de progreso

## 🔧 Patrones de Diseño Aplicados

1. **Composición de Componentes**: Componentes pequeños y reutilizables
2. **Custom Hooks**: Lógica de datos centralizada
3. **Single Source of Truth**: Un endpoint para todo el dashboard
4. **Tipos TypeScript**: Interfaces compartidas para type safety
5. **Error Boundaries**: Manejo consistente de estados loading/error

## 📊 Optimizaciones

- **Backend**: Una sola query con `select_related` y `aggregate`
- **Frontend**: Hook centralizado evita múltiples llamadas
- **Cache**: Token almacenado en localStorage
- **Responsive**: Grid adaptable según tamaño de pantalla

## 🐛 Debugging

Ver datos del dashboard en consola:
```javascript
// En DevTools Console
localStorage.getItem('token') // Ver token
```

Ver request en Network:
- Buscar `/api/user/dashboard/`
- Revisar Response para ver estructura completa

## 📚 Próximos Pasos

- [ ] Agregar gráficos de progreso temporal
- [ ] Sistema de notificaciones para nuevas badges
- [ ] Comparación con amigos/compañeros
- [ ] Exportar estadísticas en PDF
- [ ] Integrar con calendario académico
