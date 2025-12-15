| Módulo | Estado | Avance | Desviaciones vs. documento | Observaciones |
| --- | --- | --- | --- | --- |
| AuthService (RF-03, RF-71, RF-72, RF-73, RF-74, RF-75, RF-76, RF-109) | En progreso | 85% | Endpoint de login es `api/auth/token/` en lugar de `api/login/`; tokens en header, no cookies HttpOnly (RF-73); bloqueo por fuerza bruta a 3 intentos, no 5 ni `django-ratelimit` (RF-72); recuperación de contraseña propia con expiración 24h, no `django-allauth` ni 1h (RF-71); sin registro de sesiones (RF-76) | JWT funcional con rol en token y verificación de correo completa: `backend/authservice/views.py:36-97`, `240-357`; recuperación por token: `183-220`; intentos y bloqueo: `backend/authservice/models.py:22-54`, `views.py:49-69` |
| UserService (perfiles, avistamientos, mensajería) | En progreso | 75% | Falta modelo Progreso (RF-08) y endpoints asociados (`/api/progreso/`, `/api/calificaciones/`); no auditoría de cambios de rol (RF-74) | Perfil extendido y avistamientos completos: `backend/userservice/models.py:20-90`, con `verification_status`; registro público: `backend/userservice/views.py:39-72`; mensajes internos presentes |
| ContentService (fichas, guías, búsqueda) | En progreso | 60% | Falta carga de multimedia con compresión (RF-02, RF-55, RF-56), vista previa (RF-60), categorías/tags (RF-29); motor de búsqueda avanzado parcial (RF-61) | Generación de fichas y guías pedagógicas en PDF: `backend/contentservice/views.py:56-235`, `270-343`; autocompletado y exportación CSV: `238-267`; integra iNaturalist/GBIF/Wikipedia |
| ExpertService (revisión de avistamientos) | Completado | 80% | Campos de verificación avanzados pendientes (verified_by/at, razones estructuradas) | Flujo de pendientes y aprobar/rechazar: `backend/expertservice/urls.py:5-9`; `views.py:118-167`, `192-236`, `260-307`; valida rol experto |
| GamifyService (puntos, insignias, ranking, misiones) | En progreso | 70% | Falta endpoints de desafíos adicionales (RF-43), juego especie (RF-110/119), certificados PDF (RF-121); balance de niveles (RF-27) | Modelos completos: `backend/gamifyservice/models.py:6-83`; endpoints: `backend/gamifyservice/views.py:56-137`, `148-176`, `97-103`; ranking y misiones operativos |
| IAService (chat GROQ) | En progreso | 50% | Sin configuración automática ni fallback completo para roles; dependiente de `GROQ_API_KEY` | Chat por rol: `backend/iaservice/views.py:7-60`; restricciones por rol y prompts definidos |
| Frontend – Autenticación y Accesibilidad | En progreso | 65% | Tokens no en cookies HttpOnly (RF-73); accesibilidad parcial (foco/contraste mejorado en AuthForm, WCAG AA pendiente global) | `frontend/src/modules/auth/AuthForm.tsx` con verificación de correo y estados: línea `needsEmailVerification`; auditoría ligera aplicada |
| Frontend – Dashboards y Navegación | Pendiente | 30% | Falta dashboards por rol (RF-09, RF-91), navegación contextual (RF-79), accesos rápidos (RF-92), widgets personalizables, métricas KPI (RF-93), diseño responsivo (RF-105) | Estructura de UI básica; requiere implementación Tailwind y vistas diferenciadas por rol |

Notas de precisión y fuentes:
- Rutas principales expuestas: `backend/naturein/urls.py:37-45`.
- Configuración de seguridad y hashers: `backend/naturein/settings.py:86-92`.
- Verificación de correo probada end-to-end con resultados 200/403/201/200.

## 1. AuthService — Módulo de autenticación y seguridad
- Funcionalidades: login JWT, registro con verificación de correo, recuperación de contraseña, cambio de contraseña, bloqueo por intentos, auditoría ligera.
- Arquitectura:
  - Cliente → `POST /api/auth/token/` → JWT (`access`,`refresh`)
  - Cliente → `POST /api/auth/email/verify/*` → códigos 6 dígitos (expiran 15 min)
  - Cliente → `POST /api/auth/reset-password` → token de 24h
- Endpoints principales (`backend/authservice/urls.py`):
  - `POST /api/auth/token/` (login JWT)
  - `POST /api/auth/token/refresh/`
  - `POST /api/auth/email/verify/request/`
  - `POST /api/auth/email/verify/confirm/`
  - `POST /api/auth/email/verify/resend/`
  - `POST /api/auth/change-password`
  - `POST /api/auth/request-password-reset`
  - `POST /api/auth/reset-password`
  - `POST /api/auth/logout`
- Dependencias y tecnologías: `Django`, `DRF`, `djangorestframework-simplejwt`, `bcrypt`, `cryptography (Fernet)`, `drf-yasg`.
- Estado: En progreso (85%).

Diagrama (simplificado):
```
Frontend AuthForm → /api/auth/token → JWT
         └─ if 403 email_unverified → /api/auth/email/verify/request → code
                                        └→ /api/auth/email/verify/confirm → ok
Password reset: /api/auth/request-password-reset → token(24h) → /api/auth/reset-password
```

## 2. UserService — Módulo de Usuarios
- Funcionalidades: perfiles extendidos, avistamientos, mensajería interna, endpoints de dashboard docente/usuario.
- Arquitectura:
  - Perfiles `UserProfile` asociados a `User` (rol en `UserRole`)
  - Avistamientos `Sighting` con `verification_status` y relación a usuario
