Informacion del proyecto 
### Abstracción Fundamental del Proyecto "NatureIn" para su Desarrollo

El proyecto "NatureIn" es una plataforma educativa digital desarrollada por estudiantes de la Escuela Académica Profesional de Ingeniería en Informática y Sistemas de la Universidad Nacional Agraria de la Selva (UNAS), Perú, como parte de la asignatura de Ingeniería de Requisitos (docente: Ing. Christian García Villegas). Se enfoca en la educación ambiental sobre la biodiversidad local de Tingo María, integrando gamificación, contenidos interactivos y alineación con los Objetivos de Desarrollo Sostenible (ODS 4: Educación de calidad, ODS 15: Vida de ecosistemas terrestres). A continuación, abstraigo los elementos fundamentales del proyecto, organizados por categorías clave para guiar su desarrollo. Esta abstracción se basa en la documentación funcional proporcionada (páginas 1-3 del índice y estructura general), priorizando aspectos accionables para implementación (arquitectura, requisitos, módulos y metodología).

#### 1. **Visión General y Planteamiento del Proyecto**
   - **Propósito:** Crear una plataforma web/móvil inmersiva para el aprendizaje significativo de la flora y fauna local (al menos 20 especies de Tingo María), fomentando la conciencia ambiental mediante contenidos multimedia, actividades interactivas y gamificación. Dirigida a estudiantes de secundaria, docentes, padres y profesionales ambientales, con énfasis en accesibilidad (sin registro obligatorio) y usabilidad (navegación en ≤2 clics).
   - **Contexto:** Responde a la necesidad de recursos educativos contextualizados en la biodiversidad amazónica, integrando elementos lúdicos para motivar el aprendizaje autónomo y colaborativo.
   - **Alcance:** 
     - **Incluye:** Autenticación por roles, biblioteca de especies, gamificación (puntos, insignias, misiones), herramientas docentes (reportes, guías), interfaz temática (naturaleza), validación pedagógica.
     - **Excluye:** Integración con hardware externo (e.g., AR/VR avanzada), monetización, soporte offline completo.
   - **Actores Principales:** Estudiante (aprendizaje gamificado), Docente (monitoreo y personalización), Padre (controles parentales), Profesional Ambiental (subida de contenidos).

#### 2. **Objetivos**
   - **General:** Desarrollar una plataforma educativa gamificada que promueva el conocimiento de la biodiversidad local de Tingo María, alineada con ODS 4 y 15, mediante contenidos interactivos y herramientas pedagógicas.
   - **Específicos:**
     - Implementar catálogo de ≥20 especies con paquetes multimedia (texto, audio, video, imágenes) y actividades contextualizadas.
     - Integrar gamificación con sistema de puntos, niveles, insignias temáticas (e.g., aves, mamíferos, plantas) y misiones de 3 dificultades.
     - Proporcionar herramientas para docentes (guías PDF ≥5, reportes estadísticos, personalización de tareas).
     - Asegurar usabilidad: diseño temático (verdes/selva), soporte multiestilo de aprendizaje, accesibilidad multiplataforma (celulares, tablets, PC).
     - Validar pedagógicamente mediante entrevistas y pruebas piloto.

#### 3. **Metodología de Desarrollo**
   - **Enfoque:** Ágil/Scrum con sprints de 2 semanas (documentados en Sprints 05-09).
     - **Sprint 05:** Diseño de arquitectura (diagramas de casos de uso, clases, BD física, historias de usuario).
     - **Sprint 06:** Autenticación y perfiles (implementación básica).
     - **Sprint 07:** Funcionalidades educativas y visuales (contenidos, gamificación inicial).
     - **Sprint 08:** Validación (entrevistas pedagógicas, análisis).
     - **Sprint 09:** Reajustes (redefinición del Project Charter).
   - **Backlog:** Product Backlog de requisitos funcionales (RF) y no funcionales (RNF), priorizados por módulos.
   - **Herramientas:** Diagramas UML (casos de uso, clases), prototipos por módulos, retrospectivas por sprint.

