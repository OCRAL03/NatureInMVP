from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="NatureIn API",
        default_version='v1',
        description="""API para la plataforma educativa de biodiversidad NatureIn.
        
Módulos disponibles:
- **Autenticación**: Gestión de usuarios, login, registro y tokens JWT
- **Usuarios**: Perfiles de usuario, dashboards por rol (estudiante/profesor/experto)
- **Contenido**: Gestión de fichas educativas y búsqueda de especies
- **Gamificación**: Sistema de puntos, niveles, insignias y misiones
        """,
        terms_of_service="https://naturein.com/terms/",
        contact=openapi.Contact(email="soporte@naturein.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Documentación de API
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/schema/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    
    # Endpoints de servicios
    path('api/auth/', include('authservice.urls')),
    path('api/content/', include('contentservice.urls')),
    path('api/user/', include('userservice.urls')),
    path('api/gamify/', include('gamifyservice.urls')),
    path('api/v1/gamification/', include('gamifyservice.urls')),
    path('api/expert/', include('expertservice.urls')),
    path('api/ia/', include('iaservice.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR / 'static')