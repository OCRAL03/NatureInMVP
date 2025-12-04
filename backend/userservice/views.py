from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Count, Q

from .models import Sighting, UserProfile, UserActivity
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    SightingSerializer,
    UserActivitySerializer,
    UserStatsSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Registro de nuevos usuarios
    Endpoint público que crea Usuario + Rol + Perfil de forma atómica
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


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def me(request):
    """
    Obtener o actualizar información del usuario autenticado
    GET: Retorna información completa del usuario con perfil
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
    Obtener estadísticas del usuario autenticado
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

    # Paginación simple
    limit = int(request.query_params.get('limit', 20))
    activities = activities[:limit]

    serializer = UserActivitySerializer(activities, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, username):
    """
    Ver perfil público de otro usuario
    """
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user)

    # Estadísticas públicas optimizadas con aggregate
    public_stats = Sighting.objects.filter(user=user).aggregate(
        total_sightings=Count('id'),
        verified_sightings=Count('id', filter=Q(verification_status='verified'))
    )

    response_data = serializer.data
    response_data['stats'] = public_stats

    return Response(response_data)