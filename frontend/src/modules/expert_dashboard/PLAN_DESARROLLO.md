# Plan de Desarrollo - Dashboard de Expertos
## NatureIn MVP - Sistema de Validación de Contenido Científico

---

## 📋 VISIÓN GENERAL

**Usuario objetivo:** Biólogos, naturalistas y expertos en biodiversidad de la región de Tingo María

**Objetivo principal:** Proporcionar herramientas profesionales para la validación científica de avistamientos, fichas de especies y contenido educativo generado por la comunidad.

**Responsabilidades del experto:**
- ✅ Aprobar/rechazar avistamientos de estudiantes
- ✅ Validar fichas informativas de especies (creadas por docentes/estudiantes)
- ✅ Verificar identificación taxonómica
- ✅ Corregir datos científicos
- ✅ Aportar conocimiento especializado
- ✅ Mantener la calidad científica del contenido
- ✅ Generar reportes de biodiversidad

---

## 🎯 FASES DE DESARROLLO

### **FASE 1: Estructura Base y Aprobación de Avistamientos** ⭐ PRIORITARIO
**Tiempo estimado:** 3-4 horas
**Descripción:** Dashboard básico con sistema completo de aprobación de avistamientos

#### Componentes a crear:
1. **ExpertDashboard.tsx** - Contenedor principal
   - Header con perfil del experto (nombre, especialidad, institución)
   - Sistema de tabs (Avistamientos, Fichas, Estadísticas, Reportes)
   - Estado inicial en pestaña "Avistamientos"

2. **ExpertStats.tsx** - Métricas clave
   - Avistamientos pendientes de revisión
   - Fichas pendientes de validación
   - Total de validaciones realizadas (semana/mes)
   - Tasa de aprobación
   - Especies más reportadas
   - Estudiantes más activos

3. **SightingReviewPanel.tsx** - Panel principal de revisión
   - Reutilizar `SightingCard`, `SightingDetailModal` de teacher_dashboard
   - Filtros avanzados (especie, fecha, ubicación, estudiante, nivel de confianza)
   - Vista en grid o lista
   - Acciones rápidas y detalladas
   - Historial de validaciones

4. **types.ts** - Interfaces TypeScript
   ```typescript
   interface ExpertProfile {
     id: number;
     username: string;
     email: string;
     full_name: string;
     specialty: string; // "Ornitología", "Botánica", "Herpetología", etc.
     institution: string;
     certifications: string[];
     avatar_url?: string;
   }

   interface SightingReview {
     // Extiende SightingPending con campos adicionales
     taxonomy_verified: boolean;
     scientific_notes: string;
     suggested_corrections: string;
     reviewed_by: number;
     reviewed_at: string;
   }

   interface ValidationStats {
     total_reviews: number;
     approved_count: number;
     rejected_count: number;
     pending_count: number;
     avg_review_time: string;
     specialties_covered: string[];
   }
   ```

5. **hooks/useExpertData.ts** - Datos mock iniciales
   - useExpertProfile()
   - useExpertStats()
   - useSightingReviews()

6. **hooks/useSightingReview.ts** - Lógica de revisión
   - approveSighting(id, points, scientificNotes, taxonomyCorrect)
   - rejectSighting(id, reason, suggestions)
   - requestMoreInfo(id, questions)
   - bulkReview(ids[], action)

#### Funcionalidades:
- ✅ Aprobación/rechazo con notas científicas
- ✅ Validación taxonómica específica
- ✅ Sugerencias de corrección
- ✅ Sistema de puntos ajustable según rareza/calidad
- ✅ Solicitud de información adicional al estudiante
- ✅ Filtros por nivel de confianza de IA
- ✅ Vista de mapa de avistamientos (opcional)

---

### **FASE 2: Validación de Fichas de Especies** ⭐ PRIORITARIO
**Tiempo estimado:** 3-4 horas
**Descripción:** Sistema de revisión de fichas informativas creadas por docentes y estudiantes

#### Componentes a crear:
1. **FichaReviewCard.tsx** - Card de ficha pendiente
   - Miniatura de imagen principal
   - Nombre científico y común
   - Autor (docente/estudiante)
   - Fecha de creación
   - Estado (pendiente/aprobada/rechazada/en revisión)
   - Indicadores de calidad