#### 4. **Arquitectura y Módulos Fundamentales**
   - **Estructura General:** Plataforma web/móvil con frontend intuitivo (diseño responsive, AR 3D para 10 especies), backend para gestión de datos (BD relacional con PostgreSQL/SQL Server), y capas de seguridad/gamificación.
   - **Módulos Principales (5, según documentación):**
     | Módulo | Descripción | Requisitos Clave | Tablas BD Relacionadas |
     |--------|-------------|------------------|------------------------|
     | **Gestión de Seguridad** | Autenticación por roles, 2FA para docentes/padres, controles parentales (menores de 13 años). | RF-01 a RF-03: Roles (Estudiante, Docente, Padre, Profesional). | Usuarios, Roles. |
     | **Gestión de Usuarios** | Perfiles personalizables (avatares, dashboards exclusivos). | RF-04 a RF-06: Creación/edición de perfiles, notificaciones. | Usuarios, Aulas, AulaEstudiante. |
     | **Gestión de Contenido** | Creación/edición de fichas, mapas interactivos, búsqueda avanzada. | RF-07 a RF-09: Subida por profesionales, filtros (hábitat, IUCN). | Fichas, Especies, Multimedia. |
     | **Gestión de Gamificación** | Puntos, niveles, insignias, misiones (3 dificultades), rankings anónimos. | RF-12 a RF-14: Desbloqueos, barras de progreso. | Juego, JuegoUsuario, Recompensa, UsuarioPuntaje. |
     | **Gestión de Interfaz y UX** | Diseño temático, navegación simplificada, soporte multiestilo (visual/auditivo/kinestésico). | RF-18 a RF-20: Colores verdes, texto 14px, AR compatible iOS/Android. | (No BD-specific; frontend-focused). |

   - **Mapa de Procesos:** Flujos principales: Registro/Login → Exploración de Especies → Actividades Gamificadas → Progreso/Reportes → Validación Pedagógica.
   - **Marco Funcional:**
     - **Funciones Principales:** Autenticación, Exploración de Contenidos, Gamificación, Monitoreo Docente.
     - **Requisitos Funcionales Representativos:** ≥20 especies con multimedia, misiones con recompensas, reportes personalizables.
     - **Requisitos No Funcionales:** Accesible sin registro, responsive, privacidad (GDPR-like), rendimiento (carga <2s).
     - **Actores y Funciones:** Estudiante (jugar/misionar), Docente (asignar/monitorear), Padre (controlar), Profesional (subir datos).

#### 5. **Requisitos y Product Backlog**
   - **Funcionales (RF, priorizados por módulos):**
     - Seguridad: Autenticación rol-based, controles parentales.
     - Usuarios: Perfiles con avatares, dashboards.
     - Contenido: Catálogo de especies, búsqueda con filtros, subida validada.
     - Gamificación: Puntos/insignias, misiones, rankings.
     - UX: Interfaz adaptativa, AR para especies.
   - **No Funcionales (RNF):** Usabilidad (WCAG 2.1), Escalabilidad (≥1000 usuarios concurrentes), Seguridad (hashing de contraseñas), Portabilidad (multiplataforma).
   - **Historias de Usuario (HU):** ≥50 HU documentadas, e.g., "Como estudiante, quiero explorar especies con quizzes para ganar puntos".
   - **Backlog de Desarrollo:** Sprints con tareas (e.g., Sprint 05: Diagramas; Sprint 08: Validación con entrevistas).

#### 6. **Prototipo y Validación**
   - **Prototipo:** Por módulos (wireframes, mockups), con énfasis en interfaz temática y gamificación.
   - **Validación:** Entrevistas pedagógicas, retrospectivas por sprint, análisis de feedback (estudiantes/docentes/padres).
   - **Recomendaciones:** Iteraciones basadas en pruebas, integración con ODS, expansión a más especies.
   - **Conclusiones:** Plataforma viable para educación ambiental, con potencial para impacto local (Tingo María).

