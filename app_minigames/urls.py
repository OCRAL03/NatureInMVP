from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from app_minigames import views
from core.views import landing

app_name= 'app_minigames'

urlpatterns = [
    path('', views.games_view, name='games'),
    path('admin/', admin.site.urls),
    path('api/v1/ai/', include('app_ai.urls')),
    path('launch/<int:juego_id>/<int:tool_id>/', views.launch_educaplay, name='launch_educaplay'),
]