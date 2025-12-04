Este documento detalla los requisitos de UX/UI para la plataforma NatureIn, refocalizada en una arquitectura en capas con microservicios (Django backend, React/Vite frontend), enfoque minimalista, dinámico y responsive. Se integra la eliminación de módulos de aulas y roles docentes para creación de fichas (usando APIs: GBIF para taxonomía, iNaturalist para imágenes/avistamientos, EOL/Wikidata para descripciones). Roles: Estudiante, Docente (métricas limitadas), Experto (edición fichas), Admin (interno, no en registro). Incluye chatbot Llama adaptado por rol y gamificación con Educaplay API (LTI/iframe, eventos activity_completed).
Principios Generales de UX/UI:

Minimalismo: Colores neutros con acentos verdes ecológicos (inspirados en imágenes: #4CAF50 verde principal, #E8F5E8 fondo claro, #2E7D32 verde oscuro para botones). Espaciado generoso, tipografía sans-serif (e.g., Roboto, 14px base).
Dinamismo: Animaciones suaves con Framer Motion (transiciones <300ms, hover effects). Estado global con Redux para personalización por rol.
Responsive: Mobile-first (Tailwind CSS). Header: En pantallas <768px, redirecciones como emojis . Breakpoints: sm (640px), md (768px), lg (1024px).
Accesibilidad: WCAG 2.1 AA (contraste 4.5:1, navegación teclado, ARIA labels). Soporte dark mode toggle.
Documentación: Basado en wireframes de imágenes proporcionadas. Flujos validados contra requisitos funcionales (RF-06, RF-09, RF-19, RF-77, etc.).

Paleta de Colores y Tipografía


ElementoColor/HexUsoFondo Principal#F1F8E9 (claro verde)Body, cardsAcentos Verdes#4CAF50 (principal), #81C784 (secundario)Botones, headersTexto#2E7D32 (oscuro), #FFFFFF (sobre verde)Contenido, CTAsEmojis ResponsiveN/AÍconos en mobile iconos solo con borde

Tipografía: Roboto (Google Fonts). H1: 24px bold, Body: 14px regular. Internacionalización: Soporte español/quechua (RF-72).

Header y Navegación Global

Componente: Fixed top bar (altura 60px). Logo "NatureIn" (izq.), enlaces (Aprender, Jugar, Explorar) (centro), perfil usuario (der., foto/avatar + nombre + dropdown: Perfil, Logout, Ver todo).
UX Flow: Click en enlaces redirige a secciones (RF-06). Dropdown perfil muestra notificaciones dinámicas (RF-18, badges con contador).
Responsive: <768px: Hamburguesa menu → emojis para enlaces. Animación slide-in para mobile nav.
Dinámico: Hover: Escala 1.05 con sombra verde. User status: Online indicator (verde dot).
Integración: Autenticación via AuthService (RF-03). Para no logueados: Muestra "Iniciar Sesión" en lugar de perfil.

Página de Inicio (Home)

Descripción: Bienvenida inmersiva con hero section. Imagen fondo: Paisaje Tingo María (de iNaturalist API). Texto: "¿Estás listo para explorar?" + CTA "Empieza a Explorar" (botón verde, redirige a Explorar).
Secciones:
Explora Lugares: Grid 2x2 cards (responsive: 1-col mobile). Cada card: Imagen (hover zoom), título (e.g., "Cuevas de las Lechuzas"), descripción corta. Click: Modal con mapa interactivo (ver Mapa sección).
Explora Especies: Carousel horizontal (Framer Motion swipe). Cards: Imagen especie, nombre común/científico (de GBIF), snippet descripción (EOL). Click: Ficha completa (RF-02).
Aprende Jugando: Grid 2x2 lecciones gamificadas. Cada: Imagen temática, título (e.g., "Lectura de Vida y Ecosistemas" 15min), autor (e.g., "Luisa Gómez" con foto). Click: Redirige a lección (integra Educaplay iframe, RF-36).

UX Flow: Scroll suave, lazy loading imágenes. CTA "Ver todo" en cada sección.
Dinámico: Animaciones: Fade-in on scroll, progress bar para lecciones completadas (RF-38).
Responsive: Cards stack vertical en mobile. Hero texto centra en <md.

Registro (Register)

Descripción: Modal/full-page form. Título: "Crea tu cuenta". Botones tabs: "Estudiante", "Docente", "Experto" (verde active state).
UX Flow: Click tab cambia formulario dinámicamente (React state). Validación real-time (rojo error, verde check). Submit: POST a AuthService (/api/register), redirige a login.
Formularios por Rol (RF-01, adaptado):RolCamposValidaciones/NotasEstudiante- Username (puede = nombre, único)
- Nombres
- Apellidos
- Correo (email valid)
- Grado (dropdown: Primero/Segundo Secundaria)- Edad implícita via grado.
- Consentimiento parental checkbox (RF-28, para <13).Docente- Username (puede = nombre, único)
- Nombres
- Apellidos
- Correo institucional (requerido, regex @edu.pe)- Verificación email obligatoria (RF-109).Experto- Username (puede = nombre, único)
- Nombres
- Apellidos
- Área especialización (textarea)
- Cargo (input)- Campo especialización: Autocomplete sugerencias (e.g., "Biólogo", "Botánico").
Dinámico: Animación slide entre tabs. Password strength bar.
Responsive: Stack vertical en mobile, labels arriba de inputs.

Login

Descripción: Simple form: "Inicia Sesión". Campos: Username/Nombre + Contraseña (show/hide icon).
UX Flow: Submit: POST /api/login (AuthService, RF-03). Éxito: Redirige a panel rol-based. Error: Shake animation + mensaje (RF-72, localizado).
Dinámico: Remember me checkbox (localStorage token). Social login optional (Google, para docentes).
Responsive: Centrado, full-width inputs en mobile.

Panel por Rol (Dashboard)

Base: Sidebar izquierda (colapsable mobile) con enlaces rol-específicos. Header global arriba. Contenido dinámico basado en rol (RF-09, RF-77).
UX Flows por Rol (alineado a RF):
Estudiante: Sección principal: Progreso gamificado (barra niveles, insignias grid, RF-27). Recomendaciones: "Basado en tu progreso, prueba esta ficha" (RF-30). Chatbot bubble (abajo der., inicia con "¡Hola! ¿Qué especie te interesa?" adaptado simple, RF-146). Accesos: Explorar especies, Juegos (Educaplay embeds).
Docente: Dashboard métricas (RF-17, RF-117): Tarjetas KPIs (tasa finalización, top actividades, Recharts barras/línea). Fallback demo si no data. Export CSV. Recomendaciones: "Asigna esta lección a tus estudiantes" (guías PDF, RF-122). Chatbot: Explicaciones pedagógicas.
Experto: Lista fichas editables (RF-53): Search bar, cards con status (pendiente/aprobado). Botón "Generar vía API" (integra GBIF/iNat/EOL). Chatbot: Detalles científicos. Recomendaciones: "Valida este avistamiento comunitario" (RF-57).
Admin (interno): Tabla usuarios (RF-01), logs auditoría (RF-76). No accesible via registro.

Dinámico: Real-time updates (WebSockets, RF-89). Notificaciones toast (RF-18).
Responsive: Sidebar → bottom nav en mobile.

Mapa Interactivo (Explorar)

Descripción: Full-screen Leaflet map centrado en Tingo María (coords: -9.3, -75.99). Marcadores para lugares turísticos (e.g., Cuevas Lechuzas, Jardín Botánico).
UX Flow (RF-25, RF-68):
Vista inicial: Mapa local con clusters marcadores (verde icons).
Click/zoom: Popup modal con:
Info lugar: Descripción, foto (iNaturalist).
Especies: Lista cards (nombres, imágenes, snippets de GBIF/EOL).
Recomendaciones visita: "Mejor hora: Amanecer. Lleva repelente." (estático + dinámico por temporada).
Concurrencia estimada: Barra (baja/media/alta, basada en avistamientos iNat, RF-59).

Search bar: Autocomplete lugares/especies.

Dinámico: Zoom animado, species filter overlay (por categoría). Click especie: Overlay ficha (RF-02).
Responsive: Pinch-zoom mobile, full-height.

Gamificación

Descripción: Sección dedicada (Jugar tab). Dashboard: Progreso radial (niveles, RF-27), insignias grid (hover tooltips con criterio, RF-121), misiones lista (checklist, RF-67).
UX Flow (RF-23, RF-36, RF-147, RF-148, RF-149):
Embed Educaplay: Iframe LTI para minijuegos (Pairs/Memory). On complete: Trigger /api/v1/gamification/award/ (puntos, insignia si criterio metido, e.g., "5 misiones = Badge Explorador").
Interactividad: Confetti animation on award. Ranking leaderboard (anónimo, top 10 por rol).
Recomendaciones: "¡Gana 50 pts completando esta trivia!" (RF-119). Conexión activity_completed → update progreso (señal Django).

Dinámico: Barra XP fill on progress. Notificaciones: "¡Nueva insignia desbloqueada!" (toast).
Responsive: Grid adapts, touch-friendly para juegos.

Creación/Edición de Ficha (para Expertos)

Descripción: Modal/stepper wizard. Pasos: 1. Datos taxonómicos (auto-fill GBIF), 2. Multimedia (upload + iNat fetch), 3. Descripción (EOL base + edit), 4. Juegos relacionados (Educaplay suggests).
UX Flow (RF-02, RF-53): Progress bar (2/5 completado). Preview pane derecha. Submit: POST ContentService, notifica revisión.
Dinámico: Auto-save draft (RF-38). AI suggest via chatbot: "Adapta esta descripción para secundaria".
Responsive: Horizontal stepper → vertical mobile.

Otras Recomendaciones Básicas

Explorar Especies: Search con filtros (categoría, familia, etc., RF-61). Infinite scroll results, cards hover expand.
Aprender: Video lessons con captions, quiz post-lección (RF-20). Progress tracker.
Chatbot: Bubble fijo (abajo der.). Input: Texto/voz. Respuestas adaptadas (e.g., Estudiante: Simple; Experto: Técnico, RF-146). History scrollable.
Footer: ODS icons (4/15), copyright UNAS 2025. Links: Contacto, Accesibilidad.
Testing UX: Usabilidad con 10 usuarios/rol (RF-142). Métricas: Tiempo task <2min, NPS >8.

Referencias a Requisitos Funcionales

Alineado a RF-06 (navegación), RF-19 (amigable), RF-77 (vistas rol), RF-146 (chatbot), RF-147-149 (gamificación).
No Funcionales: Carga <2s (Vite), accesible WCAG.