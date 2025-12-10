# Documentación de API - NatureIn

## 📚 Acceso a la Documentación

Una vez que inicies el servidor Django, podrás acceder a la documentación interactiva en:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Schema JSON**: http://localhost:8000/api/schema/

## ✅ Estado Actual

### Módulos Documentados:
- ✅ **Autenticación** (authservice)
  - POST `/api/auth/login/` - Login con JWT
  - POST `/api/auth/change-password/` - Cambiar contraseña
  - POST `/api/auth/request-password-reset/` - Solicitar recuperación

- ✅ **Usuarios** (userservice) - Parcialmente documentado
  - POST `/api/user/register/` - Registro de usuarios
  - GET `/api/user/institutions/` - Listar instituciones
  - GET/PUT/PATCH `/api/user/me/` - Perfil del usuario

### Pendientes de Documentar:

#### 📝 UserService (continuar):
```python
# En userservice/views.py, agregar decoradores a:

@swagger_auto_schema(
    method='get',
    operation_description="Obtener dashboard con estadísticas del usuario autenticado",
    responses={200: 'Dashboard data'},
    tags=['Usuarios - Dashboard']
)
@api_view(['GET'])
def dashboard(request):
    # ...

@swagger_auto_schema(
    method='get',
    operation_description="Listar avistamientos del usuario",
    manual_parameters=[
        openapi.Parameter('status', openapi.IN_QUERY, type=openapi.TYPE_STRING),
        openapi.Parameter('limit', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
    ],
    responses={200: SightingSerializer(many=True)},
    tags=['Avistamientos']
)
@api_view(['GET'])
def list_sightings(request):
    # ...
```

#### 🎮 GamifyService:
```python
# En gamifyservice/views.py, agregar:

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@swagger_auto_schema(
    method='get',
    operation_description="Obtener puntuación y nivel del usuario",
    tags=['Gamificación']
)
@api_view(['GET'])
def get_user_score(request):
    # ...

@swagger_auto_schema(
    method='get',
    operation_description="Listar todas las insignias disponibles",
    tags=['Gamificación']
)
@api_view(['GET'])
def list_badges(request):
    # ...

@swagger_auto_schema(
    method='get',
    operation_description="Obtener ranking de usuarios por puntos",
    manual_parameters=[
        openapi.Parameter('limit', openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description='Número de usuarios a retornar'),
    ],
    tags=['Gamificación']
)
@api_view(['GET'])
def get_leaderboard(request):
    # ...
```

#### 📄 ContentService:
```python
# En contentservice/views.py, agregar:

@swagger_auto_schema(
    method='get',
    operation_description="Buscar fichas educativas por texto",
    manual_parameters=[
        openapi.Parameter('q', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True, description='Texto de búsqueda'),
        openapi.Parameter('category', openapi.IN_QUERY, type=openapi.TYPE_STRING, description='Filtrar por categoría'),
    ],
    tags=['Contenido Educativo']
)
@api_view(['GET'])
def search_content(request):
    # ...

@swagger_auto_schema(
    method='post',
    operation_description="Crear nueva ficha educativa",
    request_body=ContentSerializer,
    tags=['Contenido Educativo']
)
@api_view(['POST'])
def create_content(request):
    # ...
```

## 🎨 Personalización de Tags

Los tags organizan los endpoints en la documentación. Usa estos tags consistentemente:

- `Autenticación` - Login, registro, tokens
- `Usuarios` - Gestión de usuarios y perfiles
- `Usuarios - Dashboard` - Endpoints del dashboard
- `Avistamientos` - Registro de especies observadas
- `Gamificación` - Puntos, niveles, insignias, misiones
- `Contenido Educativo` - Fichas, búsqueda
- `Instituciones` - Escuelas y centros educativos

## 📊 Ejemplos de Respuesta

Puedes agregar ejemplos de respuesta más detallados:

```python
@swagger_auto_schema(
    method='get',
    responses={
        200: openapi.Response(
            description='Usuario encontrado',
            examples={
                'application/json': {
                    'id': 1,
                    'username': 'juan_perez',
                    'email': 'juan@example.com',
                    'role': 'student',
                    'profile': {
                        'full_name': 'Juan Pérez',
                        'grade': '3°',
                        'section': 'B'
                    }
                }
            }
        )
    }
)
```

## 🔐 Autenticación en Swagger

La configuración actual permite probar endpoints autenticados:

1. Ir a http://localhost:8000/api/docs/
2. Hacer clic en el botón "Authorize" (candado verde)
3. Ingresar: `Bearer <tu_token_jwt>`
4. Ahora puedes probar endpoints que requieren autenticación

## 🚀 Comandos Útiles

```bash
# Ver la documentación localmente
cd backend
python manage.py runserver

# Luego visitar: http://localhost:8000/api/docs/
```

## 📝 Notas

- La documentación se genera automáticamente basándose en los decoradores
- Los serializers se documentan automáticamente
- Los parámetros de query deben especificarse manualmente con `manual_parameters`
- Usa `operation_description` para descripciones detalladas
- Organiza los endpoints con `tags` apropiados
