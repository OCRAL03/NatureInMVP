from django.urls import path
from .views import generate_ficha, health_check

urlpatterns = [
    path('generate-ficha', generate_ficha),
    path('health', health_check, name='health_check'),
]