2. **FichaDetailModal.tsx** - Vista completa para revisión
   - Sección: Taxonomía (Reino, Filo, Clase, Orden, Familia, Género, Especie)
   - Sección: Descripción morfológica
   - Sección: Hábitat y distribución
   - Sección: Comportamiento
   - Sección: Conservación (estado IUCN)
   - Sección: Imágenes y multimedia
   - Sección: Referencias bibliográficas
   - Panel lateral: Herramientas de validación
   - Editor inline para correcciones

3. **FichaValidationForm.tsx** - Formulario de validación
   - Checklist de campos requeridos
   - Validación taxonómica (con consulta a bases de datos)
   - Correcciones sugeridas (campo por campo)
   - Nivel de exactitud científica (1-5 estrellas)
   - Comentarios para el autor
   - Sugerencias de mejora
   - Acción: Aprobar / Aprobar con correcciones / Rechazar / Solicitar cambios

4. **FichaReviewManager.tsx** - Gestor principal
   - Lista de fichas pendientes
   - Filtros (tipo de organismo, estado, autor, fecha)
   - Búsqueda por nombre científico/común
   - Stats rápidas
   - Priorización por antigüedad

5. **hooks/useFichaReview.ts** - Lógica de validación
   - validateFicha(id, corrections, level, comments, action)
   - suggestTaxonomyCorrection(id, taxonData)
   - addScientificReferences(id, references[])
   - flagForExpertReview(id, specialty, reason)

#### Funcionalidades:
- ✅ Validación taxonómica completa
- ✅ Editor de correcciones inline
- ✅ Sistema de comentarios por sección
- ✅ Sugerencia de referencias científicas
- ✅ Integración con bases de datos taxonómicas (futuro: GBIF, IUCN)
- ✅ Aprobación parcial con correcciones
- ✅ Sistema de estrellas de calidad científica

---

### **FASE 3: Panel de Estadísticas y Analytics** 📊
**Tiempo estimado:** 2-3 horas
**Descripción:** Dashboards analíticos para monitoreo de biodiversidad

#### Componentes a crear:
1. **BiodiversityDashboard.tsx** - Vista analítica
   - Gráfico: Especies registradas por mes
   - Gráfico: Distribución por taxonomía (Reinos, Familias)
   - Mapa de calor: Zonas de mayor actividad
   - Lista: Especies más avistadas
   - Lista: Nuevas especies registradas
   - Indicadores de diversidad (Shannon, Simpson)

2. **SpeciesDistributionMap.tsx** - Mapa interactivo
   - Puntos de avistamientos verificados
   - Capas por tipo de organismo
   - Filtros temporales
   - Información al hacer hover
   - Exportación de datos

3. **ValidationMetrics.tsx** - Métricas de validación
   - Tiempo promedio de revisión
   - Tasa de aprobación por experto
   - Backlog de revisiones pendientes
   - Tendencias de calidad de contenido
   - Estudiantes/docentes más precisos

4. **hooks/useAnalytics.ts** - Datos analíticos
   - getSpeciesStats()
   - getTaxonomyDistribution()
   - getValidationMetrics()
   - exportBiodiversityReport()

#### Funcionalidades:
- ✅ Gráficos interactivos (recharts o chart.js)
- ✅ Filtros temporales (semana, mes, año)
- ✅ Exportación a CSV/PDF
- ✅ Comparativas temporales
- ✅ Alertas de especies raras/endémicas

---

### **FASE 4: Sistema de Reportes y Exportación** 📄
**Tiempo estimado:** 2-3 horas
**Descripción:** Generación de reportes científicos formales

#### Componentes a crear:
1. **ReportGenerator.tsx** - Constructor de reportes
   - Tipo de reporte (Biodiversidad, Validaciones, Especies)
   - Rango de fechas
   - Filtros (taxonomía, ubicación, validador)
   - Formato (PDF, CSV, Excel)
   - Plantillas predefinidas

2. **ReportPreview.tsx** - Vista previa
   - Renderizado del reporte
   - Edición de secciones
   - Inclusión de gráficos/mapas
   - Opciones de diseño

