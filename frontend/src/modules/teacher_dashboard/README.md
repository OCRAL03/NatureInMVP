# Dashboard de Docentes - NatureIn MVP

## 📁 Estructura

```
teacher_dashboard/
├── TeacherDashboard.tsx          # Componente principal con navegación por pestañas
├── types.ts                       # Definiciones TypeScript
├── components/
│   ├── TeacherStats.tsx          # Tarjetas de estadísticas principales
│   ├── StudentCard.tsx           # ✨ Tarjeta individual de estudiante
│   ├── FiltersBar.tsx            # ✨ Barra de filtros y búsqueda
│   ├── StudentDetailModal.tsx    # ✨ Modal con detalles completos
│   └── ProgressChart.tsx         # ✨ Gráfico SVG de progreso
└── hooks/
    ├── useTeacherData.ts         # Hooks para gestión de datos (mock)
    └── useStudentFilters.ts      # ✨ Hook para filtrado de estudiantes
```

## 🎯 Características Implementadas

### ✅ FASE 1 - Dashboard Base (Completada)
- **Header personalizado** con información del docente
- **Sistema de pestañas** con 4 secciones
- **Estadísticas principales** (4 tarjetas métricas)
- **Vista General** con actividades y avistamientos
- **Tabla básica de estudiantes**

### ✅ FASE 2 - Gestión Avanzada de Estudiantes (Completada)

#### 🎴 StudentCard - Tarjetas Interactivas
- **Avatar con iniciales** y gradiente verde/esmeralda
- **Indicador de actividad** (punto verde si activo en última hora)
- **3 estadísticas rápidas** con colores distintivos:
  - 💚 Puntos (verde)
  - 💙 Badges (azul)
  - 🧡 Avistamientos (ámbar)
- **Badge de rango** con estilo púrpura
- **Barra de progreso animada** con gradiente verde-esmeralda-teal
- **Indicador de estado** (¡Excelente! / Bien / Necesita atención)
- **Última actividad** con fecha formateada
- **Efecto hover** con escala y sombra
- **Click para ver detalles** completos

#### 🔍 FiltersBar - Búsqueda y Filtrado
- **Búsqueda en tiempo real** por nombre o username
- **Filtros avanzados** (colapsables):
  - Grado
  - Sección
  - Ordenar por: Puntos / Nombre / % Completitud
  - Orden: Ascendente / Descendente
- **Pills de filtros activos** con botón para eliminar individualmente
- **Botón "Limpiar"** para resetear todos los filtros
- **Diseño responsivo** con grid adaptativo

#### 📊 StudentDetailModal - Vista Completa
**Header:**
- Avatar grande con iniciales
- Nombre completo y username
- Pills de grado/sección y rango
- Botón cerrar

**Información de Contacto:**
- Email del estudiante
- Última actividad con formato completo

**Estadísticas Destacadas (4 cards):**
- 💚 Puntos Totales
- 💙 Insignias
- 🧡 Avistamientos
- 💜 % Completitud

**Gráfico de Progreso:**
- Chart SVG nativo con animación
- Área bajo la curva con gradiente
- Línea principal animada (pathLength)
- Puntos de datos con tooltips
- Leyenda de fechas y valores

**Insignias Obtenidas:**
- Grid responsivo de badges
- Emoji representativo
- Nombre de la insignia
- Fecha de obtención
- Animación escalonada al aparecer
- Efecto hover con escala

**Actividad Reciente:**
- Timeline de últimas acciones
- Iconos por tipo (avistamiento/quiz/badge)
- Descripción y puntos ganados
- Fecha y hora formateada
- Animación de entrada lateral

**Footer:**
- Botón "Cerrar"
- Botón "Enviar Mensaje" (futuro)

#### 📈 ProgressChart - Gráfico SVG
- **Renderizado SVG nativo** (sin librerías externas)
- **Gradiente en área** bajo la curva
- **Línea animada** con pathLength
- **Puntos interactivos** con tooltips
- **Escala automática** según datos
- **Leyendas** de fechas y valores
- **Responsive** con preserveAspectRatio

#### 🎣 useStudentFilters - Lógica de Filtrado
- **Memorización** de resultados filtrados
- **Filtros combinados** (búsqueda + grado + sección)
- **Ordenamiento múltiple** (nombre/puntos/completitud)
- **Contador de resultados** filtrados vs totales
- **Listas únicas** de grados y secciones disponibles

### 🎨 Diseño y UX (Mejorado)

### Paleta de Colores (Ampliada)
- **Verde suave**: `from-green-100 to-emerald-100` (light) / `from-green-900/30 to-emerald-900/30` (dark)
- **Azul**: Para información, badges y métricas
- **Ámbar**: Para alertas, pendientes y avistamientos
- **Púrpura**: Para rangos y destacados
- **Gradientes animados**: Verde → Esmeralda → Teal en barras de progreso

