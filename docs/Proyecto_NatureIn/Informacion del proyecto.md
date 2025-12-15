Información General del Proyecto NatureIn
Descripción
NatureIn es una plataforma web educativa interactiva diseñada para fomentar la conciencia ambiental en estudiantes de secundaria (primero) en Tingo María, Perú. Enfocada en flora y fauna local, combina aprendizaje lúdico con gamificación y recursos validados científicamente.  Incluye chatbot adaptativo y gamificación vía Educaplay.
Fecha Actual: Diciembre 02, 2025.
Curso: Diseño Detallado de Software.
Autores: Tapullima Serna, Meselemias; Valles Sevillano, Alan Samuel; Gavilan Paucar, Adriel Jeremy; Zelaya Albornoz, Anali Amy; Zegarra Martel, Juber Richard.
Docente: Ing. Christian Garcia Villegas.
Institución: Universidad Nacional Agraria de la Selva (UNAS).
Objetivos
General
Definir y documentar la arquitectura detallada, requisitos y plan de desarrollo para una solución web escalable, alineada con competencias de Ciencia y Tecnología (DCN 2025), contribuyendo a ODS 4 (Educación de Calidad) y 15 (Vida de Ecosistemas Terrestres).
Específicos

Especificar al menos 15 requisitos funcionales (autenticación, fichas via APIs, gamificación, chatbot).
Integrar patrones de diseño en microservicios Django/React.
Proporcionar pasos detallados para desarrollo, testing y despliegue.
Asegurar minimalismo: UI dinámica con Vite, carga <2s, accesible sin registro inicial.

Alcance

Incluye: Autenticación por roles (Estudiante, Docente, Experto; Admin interno), fichas auto-generadas (GBIF para taxonomía, iNaturalist para imágenes/avistamientos, EOL/Wikidata para descripciones), gamificación (puntos, insignias, misiones via Educaplay), chatbot Llama (adaptado por rol), avistamientos geolocalizados, progreso usuario.

Usuarios: Estudiantes (aprendizaje lúdico), Docentes (métricas básicas), Expertos (validación contenido), Admin (gestión interna).
Tecnologías Clave: Django (backend), React/Vite (frontend), PostgreSQL (DB), Docker (despliegue).

Requisitos No Funcionales

Rendimiento: Respuesta API <500ms; UI carga <2s.
Escalabilidad: Soporte 1k usuarios concurrentes.
Seguridad: JWT auth, GDPR-compliant para datos geolocalizados.
Accesibilidad: WCAG 2.1 AA; mobile-first.
Mantenibilidad: Cobertura tests >80%; docs en Markdown.

Alineación con ODS y DCN 2025

ODS 4/15: Recursos inclusivos para biodiversidad local.
DCN Competencias: Ciencia/Tecnología: Identificación especies, impacto ambiental via fichas interactivas.

Recursos

APIs Externas:
GBIF: Taxonomía/nombres científicos.
iNaturalist: Imágenes/avistamientos locales.
EOL/Wikidata: Descripciones textuales.

Gamificación: Educaplay API para minijuegos LTI/iframe.
Chatbot: Llama (fine-tuned con prompts por rol: e.g., "Explica como a un estudiante" vs. "Detalles científicos para experto").

Riesgos

Dependencia APIs: Mitigar con cache y fallbacks.
Integración Llama: Usar Hugging Face para hosting inicial.