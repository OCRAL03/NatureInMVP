from django.urls import path
from .views import (
    register,
    me,
    user_stats,
    sightings,
    sighting_detail,
    user_activities,
    user_profile,
    list_institutions,
    dashboard,
    teacher_stats,
    teacher_students,
    teacher_activities,
    teacher_progress_metrics,
    places,
    messages,
    docs_institutions, 
    docs_places
)

urlpatterns = [
    # Registro y autenticación
    path('register/', register, name='user_register'),

    path('institutions/', list_institutions, name='institution_list'),
    
    # Dashboard agregado (optimizado)
    path('dashboard/', dashboard, name='user_dashboard'),
    
    # Perfil del usuario autenticado
    path('me/', me, name='user_me'),
    path('me/stats/', user_stats, name='user_stats'),
    path('me/sightings/', sightings, name='user_sightings'),
    path('me/activities/', user_activities, name='user_activities'),

    # Detalle de Avistamiento (accesible globalmente)
    path('sightings/<int:pk>/', sighting_detail, name='sighting_detail'),

    # Perfil público de otros usuarios
    path('profile/<str:username>/', user_profile, name='user_profile'),
    
    # Teacher Dashboard
    path('teacher/stats/', teacher_stats, name='teacher_stats'),
    path('teacher/students/', teacher_students, name='teacher_students'),
    path('teacher/activities/', teacher_activities, name='teacher_activities'),
    path('teacher/progress-metrics/', teacher_progress_metrics, name='teacher_progress_metrics'),

    # Places (Lugares de Interés)
    path('places/', places, name='place_list'),
    
    # Messages (Mensajería Interna)
    path('messages/', messages, name='message_list'),
    
    # Documentation Endpoints
    path('docs/institutions/', docs_institutions, name='docs_institutions'),
    path('docs/places/', docs_places, name='docs_places'),
]
