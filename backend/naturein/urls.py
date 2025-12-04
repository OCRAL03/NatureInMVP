from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authservice.urls')),
    path('api/content/', include('contentservice.urls')),
    path('api/user/', include('userservice.urls')),
    path('api/gamify/', include('gamifyservice.urls')),
    path('api/v1/gamification/', include('gamifyservice.urls')),
]

schema_view = get_schema_view(
    openapi.Info(
        title="NatureIn API",
        default_version='v1',
        description="Documentación de endpoints de NatureIn",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns += [
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/docs.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]
