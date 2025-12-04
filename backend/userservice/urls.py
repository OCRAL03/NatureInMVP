from django.urls import path
from .views import (
    register,
    me,
    user_stats,
    sightings,
    sighting_detail,
    user_activities,
    user_profile
)

urlpatterns = [
    # Registro y autenticación
    path('register/', register, name='user_register'),

    # Perfil del usuario autenticado
    path('me/', me, name='user_me'),
    path('me/stats/', user_stats, name='user_stats'),
    path('me/activities/', user_activities, name='user_activities'),

    # Avistamientos
    path('sightings/', sightings, name='user_sightings'),
    path('sightings/<int:pk>/', sighting_detail, name='sighting_detail'),

    # Perfil público de otros usuarios
    path('profile/<str:username>/', user_profile, name='user_profile'),
]