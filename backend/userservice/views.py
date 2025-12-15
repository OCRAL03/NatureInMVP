from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Count, Q, Value, Avg
from django.db.models.functions import Concat
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from pathlib import Path

from .models import Sighting, UserProfile, UserActivity, Institution, Place, Message
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    SightingSerializer,
    UserActivitySerializer,
    UserStatsSerializer,
    InstitutionSerializer,
    PlaceSerializer,
    MessageSerializer
)


@swagger_auto_schema(
    method='post',
    operation_description="Registro de nuevos usuarios en el sistema. Crea usuario, rol y perfil de forma atÃ³mica.",
    request_body=UserRegistrationSerializer,
    responses={
        201: openapi.Response('Usuario creado exitosamente', UserSerializer),
        400: 'Datos invÃ¡lidos o usuario ya existe'
    },
    tags=['Usuarios']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Registro de nuevos usuarios
    Endpoint pÃºblico que crea Usuario + Rol + Perfil de forma atÃ³mica
    """
    serializer = UserRegistrationSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "Usuario registrado exitosamente",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='get',
    operation_description="Listar todas las instituciones educativas disponibles",
    responses={
        200: openapi.Response('Lista de instituciones', InstitutionSerializer(many=True))
    },
    tags=['Usuarios']
)
@api_view(['GET'])
@permission_classes([AllowAny])
def list_institutions(request):
    """
    Endpoint pÃºblico para listar todas las instituciones educativas.
    """
    institutions = Institution.objects.all().order_by('name')
    serializer = InstitutionSerializer(institutions, many=True)
    return Response(serializer.data)


@swagger_auto_schema(
    methods=['get'],
    operation_description="Obtener informaciÃ³n completa del usuario autenticado incluyendo perfil y rol",
    responses={
        200: openapi.Response('InformaciÃ³n del usuario', examples={
            'application/json': {
                'id': 1,
                'username': 'juan_perez',
                'email': 'juan@example.com',
                'role': 'student',
                'profile': {}
            }
        }),
        401: 'No autenticado'
    },
    tags=['Usuarios']
)
@swagger_auto_schema(
    methods=['put', 'patch'],
    operation_description="Actualizar perfil del usuario autenticado",
    request_body=UserProfileUpdateSerializer,
    responses={
        200: openapi.Response('Perfil actualizado', UserProfileSerializer),
        400: 'Datos invÃ¡lidos',
        401: 'No autenticado'
    },
    tags=['Usuarios']
)
@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def me(request):
    """
    Obtener o actualizar informaciÃ³n del usuario autenticado
    GET: Retorna informaciÃ³n completa del usuario con perfil
    PUT/PATCH: Actualiza el perfil del usuario
    """
    # Re-fetch user con select_related para optimizar queries
    user = User.objects.select_related('profile', 'role').get(pk=request.user.pk)

    if request.method == 'GET':
        try:
            profile_data = UserProfileSerializer(user.profile).data
        except UserProfile.DoesNotExist:
            # Crear perfil si no existe (usuarios antiguos)
            profile = UserProfile.objects.create(user=user)
            profile_data = UserProfileSerializer(profile).data

        try:
            role = user.role.role
        except User.role.RelatedObjectDoesNotExist:
            role = 'student'

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': role,
            'profile': profile_data,
            'date_joined': user.date_joined
        })

    # PUT o PATCH: Actualizar perfil
    try:
        profile = user.profile
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=user)

    partial = request.method == 'PATCH'
    serializer = UserProfileUpdateSerializer(profile, data=request.data, partial=partial)

    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Perfil actualizado exitosamente',
            'profile': serializer.data
        })

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """
    Obtener estadÃ­sticas del usuario autenticado
    """
    user = request.user

    # Usar aggregate para optimizar queries
    sighting_stats = Sighting.objects.filter(user=user).aggregate(
        total_sightings=Count('id'),
        verified_sightings=Count('id', filter=Q(verification_status='verified')),
        pending_sightings=Count('id', filter=Q(verification_status='pending')),
    )

    # Obtener actividades recientes
    recent_activities = UserActivity.objects.filter(user=user)[:10]

    stats_data = {
        'total_sightings': sighting_stats.get('total_sightings', 0),
        'verified_sightings': sighting_stats.get('verified_sightings', 0),
        'pending_sightings': sighting_stats.get('pending_sightings', 0),
        'total_activities': UserActivity.objects.filter(user=user).count(),
        'recent_activities': UserActivitySerializer(recent_activities, many=True).data
    }

    serializer = UserStatsSerializer(stats_data)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def sightings(request):
    """
    GET: Listar avistamientos del usuario autenticado
    POST: Crear nuevo avistamiento
    """
    if request.method == 'POST':
        # Crear nuevo avistamiento
        serializer = SightingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET: Listar avistamientos
    user_sightings = Sighting.objects.filter(user=request.user).order_by('-created_at')

    # Filtros opcionales
    status_filter = request.query_params.get('status')
    if status_filter:
        user_sightings = user_sightings.filter(verification_status=status_filter)

    serializer = SightingSerializer(user_sightings, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def sighting_detail(request, pk):
    """
    GET: Obtener detalle de un avistamiento
    PATCH: Actualizar un avistamiento (solo si es del usuario)
    DELETE: Eliminar un avistamiento (solo si es del usuario)
    """
    try:
        sighting = Sighting.objects.get(pk=pk)
    except Sighting.DoesNotExist:
        return Response({'detail': 'Avistamiento no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # Verificar que el avistamiento pertenezca al usuario
    if sighting.user != request.user:
        return Response({'detail': 'No tienes permiso para acceder a este avistamiento'},
                        status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = SightingSerializer(sighting)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = SightingSerializer(sighting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        sighting.delete()
        return Response({'message': 'Avistamiento eliminado exitosamente'},
                        status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_activities(request):
    """
    Obtener historial de actividades del usuario
    """
    activities = UserActivity.objects.filter(user=request.user)

    # Filtro por tipo de actividad
    activity_type = request.query_params.get('type')
    if activity_type:
        activities = activities.filter(activity_type=activity_type)

    # PaginaciÃ³n simple
    limit = int(request.query_params.get('limit', 20))
    activities = activities[:limit]

    serializer = UserActivitySerializer(activities, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, username):
    """
    Ver perfil pÃºblico de otro usuario
    """
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user)

    # EstadÃ­sticas pÃºblicas optimizadas con aggregate
    public_stats = Sighting.objects.filter(user=user).aggregate(
        total_sightings=Count('id'),
        verified_sightings=Count('id', filter=Q(verification_status='verified'))
    )

    response_data = serializer.data
    response_data['stats'] = public_stats

    return Response(response_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    """
    Endpoint agregado para dashboard de usuario
    Retorna perfil, estadÃ­sticas, gamificaciÃ³n y misiones en una sola llamada
    Optimizado para reducir cantidad de requests del frontend
    """
    from gamifyservice.models import UserScore, UserBadge, Mission, UserProgress, Rank
    
    user = User.objects.select_related('profile', 'role').get(pk=request.user.pk)
    
    # 1. Perfil del usuario
    try:
        profile_data = UserProfileSerializer(user.profile).data
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=user)
        profile_data = UserProfileSerializer(profile).data
    
    try:
        role = user.role.role
    except:
        role = 'student'
    
    profile_info = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': role,
        'full_name': profile_data.get('full_name', ''),
        'institution': profile_data.get('institution', ''),
        'grade': profile_data.get('grade', ''),
        'section': profile_data.get('section', ''),
        'avatar_url': profile_data.get('avatar_url'),
        'date_joined': user.date_joined
    }
    
    # 2. EstadÃ­sticas de avistamientos
    sighting_stats = Sighting.objects.filter(user=user).aggregate(
        total_sightings=Count('id'),
        verified_sightings=Count('id', filter=Q(verification_status='verified')),
        pending_sightings=Count('id', filter=Q(verification_status='pending')),
    )
    
    stats_info = {
        'total_sightings': sighting_stats.get('total_sightings', 0),
        'verified_sightings': sighting_stats.get('verified_sightings', 0),
        'pending_sightings': sighting_stats.get('pending_sightings', 0),
        'total_activities': UserActivity.objects.filter(user=user).count()
    }
    
    # 3. MÃ©tricas de gamificaciÃ³n
    user_score = UserScore.objects.filter(user=user).select_related('rank').first()
    total_points = user_score.points if user_score else 0
    current_rank = user_score.rank if user_score else None
    
    # Badges del usuario
    badges = list(UserBadge.objects.filter(user=user).select_related('badge').values_list('badge__name', flat=True))
    
    # Calcular nivel basado en puntos
    level_info = _calculate_user_level(total_points)
    
    # PosiciÃ³n en el ranking
    rank_position = None
    if user_score:
        rank_position = UserScore.objects.filter(points__gt=user_score.points).count() + 1
    
    gamify_info = {
        'total_points': total_points,
        'rank': current_rank.name if current_rank else None,
        'rank_position': rank_position,
        'badges': badges,
        'level': level_info
    }
    
    # 4. Progreso de misiones
    user_missions = UserProgress.objects.filter(
        user=user
    ).select_related('mission').order_by('-updated_at')[:10]
    
    missions_data = []
    for up in user_missions:
        missions_data.append({
            'mission_id': up.mission.id,
            'mission': {
                'id': up.mission.id,
                'title': up.mission.title,
                'description': up.mission.description,
                'reward_points': up.mission.reward_points,
                'category': _get_mission_category(up.mission.id),
                'difficulty': _get_mission_difficulty(up.mission.reward_points),
            },
            'progress': up.progress,
            'completed': up.completed,
            'updated_at': up.updated_at
        })
    
    # 5. Actividades recientes
    recent_activities = UserActivity.objects.filter(user=user).order_by('-created_at')[:10]
    activities_data = UserActivitySerializer(recent_activities, many=True).data
    
    # Respuesta agregada
    dashboard_data = {
        'profile': profile_info,
        'stats': stats_info,
        'gamify': gamify_info,
        'missions': missions_data,
        'recent_activities': activities_data
    }
    
    from .serializers import DashboardSerializer
    serializer = DashboardSerializer(dashboard_data)
    return Response(serializer.data)


def _calculate_user_level(points: int) -> dict:
    """
    Calcula el nivel del usuario basado en puntos
    Sistema de niveles progresivos
    """
    levels = [
        {'name': 'Explorador Novato', 'tier': 1, 'min': 0, 'max': 99},
        {'name': 'Observador Curioso', 'tier': 2, 'min': 100, 'max': 299},
        {'name': 'Rastreador de la Naturaleza', 'tier': 3, 'min': 300, 'max': 599},
        {'name': 'GuardiÃ¡n Verde', 'tier': 4, 'min': 600, 'max': 999},
        {'name': 'Protector de la Biodiversidad', 'tier': 5, 'min': 1000, 'max': 1999},
        {'name': 'Maestro Naturalista', 'tier': 6, 'min': 2000, 'max': 3999},
        {'name': 'Sabio de la Selva', 'tier': 7, 'min': 4000, 'max': 7999},
        {'name': 'Leyenda Viviente', 'tier': 8, 'min': 8000, 'max': 999999},
    ]
    
    current_level = levels[0]
    for level in levels:
        if level['min'] <= points <= level['max']:
            current_level = level
            break
    
    # Calcular progreso en el nivel actual
    level_range = current_level['max'] - current_level['min']
    points_in_level = points - current_level['min']
    progress_percentage = min(100, int((points_in_level / level_range) * 100)) if level_range > 0 else 100
    
    return {
        'name': current_level['name'],
        'tier': current_level['tier'],
        'min_points': current_level['min'],
        'max_points': current_level['max'],
        'progress_percentage': progress_percentage
    }


def _get_mission_category(mission_id: int) -> str:
    """Determina categorÃ­a de misiÃ³n basado en ID (temporal)"""
    categories = ['exploration', 'knowledge', 'community', 'conservation']
    return categories[mission_id % 4]


def _get_mission_difficulty(reward_points: int) -> str:
    """Determina dificultad basado en puntos de recompensa"""
    if reward_points < 50:
        return 'easy'
    elif reward_points < 100:
        return 'medium'
    else:
        return 'hard'


# ============================================
# TEACHER DASHBOARD ENDPOINTS
# ============================================

@swagger_auto_schema(
    method='get',
    operation_description="Obtener estadisticas del dashboard de docentes",
    responses={
        200: openapi.Response('Estadisticas del docente'),
        401: 'No autenticado',
        403: 'No tiene permisos de docente'
    },
    tags=['Docentes']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_stats(request):
    from django.utils import timezone
    from datetime import timedelta
    from gamifyservice.models import UserScore
    
    try:
        if request.user.role.role != 'teacher':
            return Response({'detail': 'Solo docentes pueden acceder'}, status=status.HTTP_403_FORBIDDEN)
    except:
        return Response({'detail': 'Usuario sin rol asignado'}, status=status.HTTP_403_FORBIDDEN)
    
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    total_students = User.objects.filter(role__role='student').count()
    active_students = UserActivity.objects.filter(
        user__role__role='student',
        created_at__gte=thirty_days_ago
    ).values('user').distinct().count()
    
    total_sightings = Sighting.objects.filter(user__role__role='student').count()
    verified_sightings = Sighting.objects.filter(
        user__role__role='student',
        verification_status='verified'
    ).count()
    
    avg_score = UserScore.objects.filter(user__role__role='student').aggregate(
        avg=Avg('points')
    )['avg'] or 0
    
    completion_rate = round((active_students / total_students * 100), 1) if total_students > 0 else 0
    
    return Response({
        'total_students': total_students,
        'active_students': active_students,
        'total_sightings': total_sightings,
        'verified_sightings': verified_sightings,
        'avg_points': round(avg_score, 1),
        'completion_rate': completion_rate
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Obtener lista de estudiantes con metricas",
    tags=['Docentes']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_students(request):
    from gamifyservice.models import UserScore, UserBadge
    from django.utils import timezone
    
    try:
        if request.user.role.role != 'teacher':
            return Response({'detail': 'Solo docentes'}, status=status.HTTP_403_FORBIDDEN)
    except:
        return Response({'detail': 'Sin rol'}, status=status.HTTP_403_FORBIDDEN)
    
    students = User.objects.filter(role__role='student').select_related('profile')
    students_data = []
    
    for student in students:
        try:
            profile = student.profile
            full_name = profile.full_name or student.username
            grade = profile.grade or 'N/A'
            section = profile.section or 'N/A'
        except:
            full_name = student.username
            grade = section = 'N/A'
        
        score = UserScore.objects.filter(user=student).first()
        points = score.points if score else 0
        badges_count = UserBadge.objects.filter(user=student).count()
        total_sightings = Sighting.objects.filter(user=student).count()
        verified_sightings = Sighting.objects.filter(user=student, verification_status='verified').count()
        last_activity = UserActivity.objects.filter(user=student).order_by('-created_at').first()
        last_active = last_activity.created_at.isoformat() if last_activity else None
        days_inactive = (timezone.now() - last_activity.created_at).days if last_activity else 999
        
        students_data.append({
            'id': student.id,
            'username': student.username,
            'full_name': full_name,
            'email': student.email,
            'grade': grade,
            'section': section,
            'points': points,
            'badges_count': badges_count,
            'total_sightings': total_sightings,
            'verified_sightings': verified_sightings,
            'last_active': last_active,
            'days_inactive': days_inactive
        })
    
    students_data.sort(key=lambda x: x['points'], reverse=True)
    return Response(students_data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Actividades recientes de estudiantes",
    tags=['Docentes']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_activities(request):
    try:
        if request.user.role.role != 'teacher':
            return Response({'detail': 'Solo docentes'}, status=status.HTTP_403_FORBIDDEN)
    except:
        return Response({'detail': 'Sin rol'}, status=status.HTTP_403_FORBIDDEN)
    
    activities = UserActivity.objects.filter(
        user__role__role='student'
    ).select_related('user', 'user__profile').order_by('-created_at')[:50]
    
    activities_data = []
    for activity in activities:
        try:
            full_name = activity.user.profile.full_name or activity.user.username
        except:
            full_name = activity.user.username
        
        activities_data.append({
            'id': activity.id,
            'user': {
                'id': activity.user.id,
                'username': activity.user.username,
                'full_name': full_name
            },
            'activity_type': activity.activity_type,
            'description': activity.description,
            'timestamp': activity.created_at.isoformat()
        })
    
    return Response(activities_data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Metricas agregadas por grado",
    tags=['Docentes']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_progress_metrics(request):
    from gamifyservice.models import UserScore
    
    try:
        if request.user.role.role != 'teacher':
            return Response({'detail': 'Solo docentes'}, status=status.HTTP_403_FORBIDDEN)
    except:
        return Response({'detail': 'Sin rol'}, status=status.HTTP_403_FORBIDDEN)
    
    grades_data = {}
    profiles = UserProfile.objects.filter(user__role__role='student').select_related('user')
    
    for profile in profiles:
        grade_key = profile.grade or 'Sin grado'
        
        if grade_key not in grades_data:
            grades_data[grade_key] = {
                'grade': grade_key,
                'total_students': 0,
                'total_points': 0,
                'avg_points': 0,
                'total_sightings': 0
            }
        
        grades_data[grade_key]['total_students'] += 1
        
        score = UserScore.objects.filter(user=profile.user).first()
        if score:
            grades_data[grade_key]['total_points'] += score.points
        
        sightings_count = Sighting.objects.filter(user=profile.user).count()
        grades_data[grade_key]['total_sightings'] += sightings_count
    
    for grade_key in grades_data:
        total = grades_data[grade_key]['total_students']
        if total > 0:
            grades_data[grade_key]['avg_points'] = round(
                grades_data[grade_key]['total_points'] / total, 1
            )
    
    return Response(list(grades_data.values()), status=status.HTTP_200_OK)


# ============================================================
# LUGARES DE INTERÉS (PLACES)
# ============================================================

@swagger_auto_schema(
    method='get',
    operation_description="Listar lugares de interés turístico y educativo. Endpoint público.",
    responses={
        200: openapi.Response('Lista de lugares', PlaceSerializer(many=True))
    },
    tags=['Lugares']
)
@api_view(['GET'])
@permission_classes([AllowAny])
def places(request):
    """
    Listar lugares de interés
    Retorna rutas, parques, cataratas y puntos de exploración
    """
    queryset = Place.objects.filter(is_active=True).order_by('-visit_count', 'title')
    serializer = PlaceSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ============================================================
# MENSAJERÍA INTERNA
# ============================================================

message_request_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'recipient': openapi.Schema(
            type=openapi.TYPE_INTEGER,
            description='ID del usuario destinatario'
        ),
        'recipient_id': openapi.Schema(
            type=openapi.TYPE_INTEGER,
            description='Alias para recipient (retrocompatibilidad)'
        ),
        'subject': openapi.Schema(
            type=openapi.TYPE_STRING,
            description='Asunto del mensaje'
        ),
        'content': openapi.Schema(
            type=openapi.TYPE_STRING,
            description='Contenido del mensaje'
        ),
        'message_type': openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=['personal', 'notification', 'feedback', 'announcement'],
            description='Tipo de mensaje'
        ),
        'related_sighting': openapi.Schema(
            type=openapi.TYPE_INTEGER,
            description='ID del avistamiento relacionado (opcional)'
        ),
    },
    required=['content']
)

@swagger_auto_schema(
    method='post',
    operation_description="Enviar un mensaje a otro usuario",
    request_body=message_request_schema,
    responses={
        201: openapi.Response('Mensaje enviado', MessageSerializer),
        400: 'Datos inválidos'
    },
    tags=['Mensajería']
)
@swagger_auto_schema(
    method='get',
    operation_description="Listar mensajes recibidos. Usa ?with=<user_id> para filtrar conversación con usuario específico",
    manual_parameters=[
        openapi.Parameter(
            'with',
            openapi.IN_QUERY,
            description="ID del usuario para filtrar conversación",
            type=openapi.TYPE_INTEGER
        )
    ],
    responses={
        200: openapi.Response('Lista de mensajes', MessageSerializer(many=True))
    },
    tags=['Mensajería']
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def messages(request):
    """
    Gestión de mensajería interna
    GET: Lista mensajes recibidos (últimos 100)
    POST: Enviar nuevo mensaje
    """
    user = request.user
    
    if request.method == 'POST':
        # Preparar datos para el serializer
        recipient_id = request.data.get('recipient') or request.data.get('recipient_id')
        
        payload = {
            'sender': user.id,
            'recipient': recipient_id,
            'subject': request.data.get('subject', ''),
            'content': request.data.get('content', ''),
            'message_type': request.data.get('message_type', 'personal'),
            'related_sighting': request.data.get('related_sighting')
        }
        
        serializer = MessageSerializer(data=payload, context={'request': request})
        
        if serializer.is_valid():
            message = serializer.save()
            return Response(
                MessageSerializer(message).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # GET: Listar mensajes recibidos
    queryset = Message.objects.filter(recipient=user)
    
    # Filtrar por conversación con usuario específico
    with_user_id = request.GET.get('with')
    if with_user_id:
        try:
            queryset = queryset.filter(sender_id=int(with_user_id))
        except (ValueError, TypeError):
            pass
    
    # Últimos 100 mensajes
    queryset = queryset.order_by('-created_at')[:100]
    
    serializer = MessageSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ============================================================
# ENDPOINTS DE DOCUMENTACIÓN
# ============================================================

@swagger_auto_schema(
    method='get',
    operation_description="Cargar instituciones educativas desde archivo de documentación. Endpoint público.",
    responses={
        200: openapi.Response(
            'Lista de instituciones parseadas',
            openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'name': openapi.Schema(type=openapi.TYPE_STRING),
                        'address': openapi.Schema(type=openapi.TYPE_STRING),
                        'phone': openapi.Schema(type=openapi.TYPE_STRING),
                        'type': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            )
        )
    },
    tags=['Documentación']
)
@api_view(['GET'])
@permission_classes([AllowAny])
def docs_institutions(request):
    """
    Parsear instituciones educativas desde archivo markdown
    Lee docs/instituciones_educativas.md y extrae información estructurada
    """
    base_dir = Path(__file__).resolve().parents[2]
    file_path = base_dir / 'docs' / 'instituciones_educativas.md'
    items = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                text = line.strip()
                if not text:
                    continue
                
                # Detectar nombre de institución
                if (text.startswith('COLEGIO') or 
                    'SECUNDARIO' in text or 
                    'Amazonas' in text or 
                    'Galileo' in text):
                    name = text.replace(':', '').strip()
                    items.append({'name': name})
                
                # Extraer dirección
                elif text.startswith('Dirección:'):
                    address = text.split('Dirección:')[-1].strip()
                    if items:
                        items[-1]['address'] = address
                
                # Extraer teléfono
                elif text.startswith('Teléfono:'):
                    phone = text.split('Teléfono:')[-1].strip()
                    if items:
                        items[-1]['phone'] = phone
    
    except FileNotFoundError:
        return Response({
            'error': 'Archivo de instituciones no encontrado',
            'path': str(file_path)
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Error al leer archivo: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Agregar tipo por defecto
    for item in items:
        item.setdefault('type', 'Mixto')
        item.setdefault('address', 'No especificada')
        item.setdefault('phone', 'No especificado')
    
    return Response(items, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Cargar lugares turísticos desde archivo de documentación. Endpoint público.",
    responses={
        200: openapi.Response(
            'Lista de lugares parseados',
            openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'title': openapi.Schema(type=openapi.TYPE_STRING),
                        'location': openapi.Schema(type=openapi.TYPE_STRING),
                        'description': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            )
        )
    },
    tags=['Documentación']
)
@api_view(['GET'])
@permission_classes([AllowAny])
def docs_places(request):
    """
    Parsear lugares turísticos desde archivo markdown
    Lee docs/lugares_turisticos.md y extrae información estructurada
    """
    base_dir = Path(__file__).resolve().parents[2]
    file_path = base_dir / 'docs' / 'lugares_turisticos.md'
    items = []
    current = None
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                text = line.strip()
                if not text:
                    continue
                
                # Detectar título numerado: "1. Parque Nacional..."
                if text[0].isdigit() and '.' in text[:3]:
                    title = text.split('.', 1)[1].strip()
                    current = {'title': title}
                    items.append(current)
                
                # Detectar ubicación
                elif current and any(keyword in text for keyword in [
                    'Distrito', 'Caserío', 'Campus', 'Cerro', 'Carretera',
                    'Sector', 'Zona', 'Plaza de Armas', 'Huallaga', 'UNAS'
                ]):
                    current.setdefault('location', text)
                
                # Detectar descripción (primer texto libre después del título)
                elif current and 'description' not in current and len(text) > 15:
                    # Ignorar encabezados de secciones
                    if not any(text.startswith(prefix) for prefix in [
                        'Horarios', 'Recomendaciones', 'Flora', 'Fauna',
                        'Ubicación', 'Descripción del Lugar'
                    ]):
                        current['description'] = text
    
    except FileNotFoundError:
        return Response({
            'error': 'Archivo de lugares turísticos no encontrado',
            'path': str(file_path)
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Error al leer archivo: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Agregar valores por defecto
    for item in items:
        item.setdefault('location', 'Ubicación no especificada')
        item.setdefault('description', 'Descripción no disponible')
    
    return Response(items, status=status.HTTP_200_OK)

