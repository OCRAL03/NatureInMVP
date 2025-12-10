# Dashboard de Estudiante - NatureIn MVP

## 🎯 Cambios Implementados

### 1. **Redirección Automática Post-Login**
- Después del login, los usuarios son redirigidos automáticamente a su dashboard según su rol:
  - **Estudiantes** → `/dashboard/student`
  - **Docentes** → `/dashboard/teacher`
  - **Expertos** → `/dashboard/expert`

### 2. **Navbar Mejorado para Usuarios Autenticados**
- **Avatar circular** con iniciales o foto del usuario
- **Menú desplegable** con las siguientes opciones:
  - 🏠 Dashboard (redirige según rol)
  - ⚙️ Configuración
  - 🚪 Cerrar sesión
- **Indicador de rol** (Estudiante, Docente, Experto)
- **Animaciones suaves** al abrir/cerrar el menú

### 3. **Dashboard de Estudiante Completo**
- **Header personalizado**: Avatar, nombre completo, institución, grado/sección
- **Indicador de nivel**: 8 niveles progresivos basados en puntos
- **Métricas**: Puntos, avistamientos, badges, actividades
- **Badges visuales**: Grid con iconos emoji
- **Misiones**: Lista separada en activas/completadas
- **Feed de actividad**: Últimas acciones del usuario
- **Optimizado**: Una sola llamada al backend (`/api/user/dashboard/`)

### 4. **Sistema de Niveles (8 Tiers)**
1. Explorador Novato (0-99 pts)
2. Observador Curioso (100-299 pts)
3. Rastreador de la Naturaleza (300-599 pts)
4. Guardián Verde (600-999 pts)
5. Protector de la Biodiversidad (1000-1999 pts)
6. Maestro Naturalista (2000-3999 pts)
7. Sabio de la Selva (4000-7999 pts)
8. Leyenda Viviente (8000+ pts)

### 5. **10 Misiones de Ejemplo**
- Primer Avistamiento (+20 pts)
- Explorador de la Biodiversidad (+50 pts)
- Guardián del Bosque (+75 pts)
- Maestro de la Observación (+100 pts)
- Conocedor de Especies (+30 pts)
- Fotógrafo Naturalista (+60 pts)
- Amigo de las Aves (+80 pts)
- Conservacionista Activo (+120 pts)
- Explorador Semanal (+150 pts)
- Leyenda de la Naturaleza (+200 pts)

## 🚀 Instrucciones de Prueba

### Paso 1: Configurar Backend

1. **Activar entorno virtual** (si no está activado):
```powershell
cd backend
# Si tienes problemas con PowerShell:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

2. **Crear rangos y misiones**:
```powershell
python manage.py shell
```

Dentro del shell:
```python
exec(open('scripts/create_ranks.py').read())
exec(open('scripts/create_sample_missions.py').read())
exit()
```

3. **Iniciar servidor backend**:
```powershell
python manage.py runserver 1220
```

### Paso 2: Iniciar Frontend

En otra terminal:
```powershell
cd frontend
npm run dev
```

### Paso 3: Probar el Flujo Completo

1. Ir a `http://localhost:5173/login`
2. **Registrarse** como estudiante:
   - Nombre completo: Tu nombre
   - Usuario: `estudiante01`
   - Email: `test@example.com`
   - Contraseña: `Test1234`
   - Rol: Estudiante
   - Grado: 5°
   - Sección: A
3. Al hacer clic en "Registrarse", deberías ser redirigido a `/dashboard/student`
4. **Explorar el dashboard**:
   - Ver tu nivel actual (Explorador Novato)
   - Revisar las métricas (todo en 0 al inicio)
   - Ver las misiones disponibles
5. **Probar el menú de usuario**:
   - Clic en tu avatar (arriba a la derecha)
   - Ver opciones: Dashboard, Configuración, Cerrar sesión
   - Probar navegación al dashboard
   - Probar logout