3. **ReportHistory.tsx** - Historial
   - Reportes generados
   - Descarga/compartir
   - Re-generación con datos actualizados

4. **hooks/useReportGenerator.ts** - Lógica de reportes
   - generateReport(type, filters, format)
   - schedulePeriodicReport(frequency, recipients)
   - exportToFormat(data, format)

#### Funcionalidades:
- ✅ Reportes automáticos mensuales
- ✅ Inclusión de estadísticas y gráficos
- ✅ Lista de especies con coordenadas
- ✅ Validadores y autores
- ✅ Formato científico profesional
- ✅ Compartir con otros expertos/instituciones

---

### **FASE 5: Herramientas Avanzadas de Experto** 🔬
**Tiempo estimado:** 3-4 horas
**Descripción:** Herramientas especializadas para validación científica

#### Componentes a crear:
1. **TaxonomyValidator.tsx** - Validador taxonómico
   - Búsqueda en bases de datos (GBIF, Catalogue of Life)
   - Sugerencias de clasificación
   - Detección de sinonimias
   - Histórico de cambios taxonómicos
   - Estado de conservación (IUCN)

2. **ImageAnalysisTool.tsx** - Análisis de imágenes
   - Vista ampliada con zoom
   - Herramientas de anotación
   - Comparación lado a lado
   - Detección de rasgos morfológicos
   - Integración con IA de identificación

3. **ReferenceManager.tsx** - Gestor de referencias
   - Biblioteca de papers científicos
   - Búsqueda de publicaciones
   - Citaciones automáticas (APA, Vancouver)
   - Vinculación con fichas/avistamientos

4. **CollaborationPanel.tsx** - Colaboración entre expertos
   - Solicitar segunda opinión
   - Discusión en casos dudosos
   - Etiquetado de especialistas
   - Notificaciones de casos complejos

5. **hooks/useAdvancedTools.ts** - Herramientas avanzadas
   - queryTaxonomicDatabase(scientificName)
   - validateConservationStatus(species)
   - analyzeImageQuality(imageUrl)
   - requestPeerReview(itemId, expertId)

#### Funcionalidades:
- ✅ Consulta a APIs científicas (GBIF, IUCN, EOL)
- ✅ Herramientas de imagen profesionales
- ✅ Sistema de peer review
- ✅ Base de conocimiento colaborativa
- ✅ Alertas de especies invasoras/amenazadas

---

### **FASE 6: Comunicación con la Comunidad** 💬
**Tiempo estimado:** 2 horas
**Descripción:** Herramientas de feedback y educación

#### Componentes a crear:
1. **FeedbackPanel.tsx** - Panel de retroalimentación
   - Mensajes a estudiantes/docentes
   - Plantillas de feedback educativo
   - Reconocimientos por calidad
   - Sugerencias de mejora

2. **EducationalResources.tsx** - Recursos educativos
   - Guías de identificación
   - Tips para mejores avistamientos
   - Errores comunes
   - Artículos científicos simplificados

3. **CommunityEngagement.tsx** - Compromiso comunitario
   - Publicar descubrimientos destacados
   - Reconocer contribuciones
   - Retos y campañas de biodiversidad
   - Badges especiales de experto

#### Funcionalidades:
- ✅ Sistema de mensajería directa
- ✅ Feedback constructivo personalizado
- ✅ Biblioteca de recursos educativos
- ✅ Gamificación para estudiantes destacados

---

### **FASE 7: Integración y Optimización** 🚀
**Tiempo estimado:** 2-3 horas
**Descripción:** Pulido, optimización y preparación para producción

#### Tareas:
1. **Optimización de rendimiento**
   - Lazy loading de componentes pesados
   - Paginación de listas largas
   - Caché de consultas frecuentes
   - Optimización de imágenes

2. **Accesibilidad y UX**
   - Navegación por teclado
   - Lectores de pantalla
   - Modo de alto contraste
   - Atajos de teclado para acciones comunes

3. **Testing**
   - Tests unitarios de hooks
   - Tests de integración de flujos
   - Validación de formularios
   - Manejo de errores

