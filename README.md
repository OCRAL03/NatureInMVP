# NatureIn MVP

Demo funcional del sitio con datos locales y configuración para PostgreSQL.

## Configuración de Backend (PostgreSQL)

- Variables de entorno requeridas:
  - `DB_NAME` (por defecto `naturein_database`)
  - `DB_USER` (por defecto `postgres`)
  - `DB_PASSWORD` (sin valor por defecto; requerido)
  - `DB_HOST` (por defecto `localhost`)
  - `DB_PORT` (por defecto `5432`)

- El backend usa exclusivamente PostgreSQL. No hay fallback a SQLite. Si falta `DB_PASSWORD`, el servidor no podrá iniciar.

- Inicialización rápida de base de datos:
  - `npm run install:backend`
  - `npm run setup:db` (crea la base y aplica migraciones si las credenciales son válidas)

## Frontend y Demo local

- Ejecutar:
  - `npm run install:frontend`
  - `npm --prefix frontend run dev`

- Rutas del demo:
  - `/demo` índice del Demo
  - `/demo/usuarios` lista de usuarios de ejemplo
  - `/demo/actividades` actividades y misiones
  - `/demo/fichas` fichas educativas con imágenes locales
  - `/demo/lugares` lugares turísticos de Tingo María
  - `/demo/minijuegos` catálogo de minijuegos (stub)

## Modo oscuro

- El tema oscuro se aplica automáticamente si tu sistema lo prefiere.
- Puedes alternar entre claro/oscuro desde el botón "Configuración" en la barra superior.
- En modo oscuro, el fondo y los componentes usan una paleta adecuada para asegurar buen contraste, incluyendo estados hover.

## Verificación

- `npm run typecheck` compila el frontend y ejecuta `manage.py check` en backend.
- `npm --prefix frontend run build` para generar artefactos de producción.

## Instalación rápida

- Frontend: `npm run install:frontend`
- Backend: `npm run install:backend`
- Base de datos y migraciones: `npm run setup:db`

## Notas

- El backend puede fallar al iniciar si `DB_PASSWORD` no está definido o no corresponde a su instalación de PostgreSQL.
- Las imágenes del demo se cargan desde `frontend/src/assets/images`. No se consume ninguna API externa en estas vistas.