### Paso 4: Simular Progreso (Opcional)

Para ver el dashboard con datos, puedes ejecutar en el shell de Django:

```python
from django.contrib.auth.models import User
from gamifyservice.models import UserScore, UserBadge, Badge, Rank, Mission, UserProgress
from userservice.models import UserActivity

# Obtener usuario
user = User.objects.get(username='estudiante01')

# Agregar puntos
score, _ = UserScore.objects.get_or_create(user=user)
score.points = 350  # Nivel "Rastreador de la Naturaleza"
rank = Rank.objects.filter(min_points__lte=350).order_by('-min_points').first()
score.rank = rank
score.save()

# Agregar badges
badge1, _ = Badge.objects.get_or_create(name='Explorador', defaults={'description': 'Primera exploración'})
badge2, _ = Badge.objects.get_or_create(name='Fotógrafo', defaults={'description': 'Primera foto'})
UserBadge.objects.get_or_create(user=user, badge=badge1)
UserBadge.objects.get_or_create(user=user, badge=badge2)

# Agregar progreso en misión
mission = Mission.objects.first()
if mission:
    UserProgress.objects.update_or_create(
        user=user,
        mission=mission,
        defaults={'progress': 60, 'completed': False}
    )

# Agregar actividad
UserActivity.objects.create(
    user=user,
    activity_type='sighting',
    description='Avistamiento de Cotomono en la selva'
)

print("✓ Datos de prueba agregados correctamente")
```

## 📁 Archivos Creados/Modificados

### Nuevos
- `frontend/src/modules/user_dashboard/StudentDashboard.tsx`
- `frontend/src/modules/user_dashboard/types.ts`
- `frontend/src/modules/user_dashboard/hooks/useDashboardData.ts`
- `frontend/src/modules/user_dashboard/components/StatsCard.tsx`
- `frontend/src/modules/user_dashboard/components/LevelIndicator.tsx`
- `frontend/src/modules/user_dashboard/components/BadgesList.tsx`
- `frontend/src/modules/user_dashboard/components/ActivityFeed.tsx`
- `frontend/src/modules/user_dashboard/components/MissionsList.tsx`
- `backend/scripts/create_ranks.py`
- `backend/scripts/create_sample_missions.py`

### Modificados
- `frontend/src/modules/auth/AuthForm.tsx` - Redirección por rol
- `frontend/src/App.tsx` - Rutas `/dashboard/*`
- `frontend/src/components/layout/Navbar.tsx` - Menú de usuario mejorado
- `backend/userservice/views.py` - Endpoint `/api/user/dashboard/`
- `backend/userservice/urls.py` - Ruta del dashboard
- `backend/userservice/serializers.py` - Serializer agregado

## 🎨 Estilos Mantenidos

- Bordes con degradado verde-azul (`gradient-border`)
- Tarjetas con sombra (`card`)
- Botones consistentes (`btn-primary`, `btn-outline`)
- Responsive (grid adaptable)
- Modo oscuro soportado
- Animaciones suaves con Framer Motion

## 🔧 Endpoints Backend

- `GET /api/user/dashboard/` - Datos completos del dashboard (optimizado)
- `GET /api/user/me/` - Perfil del usuario
- `GET /api/gamify/metrics` - Métricas de gamificación
- `POST /api/gamify/missions/progress` - Actualizar progreso de misión

## ✅ Checklist de Verificación

- [✅ ] Backend corriendo en puerto 1200
- [✅ ] Frontend corriendo en puerto 5173
- [✅] Rangos creados en la BD
- [✅ ] Misiones creadas en la BD
- [✅ ] Login redirige a `/dashboard/student`
- [✅ ] Avatar aparece en el navbar
- [✅ ] Menú desplegable funciona correctamente
- [✅ ] Dashboard carga sin errores
- [✅ ] Nivel se muestra correctamente
- [✅ ] Logout funciona y limpia el token