4. **Documentación**
   - README del módulo
   - Guía de usuario para expertos
   - Documentación de API
   - Changelog

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
frontend/src/modules/expert_dashboard/
├── ExpertDashboard.tsx              # Contenedor principal
├── types.ts                         # Interfaces TypeScript
├── README.md                        # Documentación del módulo
│
├── components/
│   ├── ExpertStats.tsx              # Métricas del experto
│   │
│   ├── sightings/                   # FASE 1
│   │   ├── SightingReviewPanel.tsx
│   │   ├── SightingReviewCard.tsx   # Reutilizar de teacher_dashboard
│   │   └── SightingReviewFilters.tsx
│   │
│   ├── fichas/                      # FASE 2
│   │   ├── FichaReviewCard.tsx
│   │   ├── FichaDetailModal.tsx
│   │   ├── FichaValidationForm.tsx
│   │   └── FichaReviewManager.tsx
│   │
│   ├── analytics/                   # FASE 3
│   │   ├── BiodiversityDashboard.tsx
│   │   ├── SpeciesDistributionMap.tsx
│   │   └── ValidationMetrics.tsx
│   │
│   ├── reports/                     # FASE 4
│   │   ├── ReportGenerator.tsx
│   │   ├── ReportPreview.tsx
│   │   └── ReportHistory.tsx
│   │
│   ├── tools/                       # FASE 5
│   │   ├── TaxonomyValidator.tsx
│   │   ├── ImageAnalysisTool.tsx
│   │   ├── ReferenceManager.tsx
│   │   └── CollaborationPanel.tsx
│   │
│   └── community/                   # FASE 6
│       ├── FeedbackPanel.tsx
│       ├── EducationalResources.tsx
│       └── CommunityEngagement.tsx
│
└── hooks/
    ├── useExpertData.ts             # Datos del experto
    ├── useSightingReview.ts         # Revisión de avistamientos
    ├── useFichaReview.ts            # Revisión de fichas
    ├── useAnalytics.ts              # Datos analíticos
    ├── useReportGenerator.ts        # Generación de reportes
    └── useAdvancedTools.ts          # Herramientas avanzadas