- Endpoints principales (`backend/userservice/urls.py`):
  - `POST /api/user/register/`
  - `GET /api/user/institutions/`
  - `GET|PUT|PATCH /api/user/me` y `GET /api/user/me/stats`
  - `GET /api/user/me/sightings` y `GET /api/user/sightings/{id}`
  - `GET /api/user/me/activities`
  - `GET /api/user/profile/{username}`
  - Teacher: `GET /api/user/teacher/stats`, `teacher/students`, `teacher/activities`, `teacher/progress-metrics`
  - `GET /api/user/places`, `POST /api/user/messages`
- Dependencias y tecnologías: `Django`, `DRF`, `drf-yasg`.
- Estado: En progreso (75%).

Diagrama (simplificado):
```
User ─1:1─ UserRole
User ─1:1─ UserProfile
User ─1:N─ Sighting
User ─messages─(sender→recipient)
```

## 3. ContentService — Gestión de Contenido
- Funcionalidades: generación de fichas educativas, autocompletado, exportación CSV, guías pedagógicas en PDF.
- Arquitectura:
  - Integración externa: iNaturalist, GBIF, Wikipedia/Wikidata/EOL
  - Imágenes: `SpeciesImage` enlaza archivos estáticos o media
- Endpoints principales (`backend/contentservice/urls.py`):
  - `POST /api/content/generate-ficha`
  - `GET /api/content/autocomplete`
  - `GET /api/content/export` (CSV)
  - `POST /api/content/teaching/guides` (PDF)
  - `POST /api/content/chat` (LLM auxiliar) y `GET /api/content/llm/health`
- Dependencias y tecnologías: `requests`, `reportlab`, `Pillow`, `DRF`, APIs externas.
- Estado: En progreso (60%).

Diagrama (simplificado):
```
Frontend → /api/content/generate-ficha
         ├─ iNaturalist/GBIF → enriquecimiento → SpeciesImage
         └─ Wikipedia/Wikidata/EOL → resumen/es
Export → CSV ; Guías → PDF (ReportLab)
```

## 4. GamifyService — Gestión de Gamificación
- Funcionalidades: puntos, rangos, insignias, progreso de misiones, ranking, métricas.
- Arquitectura:
  - Puntos (`Point`) → Puntaje (`UserScore`) → Rango (`Rank`)
  - Insignias (`Badge`, `BadgeDefinition`, `UserBadge`)
  - Misiones (`Mission`, `UserProgress`)
- Endpoints principales (`backend/gamifyservice/urls.py`):
  - `POST /api/gamify/award`
  - `GET /api/gamify/metrics`
  - `GET /api/gamify/ranking`
  - `GET /api/gamify/badges/me`
  - `POST /api/gamify/missions/progress`
  - `POST /api/gamify/lti/launch`
- Dependencias y tecnologías: `DRF`, `drf-yasg`.
- Estado: En progreso (70%).

Diagrama (simplificado):
```
Actividad → award(puntos/badge) → Point → UserScore → Rank
Misiones → missions/progress → UserProgress (reward_points → puntos)
```

## 5. Chatbot (IA service)
- Funcionalidades: chat conversacional con prompts por rol (student/teacher/expert), integración GROQ.
- Arquitectura:
  - `POST /api/ia/chat` → GROQ API (`llama-3.1-8b-instant`) vía `GROQ_API_KEY`
  - Restringe rol `admin`; retorna errores claros
- Endpoints principales (`backend/iaservice/urls.py`):
  - `POST /api/ia/chat/`
- Dependencias y tecnologías: `requests`, `DRF`, servicio externo Groq.
- Estado: En progreso (50%).

## Configuración de Producción
- Dominio: `naturein.educa` (pendiente confirmación y SSL)
- Variables de entorno backend (`backend/.env`):
  - `DB_ENGINE=postgresql`
  - `DB_NAME=naturein_database`
  - `DB_USER=postgres`
  - `DB_PASSWORD=1 tesla`
  - `DB_HOST=localhost` (o servicio gestionado)
  - `DB_PORT=5432`
  - `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend`
  - `EMAIL_HOST=<SMTP_HOST>`
  - `EMAIL_PORT=587`
  - `EMAIL_HOST_USER=zelayamy@gmail.com`
  - `EMAIL_HOST_PASSWORD=<SMTP_PASSWORD>`
  - `EMAIL_USE_TLS=true`
  - `DEFAULT_FROM_EMAIL=no-reply@naturein.educa`
  - `EMAIL_ENCRYPTION_KEY=<FernetKey>`
- Variables de entorno frontend (Vercel):
  - `VITE_API_BASE_URL=https://<backend-domain>/api`

## Protocolo de Rollback
- Mantener última versión estable en Vercel y backend.
- En caso de fallo crítico: revertir a despliegue previo, invalidar caché y desactivar nuevas rutas.
- Restaurar base de datos desde snapshot (PostgreSQL) y revisar logs.

## Pruebas Previas al Go-Live
- Carga: 50 usuarios concurrentes en login y fichas (JMeter/k6), objetivo ≤1.2s.
- Seguridad: bloqueo por intentos, verificación de correo, HTTPS, cookies seguras cuando se habiliten.
- Flujos críticos: registro, login, verificación, revisión de avistamientos, generación de fichas, puntos/insignias.
- Correo: solicitar/confirmar código y recuperación de contraseña.