### Animaciones (Framer Motion)
- **Entrada de cards**: opacity 0→1, scale 0.95→1
- **Hover effects**: scale 1→1.02, shadow aumentada
- **Gráfico SVG**: pathLength 0→1, puntos scale 0→1
- **Modal**: backdrop blur, scale 0.95→1 con y-offset
- **Timeline**: entrada lateral (x: -20→0)
- **Badges**: escalonadas con delay incremental

### Estados Interactivos
- **Cards hover**: Escala + sombra
- **Botones**: Transición de colores
- **Inputs**: Border highlight al focus
- **Filtros activos**: Pills animadas con X para eliminar
- **Loading states**: Skeleton screens con pulse

## 📊 Datos Mock

Los hooks en `useTeacherData.ts` actualmente retornan datos de prueba:

### `useTeacherStats()`
```typescript
{
  total_students: 42,
  active_today: 28,
  average_points: 847,
  top_student: { id: 1, full_name: 'Ana García', points: 1520 },
  total_activities: 12,
  pending_sightings: 5,
  completion_rate: 68,
  engagement_rate: 75
}
```

### `useStudents()`
Retorna 3 estudiantes de ejemplo con datos completos de perfil y progreso.


## 🔄 Próximas Fases

### FASE 3: Gestión de Actividades
- [ ] Formulario crear nueva actividad (tipo, puntos, deadline)
- [ ] Asignar actividades a estudiantes/grupos específicos
- [ ] Editar/eliminar actividades existentes
- [ ] Ver detalles de completitud por estudiante
- [ ] Notificaciones de actividades próximas a vencer
- [ ] Exportar reporte de actividades

### FASE 4: Aprobación de Avistamientos
- [ ] Modal de revisión detallada con foto ampliada
- [ ] Información de contexto (ubicación, descripción, estudiante)
- [ ] Botones aprobar/rechazar con confirmación
- [ ] Campo de comentarios del docente
- [ ] Historial de verificaciones realizadas
- [ ] Estadísticas de tasa de aprobación

### FASE 5: Creación de Contenido
- [ ] Integración completa con `/content/generate_ficha`
- [ ] Editor de fichas con preview
- [ ] Biblioteca de contenido creado por el docente
- [ ] Asignar contenido específico a actividades
- [ ] Etiquetar contenido por temas/grados
- [ ] Duplicar y modificar fichas existentes

### FASE 6: Asignación de Juegos
- [ ] Catálogo de minijuegos disponibles
- [ ] Asignar juegos a estudiantes individuales o grupos
- [ ] Configurar parámetros (dificultad, tiempo límite)
- [ ] Ver resultados y puntajes
- [ ] Estadísticas de tiempo de juego
- [ ] Leaderboard de juegos

### FASE 7: Analíticas Avanzadas
- [ ] Integrar librería de gráficos (Chart.js/Recharts)
- [ ] Gráfico de tendencias de participación semanal/mensual
- [ ] Comparativas entre secciones/grados
- [ ] Heatmap de actividad por día/hora
- [ ] Exportar reportes en PDF/Excel
- [ ] Dashboard de métricas institucionales
### FASE 7: Analíticas Avanzadas
- [ ] Gráficos con Chart.js/Recharts
- [ ] Tendencias de participación
- [ ] Comparativas por sección
- [ ] Exportar reportes

## 🔌 Endpoints Backend Necesarios

### Existentes (ya funcionan)
- ✅ `GET /auth/me/` - Información del docente
- ✅ `GET /gamify/ranking` - Ranking de estudiantes

### Por Implementar
```
GET  /users/students/             # Lista estudiantes por institución
GET  /users/students/{id}/        # Detalle estudiante
GET  /users/students/{id}/stats/  # Estadísticas estudiante

POST /activities/                 # Crear actividad
GET  /activities/                 # Listar actividades
PUT  /activities/{id}/            # Actualizar actividad
POST /activities/{id}/assign/     # Asignar a estudiantes

GET  /sightings/pending/          # Avistamientos pendientes
PUT  /sightings/{id}/verify/      # Verificar avistamiento

POST /gamify/assign-game/         # Asignar juego
GET  /gamify/game-results/        # Resultados de juegos
```

## 🚀 Uso

El dashboard se activa automáticamente cuando un usuario con rol `teacher` inicia sesión:

```typescript
// En App.tsx o rutas protegidas
<Route path="/dashboard" element={
  <ProtectedRoute>
    <TeacherDashboard />
  </ProtectedRoute>
} />
```

## 📝 Notas de Desarrollo

- **TypeScript estricto**: Todas las interfaces están tipadas
- **Responsive**: Layout adaptativo móvil/tablet/desktop
- **Accesibilidad**: Uso de iconos Lucide con labels semánticos
- **Performance**: Datos mock cargados con delay simulado
- **Dark mode**: Soporte completo con CSS variables

## 🎓 Para Estudiantes de Alto Rendimiento

El dashboard está diseñado para ser **profesional pero accesible**:
- Colores suaves y no saturados (feedback del usuario)
- Información clara y jerarquizada
- Animaciones sutiles que no distraen
- Métricas visuales fáciles de interpretar