```

---

## 🎨 DISEÑO Y UX

### Paleta de colores específica:
- **Principal:** Azul científico (#2563EB) - Profesionalismo y confianza
- **Secundario:** Verde bosque (#059669) - Biodiversidad
- **Acento:** Ámbar (#F59E0B) - Alertas y pendientes
- **Éxito:** Verde (#10B981) - Aprobaciones
- **Error:** Rojo (#EF4444) - Rechazos
- **Neutro:** Grises (#6B7280, #F3F4F6)

### Componentes específicos:
- **Cards científicas:** Fondo blanco, borde sutil, sombra suave
- **Badges de estado:** Colores semánticos, pill style
- **Formularios:** Inputs amplios, labels claros, validación inline
- **Tablas de datos:** Striped rows, hover effects, sorting
- **Gráficos:** Recharts con paleta coherente
- **Mapas:** Leaflet o Mapbox GL JS

### Tipografía:
- **Nombres científicos:** Italic, serif (Georgia o similar)
- **Datos técnicos:** Monospace (Consolas, Monaco)
- **Interfaz general:** Sans-serif (Inter, System UI)

---

## 🔧 TECNOLOGÍAS Y DEPENDENCIAS

### Existentes (ya en el proyecto):
- React 18.3.1
- TypeScript 5.6.3
- Framer Motion 12.23.25
- Lucide React (iconos)
- TailwindCSS 3.4.13

### Nuevas a considerar:
- **Recharts** o **Chart.js** - Gráficos interactivos
- **React Leaflet** - Mapas de biodiversidad
- **React PDF** - Generación de reportes
- **React Table** o **TanStack Table** - Tablas avanzadas
- **React Query** - Gestión de estado del servidor (futuro)
- **date-fns** - Manejo de fechas

---

## 📊 DATOS MOCK INICIALES

### Avistamientos para revisión (10-15 ejemplos):
- Mix de especies: aves, mamíferos, reptiles, insectos, plantas
- Diferentes niveles de calidad de foto
- Diversos niveles de confianza de IA (35%-95%)
- Ubicaciones variadas en Tingo María
- Algunos con errores de identificación intencionales

### Fichas para validación (8-10 ejemplos):
- Fichas bien hechas (aprobación directa)
- Fichas con errores taxonómicos menores
- Fichas incompletas
- Fichas con información incorrecta
- Mix de autores (docentes y estudiantes avanzados)

### Experto mock:
```typescript
{
  id: 1,
  username: "dr_miranda",
  email: "j.miranda@naturein.org",
  full_name: "Dr. Jorge Miranda Esquivel",
  specialty: "Ornitología y Ecología Tropical",
  institution: "Universidad Nacional Agraria de la Selva",
  certifications: [
    "PhD en Ciencias Biológicas",
    "Especialista en Aves Amazónicas",
    "Investigador CONCYTEC"
  ],
  avatar_url: null,
  stats: {
    total_reviews: 247,
    approved: 189,
    rejected: 31,
    pending: 27,
    avg_review_time: "18 minutos"
  }
}
```

---

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### CRÍTICO (Hacer primero):
1. ✅ **FASE 1** - Aprobación de avistamientos (core funcionalidad)
2. ✅ **FASE 2** - Validación de fichas (segunda funcionalidad core)

### IMPORTANTE (Hacer segundo):
3. ✅ **FASE 3** - Estadísticas y analytics
4. ✅ **FASE 4** - Sistema de reportes

### DESEABLE (Hacer tercero):
5. ✅ **FASE 5** - Herramientas avanzadas
6. ✅ **FASE 6** - Comunicación con comunidad

### OPCIONAL (Pulido final):
7. ✅ **FASE 7** - Optimización y testing

---

## 🚀 RUTA DE INTEGRACIÓN

### Integración con backend (futuro):
- Endpoints de avistamientos: `/api/expert/sightings/pending/`
- Endpoints de fichas: `/api/expert/fichas/pending/`
- Endpoints de validación: `/api/expert/validate/`
- Endpoints de reportes: `/api/expert/reports/`
- WebSockets para notificaciones en tiempo real

### Integración con APIs externas:
- **GBIF API** - Global Biodiversity Information Facility
- **IUCN Red List API** - Estado de conservación
- **Catalogue of Life** - Taxonomía
- **iNaturalist API** - Comparación de observaciones

---

## ✅ CRITERIOS DE ÉXITO

### Fase 1-2 (MVP):
- [ ] Experto puede ver todos los avistamientos pendientes
- [ ] Experto puede aprobar/rechazar con comentarios científicos
- [ ] Experto puede ver y validar fichas de especies
- [ ] Experto puede sugerir correcciones taxonómicas
- [ ] Stats básicas funcionando

### Fase 3-4 (Completo):
- [ ] Dashboard analítico con gráficos
- [ ] Generación de reportes en PDF
- [ ] Exportación de datos
- [ ] Filtros avanzados funcionando

### Fase 5-7 (Profesional):
- [ ] Integración con bases de datos científicas
- [ ] Herramientas de colaboración
- [ ] Sistema de feedback a comunidad
- [ ] Performance optimizado
- [ ] Documentación completa

---

## 📝 NOTAS ADICIONALES

### Diferencias clave con Teacher Dashboard:
- **Enfoque científico** vs educativo
- **Validación rigurosa** vs gestión de clase
- **Datos precisos** vs gamificación
- **Herramientas profesionales** vs herramientas pedagógicas
- **Reportes formales** vs seguimiento estudiantil

### Consideraciones de diseño:
- Interfaz profesional, no infantil
- Densidad de información mayor
- Terminología científica precisa
- Acceso rápido a herramientas especializadas
- Menos animaciones, más funcionalidad

### Seguridad y permisos:
- Solo expertos verificados pueden acceder
- Registro de todas las validaciones
- Auditoría de cambios
- Niveles de experto (junior, senior, principal)
- Revisión por pares en casos complejos

---

**INICIO SUGERIDO:** FASE 1 - Aprobación de Avistamientos
**Tiempo total estimado:** 17-22 horas (desarrollo completo)
**MVP funcional:** 6-8 horas (Fases 1-2)

¿Procedemos con la FASE 1?
