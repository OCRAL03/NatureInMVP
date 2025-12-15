Módulos de Desarrollo
Basado en microservicios y capas, los módulos se dividen en frontend/backend. Cada uno incluye patrones de diseño y dependencias clave. Desarrollo iterativo via sprints (Scrum-like).
Módulos Backend (Django)

AuthService (Gestión de Seguridad y Usuarios):
Funcionalidades: Registro/login (JWT), roles (Estudiante/Docente/Experto), perfiles.
Patrones: Singleton (conexión DB), Strategy (validación por rol).
Modelos: Usuarios (simplificado del esquema SQL), Roles.
APIs: /auth/register, /auth/login, /users/profile.
Dependencias: django-rest-framework, djangorestframework-simplejwt.

ContentService (Gestión de Contenido):
Funcionalidades: Generación fichas via APIs (GBIF/iNaturalist/EOL), multimedia, taxonomía.
Patrones: Factory (crea ficha por tipo especie), Facade (integra APIs).
Modelos: Especies, Flora/Fauna, Multimedia, Fichas (enlazadas a especies).
APIs: /content/species/{id}, /content/generate-ficha (POST con query especie).
Dependencias: requests (para APIs externas), celery (tareas async para fetches).

GamifyService (Gestión de Gamificación):
Funcionalidades: Puntos/insignias/misiones, integración Educaplay (LTI/iframe), eventos activity_completed.
Patrones: Observer (señales Django para progreso), Strategy (métricas dashboard).
Modelos: Juego, Recompensa, InsigniasUsuario, UsuarioPuntaje, Rango.
APIs: /gamify/award (POST user_id, activity_id, points), /gamify/metrics (dashboard docente).
Dependencias: django-signals, educaplay-sdk (custom wrapper).

ChatService (Chatbot):
Funcionalidades: Conversaciones adaptadas por rol (prompts dinámicos en Llama).
Patrones: Template Method (base para prompts por rol).
Modelos: Ninguno (stateless); logs en Comentarios.
APIs: /chat/converse (WebSocket via Channels).
Dependencias: django-channels, transformers (Hugging Face para Llama).

UserService (Gestión de Usuario y Progreso):
Funcionalidades: Avistamientos geolocalizados, progreso actividades, dashboard.
Patrones: Repository (acceso DB), Unit of Work (transacciones).
Modelos: Avistamientos, Progreso, Comentarios.
APIs: /user/sightings, /user/progress.
Dependencias: django-leaflet (mapas), geopy (geocoding).


Módulos Frontend (React/Vite)

AuthModule: Formularios login/register, guards de rutas por rol.
Componentes: LoginForm, RoleSelector.
Estado: Redux slice para auth.

ContentModule: Visualización fichas, búsqueda especies.
Componentes: SpeciesCard (minimalista con imagen/descripción), SearchBar.
Integración: Hooks para fetch APIs.

GamifyModule: Dashboard insignias/progreso, embed Educaplay.
Componentes: BadgeList, ProgressBar, GameIframe.
Visuales: Tarjetas, barras, gráficos línea (Recharts).

ChatModule: Interfaz chatbot (bubble UI).
Componentes: ChatWindow, adaptado por rol.

UserModule: Perfil, mapa avistamientos, métricas docente.
Componentes: MapView (Leaflet), MetricsDashboard.


Integraciones Transversales

Señales Django: post_save en Progreso → trigger GamifyService.
Tests: pytest (backend), Jest (frontend).
UI/UX: Tailwind CSS para minimalismo; Framer Motion para dinamismo.