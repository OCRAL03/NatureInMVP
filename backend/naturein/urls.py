from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authservice.urls')),
    path('api/content/', include('contentservice.urls')),
    path('api/user/', include('userservice.urls')),
    path('api/gamify/', include('gamifyservice.urls')),
    path('api/ia/', include('iaservice.urls')),
]
