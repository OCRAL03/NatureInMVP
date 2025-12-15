APIs de Mensajería y Actividades
Fecha: 2025-12-11

Autenticación
- JWT con `POST /api/auth/token/` y `POST /api/auth/refresh/`.
- Perfil/rol: `GET /api/auth/me/`.

Mensajería (`/api/user/`)
- `GET /api/user/conversations/` — Lista conversaciones del usuario.
- `POST /api/user/conversations/` — Crea conversación. Body: `{ title?: string, participants: number[] }`.
- `GET /api/user/messages/?conversation={id}` — Lista mensajes de una conversación en la que participa.
- `POST /api/user/messages/` — Envía mensaje. Body: `{ conversation: number, content: string }`.
- `GET /api/user/messages/read/` — Mensajes marcados como leídos por el usuario.

Actividades (`/api/activity/`)
- `GET /api/activity/activities/` — Lista actividades (publicadas para estudiantes; todas para docentes/admin).
- `POST /api/activity/activities/` — Crea actividad (docente/admin). Body: `{ title, type, description?, content?, status?, items?: [...] }`.
- `PUT /api/activity/activities/{id}/` — Edita actividad (autor/admin). Body igual a POST.
- `POST /api/activity/activities/{id}/publish/` — Publica actividad (autor/admin).
- `GET /api/activity/activities/submissions/` — Lista envíos (propios para estudiantes; todos para docente/admin).
- `POST /api/activity/activities/submissions/` — Crea/actualiza envío. Body: `{ activity, answers?: [{ item, answer }] }`.

Seguridad
- Permisos por defecto `IsAuthenticated`; endpoints públicos mantienen `AllowAny` explícito.
- Roles aplicados en actividades: solo autor/admin editan o publican; estudiantes consumen y envían.

Notas
- Progreso calculado automáticamente en envíos según cantidad de ítems respondidos.
- Conversaciones y mensajes restringidos a participantes.
