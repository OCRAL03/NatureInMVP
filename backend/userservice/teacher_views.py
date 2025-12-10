"""
Teacher Dashboard Views
Endpoints para el dashboard de docentes
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from userservice.models import Sighting, UserProfile, UserActivity
from gamifyservice.models import UserScore, UserBadge
from authservice.models import UserRole

User = get_user_model()


@swagger_auto_schema(
    method='get',
    operation_description="Obtener estadísticas del dashboard para docentes",
    responses={
        200: openapi.Response('Estadísticas del docente'),
        401: 'No autenticado',
        403: 'No tiene permisos de docente'
    },
    tags=['Dashboard Docente']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_stats(request):
    """
    Retorna estadísticas generales para el dashboard del docente
    """
    # Verificar que el usuario sea docente
    try:
        user_role = UserRole.objects.get(user=request.user)
        if user_role.role != 'teacher':
            return Response(
                {'detail': 'Solo los docentes pueden acceder a este dashboard'},
                status=status.HTTP_403_FORBIDDEN
            )
    except UserRole.DoesNotExist:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener todos los estudiantes
    student_roles = UserRole.objects.filter(role='student').values_list('user_id', flat=True)
    total_students = len(student_roles)
    
    # Estudiantes activos hoy (con actividad en las últimas 24 horas)
    yesterday = timezone.now() - timedelta(days=1)
    active_today = UserActivity.objects.filter(
        user_id__in=student_roles,
        timestamp__gte=yesterday
    ).values('user').distinct().count()
    
    # Promedio de puntos de estudiantes
    scores = UserScore.objects.filter(user_id__in=student_roles)
    total_points = sum(score.points for score in scores)
    average_points = int(total_points / total_students) if total_students > 0 else 0
    
    # Estudiante con más puntos
    top_student_score = scores.order_by('-points').first()
    top_student = None
    if top_student_score:
        top_user = User.objects.get(id=top_student_score.user_id)
        top_student = {
            'id': top_user.id,
            'full_name': getattr(top_user, 'full_name', top_user.username),
            'points': top_student_score.points
        }
    
    # Avistamientos pendientes de revisión
    pending_sightings = Sighting.objects.filter(
        verification_status='pending'
    ).count()
    
    # Calcular tasa de completación (mock - necesitaría modelo de actividades)
    completion_rate = 68  # Placeholder
    engagement_rate = 75  # Placeholder
    
    return Response({
        'total_students': total_students,
        'active_today': active_today,
        'average_points': average_points,
        'top_student': top_student,
        'total_activities': 12,  # Placeholder
        'pending_sightings': pending_sightings,
        'completion_rate': completion_rate,
        'engagement_rate': engagement_rate
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Listar estudiantes del docente con sus estadísticas",
    responses={
        200: openapi.Response('Lista de estudiantes'),
        401: 'No autenticado',
        403: 'No tiene permisos de docente'
    },
    tags=['Dashboard Docente']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_students(request):
    """
    Retorna lista de estudiantes con sus estadísticas de progreso
    """
    # Verificar que el usuario sea docente
    try:
        user_role = UserRole.objects.get(user=request.user)
        if user_role.role != 'teacher':
            return Response(
                {'detail': 'Solo los docentes pueden acceder'},
                status=status.HTTP_403_FORBIDDEN
            )
    except UserRole.DoesNotExist:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener estudiantes
    student_roles = UserRole.objects.filter(role='student').select_related('user')
    students_data = []
    
    for role in student_roles[:50]:  # Limitar a 50 estudiantes
        user = role.user
        
        # Obtener perfil
        try:
            profile = UserProfile.objects.get(user=user)
            grade = profile.grade if hasattr(profile, 'grade') else 'N/A'
            section = profile.section if hasattr(profile, 'section') else 'N/A'
        except UserProfile.DoesNotExist:
            grade = 'N/A'
            section = 'N/A'
        
        # Obtener puntos
        user_score = UserScore.objects.filter(user=user).first()
        points = user_score.points if user_score else 0
        rank_name = user_score.rank.name if user_score and user_score.rank else 'Principiante'
        
        # Contar badges
        badges_count = UserBadge.objects.filter(user=user).count()
        
        # Contar avistamientos
        sightings_count = Sighting.objects.filter(user=user).count()
        
        # Última actividad
        last_activity = UserActivity.objects.filter(user=user).order_by('-timestamp').first()
        last_active = last_activity.timestamp.isoformat() if last_activity else None
        
        students_data.append({
            'id': user.id,
            'username': user.username,
            'full_name': getattr(user, 'full_name', user.username),
            'email': user.email,
            'grade': grade,
            'section': section,
            'points': points,
            'rank': rank_name,
            'badges_count': badges_count,
            'sightings_count': sightings_count,
            'activities_completed': 0,  # Placeholder
            'activities_total': 12,  # Placeholder
            'last_active': last_active
        })
    
    # Ordenar por puntos
    students_data.sort(key=lambda x: x['points'], reverse=True)
    
    return Response(students_data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Obtener avistamientos pendientes de los estudiantes",
    responses={
        200: openapi.Response('Lista de avistamientos pendientes'),
        401: 'No autenticado',
        403: 'No tiene permisos de docente'
    },
    tags=['Dashboard Docente']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_pending_sightings(request):
    """
    Retorna avistamientos pendientes de validación de estudiantes
    """
    # Verificar que el usuario sea docente
    try:
        user_role = UserRole.objects.get(user=request.user)
        if user_role.role != 'teacher':
            return Response(
                {'detail': 'Solo los docentes pueden acceder'},
                status=status.HTTP_403_FORBIDDEN
            )
    except UserRole.DoesNotExist:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener avistamientos pendientes de estudiantes
    student_roles = UserRole.objects.filter(role='student').values_list('user_id', flat=True)
    
    pending_sightings = Sighting.objects.filter(
        user_id__in=student_roles,
        verification_status='pending'
    ).select_related('user').order_by('-created_at')[:20]
    
    sightings_data = []
    for sighting in pending_sightings:
        sightings_data.append({
            'id': sighting.id,
            'species': sighting.species,
            'location': sighting.location,
            'student_name': getattr(sighting.user, 'full_name', sighting.user.username),
            'student_id': sighting.user.id,
            'photo_url': sighting.photo_url if hasattr(sighting, 'photo_url') else None,
            'description': sighting.description,
            'created_at': sighting.created_at.isoformat(),
            'verification_status': sighting.verification_status
        })
    
    return Response(sightings_data, status=status.HTTP_200_OK)
