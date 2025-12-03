Plan de Desarrollo Detallado
Para el curso de Diseño Detallado de Software, el desarrollo sigue metodología Ágil (Sprints de 2 semanas). Total: 8 sprints (16 semanas). Herramientas: Git (monorepo), Jira/Trello para backlog, VS Code.
Fases Generales

Preparación (Semana 1): Setup entorno (Docker, Vite, Django), migraciones DB (basado en esquema SQL simplificado).
Desarrollo Iterativo: Sprints enfocados en módulos.
Testing/Integración: Cobertura >80%, CI/CD con GitHub Actions.
Despliegue: Docker Compose local; Heroku/Vercel para demo.

Backlog y Sprints
Sprint 1: Setup y Auth (Semanas 1-2)

Tareas: Config DB PostgreSQL, AuthService (Django), AuthModule (React).
Historias Usuario: "Como estudiante, registro sin email obligatorio."
Entregable: Login funcional.
Métricas: 100% tests auth.

Sprint 2: ContentService (Semanas 3-4)

Tareas: Integrar GBIF/iNaturalist/EOL (Factory pattern), generar fichas.
Historias: "Como experto, busco especie y veo ficha auto-generada."
Entregable: Búsqueda especies con imágenes.
Patrones: Facade para APIs.

Sprint 3: UserService y Avistamientos (Semanas 5-6)

Tareas: Modelos progreso/avistamientos, mapa React.
Historias: "Como estudiante, reporto avistamiento geolocalizado."
Entregable: Mapa interactivo.

Sprint 4: GamifyService Básico (Semanas 7-8)

Tareas: Modelos gamificación, stubs puntos/insignias, Educaplay iframe.
Historias: "Como estudiante, completo actividad y gano puntos."
Patrones: Observer para eventos.
Entregable: Dashboard progreso (simulado).

Sprint 5: ChatService (Semanas 9-10)

Tareas: Setup Llama (Hugging Face), prompts por rol.
Historias: "Como docente, pregunto sobre especie y recibo explicación adaptada."
Entregable: Chat embebido.

Sprint 6: Gamify Avanzado y UI (Semanas 11-12)

Tareas: Implementar GamifyService real (award API, ranking), UI badges/misiones.
Historias: "Como docente, veo métricas tasa finalización."
Patrones: Strategy para métricas.
Entregable: Insignias dinámicas, conexión eventos.

Sprint 7: Integración y Testing (Semanas 13-14)

Tareas: End-to-end tests, microservicios comunicación (RabbitMQ).
Historias: "Como admin, valido flujo completo ficha → gamificación."
Entregable: Cobertura tests, demo video.

Sprint 8: Despliegue y Retrospective (Semanas 15-16)

Tareas: Docker/K8s setup, deploy Vercel/Heroku.
Historias: "Sistema accesible online."
Entregable: URL pública, docs actualizadas.

Recursos y Timeline

































SprintDuraciónResponsablesDependenciasRiesgos12 semTodosDB SetupAuth bugs22 semContent teamAPIs keysRate limits...............
Métricas de Éxito

Velocidad: Commit diario, sprint velocity >80%.
Calidad: Bugs <5 por sprint.
Usuario: Usabilidad score >4/5 (pruebas con 10 estudiantes).

Retrospective por Sprint

Al final de cada sprint: Meeting 1h, burndown chart review, ajustes backlog.