#### 7. **Recomendaciones para Desarrollo**
   - **Tecnologías:** Frontend: React/Vue.js con AR.js; Backend: Node.js/Express o Django; BD: PostgreSQL con esquemas (base, especies, educacion, gamificacion, recursos); Gamificación: Socket.io para real-time.
   - **Riesgos:** Pérdida de datos en migraciones; sobrecarga gamificada sin balance pedagógico.
   - **Próximos Pasos:** Implementar MVP (Módulos 1-3), pruebas beta con 50 usuarios, despliegue en AWS/Heroku.
   - **Métricas de Éxito:** ≥80% retención en misiones, reportes de progreso >70% completados, feedback pedagógico positivo.

Esta abstracción condensa la documentación en un marco accionable para desarrollo, priorizando lo esencial (objetivos, módulos, requisitos). Si necesitas profundizar en un módulo (e.g., backlog detallado) o un diagrama ER, ¡házmelo saber!

# Detalle de Módulos para NatureIn

## Módulo 1: Gestión de Seguridad

**Descripción:** Gestiona y protege los datos y la seguridad de los usuarios en la plataforma. Incluye autenticación por roles, verificación en dos pasos para docentes y padres, y controles parentales para limitar el acceso de estudiantes menores de 13 años a foros o redes sociales desalineados con el propósito del sistema. Este módulo asegura que la plataforma cumpla con estándares de privacidad y seguridad, protegiendo la información sensible de los usuarios y garantizando un entorno seguro para el aprendizaje.

- **RF-01:** Implementar autenticación por roles (Estudiante, Docente, Padre de Familia, Profesional Ambiental) (Página 8, 2.1).
- **RF-02:** Incluir verificación en dos pasos para docentes y padres (Página 8, 2.1).
- **RF-03:** Establecer controles parentales para limitar el acceso de estudiantes menores de 13 años a foros o redes sociales desalineados con el propósito del sistema (Página 8, 2.1).

## Módulo 2: Gestión de Usuarios

**Descripción:** Administra los perfiles y roles de los usuarios (Estudiante, Docente, Padre de Familia, Profesional Ambiental). Permite la creación, edición y eliminación de perfiles con campos personalizados, la personalización de avatares para estudiantes y paneles exclusivos para docentes y padres con seguimiento de progreso y configuración de notificaciones. Este módulo facilita la gestión individualizada y el monitoreo de la experiencia de los usuarios.

- **RF-04:** Permitir la creación, edición y eliminación de perfiles con campos personalizados (nombre, especialidad, edad, nivel educativo) (Página 8, 2.1).
- **RF-05:** Habilitar personalización de avatares para estudiantes (ropa, cabello, accesorios) (Página 8, 2.1).
- **RF-06:** Proporcionar paneles exclusivos para docentes y padres con seguimiento de progreso y configuración de notificaciones (Página 8, 2.1).

## Módulo 3: Gestión de Contenido

**Descripción:** Gestiona la creación, edición, eliminación y visualización de contenido educativo, incluyendo fichas de especies, mapas interactivos, cuestionarios dinámicos y recursos multimedia. Permite a profesionales ambientales subir datos taxonómicos con vista previa y ofrece un motor de búsqueda avanzado. Este módulo se enfoca en la curaduría y mantenimiento de los recursos educativos para su posterior integración en la biblioteca.

- **RF-07:** Gestionar la creación, edición, eliminación y visualización de contenido educativo (fichas de especies, mapas interactivos, cuestionarios dinámicos, recursos multimedia) (Página 8, 2.1).
- **RF-08:** Permitir a profesionales ambientales subir fichas con datos taxonómicos y vista previa antes de publicación (Página 8, 2.1).
- **RF-09:** Incluir un motor de búsqueda avanzada con autocompletado y filtros (categoría, hábitat, estado IUCN) (Página 8, 2.1).

## Módulo 4: Gestión de Biblioteca de Especies

**Descripción:** Organiza un catálogo de al menos 20 especies de flora y fauna de Tingo María con paquetes multimedia (texto, audio, video, imágenes) y actividades interactivas, alineados con los Objetivos de Desarrollo Sostenible (ODS). Este módulo asegura que el contenido sea accesible y contextualizado para promover un aprendizaje significativo.

- **RF-10:** Establecer la organización de un catálogo de al menos 20 especies de flora y fauna de Tingo María con paquetes multimedia (texto, audio, video, imágenes) (Página 6, 1.2).
- **RF-11:** Incluir actividades interactivas contextualizadas al entorno local y alineadas con ODS 4 (educación de calidad) y ODS 15 (vida de ecosistemas terrestres) (Página 6, 1.2).

## Módulo 5: Herramientas de Apoyo Docente

**Descripción:** Proporciona herramientas para docentes, como guías pedagógicas descargables, paneles de monitoreo en tiempo real y reportes estadísticos personalizables. Facilita la integración de la plataforma en la planificación pedagógica mediante la personalización de parámetros, mejorando la experiencia educativa en el aula.

- **RF-15:** Documentar funcionalidades destinadas a docentes, como guías pedagógicas descargables (mínimo cinco en PDF) (Página 6, 1.2).
- **RF-16:** Proporcionar paneles de monitoreo en tiempo real y reportes estadísticos (puntajes, participación, tiempo invertido) (Página 6, 1.2).
- **RF-17:** Permitir personalización de parámetros (por ejemplo, dificultad de juegos) para facilitar la integración en la planificación pedagógica (Página 6, 1.2).

## Módulo 6: Gestión de Gamificación

**Descripción:** Implementa elementos gamificados para motivar a los estudiantes, incluyendo un sistema de puntos, niveles, insignias temáticas y misiones con tres niveles de dificultad. Fomenta el aprendizaje autónomo y el compromiso mediante recompensas y desafíos personalizados.

- **RF-12:** Implementar un sistema de puntos, niveles, insignias temáticas (aves, mamíferos, plantas) y misiones con tres niveles de dificultad (Página 8, 2.1).
- **RF-13:** Desbloquear contenido exclusivo (videos, juegos) al completar misiones, con barras de progreso visibles (Página 8, 2.1).
- **RF-14:** Incluir rankings anónimos basados en puntos y desafíos opcionales de mayor dificultad (Página 8, 2.1).
**SUB-MODULO DE JUEGOS**

**Descripción general:**  
Este módulo integra **mini-juegos recreativos** orientados a reforzar el aprendizaje sobre biodiversidad y cuidado ambiental mediante actividades dinámicas y visuales. Busca promover el entretenimiento y la participación de los estudiantes a través de mecánicas sencillas, con recompensas simbólicas y niveles de dificultad básicos.

·        **RF-27:** Implementar al menos **mini-juegos educativos** con diferentes mecánicas (identificación, simulación, exploración, puzzle, competencia).

·        **RF-11:** **Implementación de recompensas como puntos, insignias (con el fin de motivar el progreso de los estudiantes)**

·        **RF-14:** Generar **ranking** (tiempo, aciertos, errores, estrategias).

·        **RF-28:** Configurar **dificultad adaptativa** según el desempeño del jugador (últimas 10 partidas).

## **Módulo 7: IA INTEGRACIÓN DE IA**

**Descripción general:**

Conjunto de sistemas inteligentes que personalizan la experiencia educativa, generan contenidos automáticos, identifican especies mediante visión computacional y proporcionan análisis predictivos del aprendizaje.

·        **RF-ADD:** Chatbot educativo capaz de responder más de **50 tipos de preguntas** sobre biodiversidad.

·        **RF-ADD:** Implementar **algoritmo de recomendación híbrido** (colaborativo + basado en contenido).

·        **RF-ADD:** Generar **perfil de aprendizaje individual** (visual, auditivo, kinestésico).

·        **RF-ADD:** Generar **cuestionarios automáticos** con IA (mínimo 10 variaciones por pregunta).

