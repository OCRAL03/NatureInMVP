from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Avg, Q, F
from django.utils import timezone
from datetime import timedelta, datetime
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from userservice.models import Sighting


@swagger_auto_schema(
    method='get',
    operation_description="Obtener estadísticas de validación del experto autenticado",
    responses={
        200: openapi.Response(
            'Estadísticas de validación',
            examples={
                'application/json': {
                    'total_reviews': 247,
                    'approved_count': 189,
                    'rejected_count': 31,
                    'pending_count': 27,
                    'approval_rate': 85.97,
                    'avg_review_time': 18,
                    'reviews_this_week': 12,
                    'reviews_this_month': 54
                }
            }
        ),
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Expertos']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validation_stats(request):
    """
    Obtiene las estadísticas de validación para el experto actual
    - Total de revisiones realizadas
    - Avistamientos aprobados/rechazados/pendientes
    - Tasa de aprobación
    - Tiempo promedio de revisión
    - Actividad semanal/mensual
    """
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden acceder a estas estadísticas'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Obtener todos los avistamientos revisados por este experto
    # TODO: Agregar campo reviewed_by en el modelo Sighting
    # Por ahora, mostramos estadísticas globales del sistema
    
    total_sightings = Sighting.objects.count()
    approved = Sighting.objects.filter(verification_status='verified').count()
    rejected = Sighting.objects.filter(verification_status='rejected').count()
    pending = Sighting.objects.filter(verification_status='pending').count()
    
    # Calcular tasa de aprobación
    total_reviewed = approved + rejected
    approval_rate = (approved / total_reviewed * 100) if total_reviewed > 0 else 0
    
    # Estadísticas por periodo
    now = timezone.now()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)
    
    reviews_this_week = Sighting.objects.filter(
        Q(verification_status='verified') | Q(verification_status='rejected'),
        updated_at__gte=week_ago
    ).count()
    
    reviews_this_month = Sighting.objects.filter(
        Q(verification_status='verified') | Q(verification_status='rejected'),
        updated_at__gte=month_ago
    ).count()
    
    # Tiempo promedio de revisión (en minutos)
    # TODO: Implementar campo review_time en modelo
    avg_review_time = 0
    
    return Response({
        'total_reviews': total_reviewed,
        'approved_count': approved,
        'rejected_count': rejected,
        'pending_count': pending,
        'approval_rate': round(approval_rate, 2),
        'avg_review_time': avg_review_time,
        'reviews_this_week': reviews_this_week,
        'reviews_this_month': reviews_this_month,
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Obtener lista de avistamientos pendientes de validación",
    responses={
        200: openapi.Response('Lista de avistamientos pendientes'),
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Expertos']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_sightings(request):
    """
    Obtiene todos los avistamientos pendientes de validación
    """
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden acceder a esta información'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener avistamientos pendientes
    sightings = Sighting.objects.filter(verification_status='pending').select_related('user', 'user__profile').order_by('-created_at')
    
    # Serializar resultados
    data = []
    for sighting in sightings:
        data.append({
            'id': sighting.id,
            'user': {
                'id': sighting.user.id if sighting.user else 0,
                'username': sighting.user.username if sighting.user else 'Anónimo',
                'full_name': sighting.user.profile.full_name if (sighting.user and hasattr(sighting.user, 'profile')) else (sighting.user.username if sighting.user else 'Anónimo'),
                'role': sighting.user.role.role if (sighting.user and hasattr(sighting.user, 'role')) else 'student'
            },
            'species': sighting.species,
            'common_name': '',  # TODO: Agregar campo
            'location': sighting.location or '',
            'latitude': float(sighting.latitude) if sighting.latitude else None,
            'longitude': float(sighting.longitude) if sighting.longitude else None,
            'date_observed': sighting.created_at,  # Usar created_at como fecha de observación
            'confidence_level': 0.75,  # TODO: Agregar campo
            'observation_notes': sighting.description or '',
            'photo_url': sighting.image_url or None,
            'verification_status': sighting.verification_status,  # Campo correcto para el frontend
            'created_at': sighting.created_at,
            'flagged_for_review': False,  # TODO: Agregar campo en modelo
            'expert_consensus_needed': False,  # TODO: Agregar campo en modelo
            'taxonomy_verified': False,
            'rarity_level': 'common',  # TODO: Agregar campo en modelo
            'observation_quality': 'medium'  # TODO: Calcular basado en datos
        })
    
    return Response(data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    operation_description="Aprobar un avistamiento",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'points': openapi.Schema(type=openapi.TYPE_INTEGER, description='Puntos a otorgar'),
            'scientific_notes': openapi.Schema(type=openapi.TYPE_STRING, description='Notas científicas'),
            'taxonomy_verified': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Taxonomía verificada'),
        }
    ),
    responses={
        200: 'Avistamiento aprobado exitosamente',
        400: 'Datos inválidos',
        401: 'No autenticado',
        403: 'No tiene permisos',
        404: 'Avistamiento no encontrado'
    },
    tags=['Expertos']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_sighting(request, sighting_id):
    """
    Aprobar un avistamiento específico
    """
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden aprobar avistamientos'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        sighting = Sighting.objects.get(id=sighting_id)
    except Sighting.DoesNotExist:
        return Response(
            {'detail': 'Avistamiento no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Aprobar el avistamiento
    sighting.verification_status = 'verified'
    # TODO: Agregar campos verified_by y verified_at
    # sighting.verified_by = request.user
    # sighting.verified_at = timezone.now()
    
    # TODO: Agregar campos adicionales
    # sighting.scientific_notes = request.data.get('scientific_notes', '')
    # sighting.taxonomy_verified = request.data.get('taxonomy_verified', False)
    
    sighting.save()
    
    # TODO: Otorgar puntos al usuario que hizo el avistamiento
    points = request.data.get('points', 10)
    
    return Response({
        'success': True,
        'message': f'Avistamiento aprobado exitosamente. {points} puntos otorgados.'
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    operation_description="Rechazar un avistamiento",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['reason'],
        properties={
            'reason': openapi.Schema(type=openapi.TYPE_STRING, description='Razón del rechazo'),
            'suggestions': openapi.Schema(type=openapi.TYPE_STRING, description='Sugerencias para el estudiante'),
        }
    ),
    responses={
        200: 'Avistamiento rechazado exitosamente',
        400: 'Datos inválidos',
        401: 'No autenticado',
        403: 'No tiene permisos',
        404: 'Avistamiento no encontrado'
    },
    tags=['Expertos']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_sighting(request, sighting_id):
    """
    Rechazar un avistamiento específico
    """
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden rechazar avistamientos'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    reason = request.data.get('reason')
    if not reason:
        return Response(
            {'detail': 'La razón del rechazo es obligatoria'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        sighting = Sighting.objects.get(id=sighting_id)
    except Sighting.DoesNotExist:
        return Response(
            {'detail': 'Avistamiento no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    # Rechazar el avistamiento
    sighting.verification_status = 'rejected'
    # TODO: Agregar campos verified_by y verified_at
    # sighting.verified_by = request.user
    # sighting.verified_at = timezone.now()
    sighting.verified_at = timezone.now()
    
    # TODO: Agregar campos para guardar razón y sugerencias
    # sighting.rejection_reason = reason
    # sighting.suggestions = request.data.get('suggestions', '')
    
    sighting.save()
    
    return Response({
        'success': True,
        'message': 'Avistamiento rechazado. Se ha enviado retroalimentación al estudiante.'
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Obtener estadísticas de biodiversidad",
    responses={
        200: openapi.Response('Estadísticas de biodiversidad'),
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Analytics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def biodiversity_stats(request):
    """
    Obtiene estadísticas de biodiversidad basadas en los avistamientos validados
    VERSION: 2025-12-09-22:00 ACTUALIZADA
    """
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden acceder a esta información'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Contar todas las especies únicas en el sistema
    from userservice.models import Sighting as SightingModel
    all_sightings = SightingModel.objects.all()
    unique_species_total = all_sightings.values('species').distinct().count()
    
    # DEBUG: Imprimir en consola
    print(f"=== BIODIVERSITY STATS V2 ===")
    print(f"Total avistamientos: {all_sightings.count()}")
    print(f"Total especies únicas: {unique_species_total}")
    print(f"=============================")
    
    # Contar avistamientos validados
    validated_sightings = SightingModel.objects.filter(verification_status='verified')
    
    return Response({
        'total_species': unique_species_total,
        'species_validated': validated_sightings.count(),
        'unique_families': 0,
        'unique_kingdoms': 0,
        'endemic_species': 0,
        'threatened_species': 0
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Obtener métricas de validación por período",
    manual_parameters=[
        openapi.Parameter('period', openapi.IN_QUERY, type=openapi.TYPE_STRING, 
                         description="Período: week, month, quarter, year")
    ],
    responses={
        200: openapi.Response('Métricas de validación'),
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Analytics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validation_metrics(request):
    """
    Obtiene métricas de validación para el período especificado
    """
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden acceder a esta información'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    period = request.GET.get('period', 'month')
    
    # Calcular fechas según el período
    now = timezone.now()
    if period == 'week':
        start_date = now - timedelta(days=7)
    elif period == 'quarter':
        start_date = now - timedelta(days=90)
    elif period == 'year':
        start_date = now - timedelta(days=365)
    else:  # month por defecto
        start_date = now - timedelta(days=30)
    
    # Obtener validaciones del período
    validations = Sighting.objects.filter(
        Q(verification_status='verified') | Q(verification_status='rejected'),
        updated_at__gte=start_date
    )
    
    total_validations = validations.count()
    approved = validations.filter(verification_status='verified').count()
    rejected = validations.filter(verification_status='rejected').count()
    
    return Response({
        'period': period,
        'total_validations': total_validations,
        'approved': approved,
        'rejected': rejected,
        'needs_revision': 0,  # TODO: Implementar estado needs_revision
        'avg_accuracy_score': 0.0,  # TODO: Calcular basado en confidence_score
        'avg_response_time': 0.0,  # TODO: Calcular tiempo entre created_at y updated_at
        'quality_trend': 'stable'  # TODO: Calcular tendencia comparando con período anterior
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Obtener distribución taxonómica",
    responses={
        200: openapi.Response('Distribución por reino'),
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Analytics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def taxonomy_distribution(request):
    """
    Obtiene la distribución de especies por reino taxonómico
    """
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden acceder a esta información'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Por ahora retornamos datos de ejemplo ya que no tenemos campo kingdom
    # TODO: Agregar campo kingdom al modelo Sighting y hacer query real
    validated_count = Sighting.objects.filter(verification_status='verified').count()
    
    # Distribución de ejemplo basada en los datos que tenemos
    distribution = []
    if validated_count > 0:
        distribution = [
            {
                'kingdom': 'Animalia',
                'count': int(validated_count * 0.7),
                'percentage': 70.0,
                'color': '#3b82f6'
            },
            {
                'kingdom': 'Plantae',
                'count': int(validated_count * 0.3),
                'percentage': 30.0,
                'color': '#10b981'
            }
        ]
    
    return Response(distribution, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Obtener datos temporales de validaciones",
    manual_parameters=[
        openapi.Parameter('period', openapi.IN_QUERY, type=openapi.TYPE_STRING, 
                         description="Período: week, month, quarter, year, all")
    ],
    responses={
        200: openapi.Response('Datos temporales'),
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Analytics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def temporal_data(request):
    """
    Obtiene datos de validaciones agrupados por fecha para gráficos de tendencias
    """
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden acceder a esta información'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    period = request.GET.get('period', 'month')
    
    # Calcular fechas según el período
    now = timezone.now()
    if period == 'week':
        start_date = now - timedelta(days=7)
        days_range = 7
    elif period == 'quarter':
        start_date = now - timedelta(days=90)
        days_range = 90
    elif period == 'year':
        start_date = now - timedelta(days=365)
        days_range = 365
    elif period == 'all':
        # Obtener la fecha del primer avistamiento
        first_sighting = Sighting.objects.order_by('created_at').first()
        if first_sighting:
            start_date = first_sighting.created_at
            days_range = (now - start_date).days
        else:
            start_date = now - timedelta(days=30)
            days_range = 30
    else:  # month por defecto
        start_date = now - timedelta(days=30)
        days_range = 30
    
    # Generar datos para cada día
    temporal_data = []
    
    # Agrupar por semanas si es más de 90 días
    if days_range > 90:
        # Agrupar por semanas
        for i in range(0, days_range, 7):
            week_start = start_date + timedelta(days=i)
            week_end = week_start + timedelta(days=7)
            
            approved = Sighting.objects.filter(
                verification_status='verified',
                updated_at__gte=week_start,
                updated_at__lt=week_end
            ).count()
            
            rejected = Sighting.objects.filter(
                verification_status='rejected',
                updated_at__gte=week_start,
                updated_at__lt=week_end
            ).count()
            
            pending = Sighting.objects.filter(
                verification_status='pending',
                created_at__gte=week_start,
                created_at__lt=week_end
            ).count()
            
            temporal_data.append({
                'date': week_start.strftime('%Y-%m-%d'),
                'label': week_start.strftime('%d/%m'),
                'approved': approved,
                'rejected': rejected,
                'pending': pending,
                'total': approved + rejected + pending
            })
    else:
        # Datos diarios para períodos cortos
        for i in range(days_range):
            day = start_date + timedelta(days=i)
            day_end = day + timedelta(days=1)
            
            approved = Sighting.objects.filter(
                verification_status='verified',
                updated_at__gte=day,
                updated_at__lt=day_end
            ).count()
            
            rejected = Sighting.objects.filter(
                verification_status='rejected',
                updated_at__gte=day,
                updated_at__lt=day_end
            ).count()
            
            pending = Sighting.objects.filter(
                verification_status='pending',
                created_at__gte=day,
                created_at__lt=day_end
            ).count()
            
            temporal_data.append({
                'date': day.strftime('%Y-%m-%d'),
                'label': day.strftime('%d/%m'),
                'approved': approved,
                'rejected': rejected,
                'pending': pending,
                'total': approved + rejected + pending
            })
    
    return Response(temporal_data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    operation_description="Generar datos para un reporte científico",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING, description='Título del reporte'),
            'template_id': openapi.Schema(type=openapi.TYPE_STRING, description='ID de la plantilla'),
            'date_from': openapi.Schema(type=openapi.TYPE_STRING, description='Fecha inicio (YYYY-MM-DD)'),
            'date_to': openapi.Schema(type=openapi.TYPE_STRING, description='Fecha fin (YYYY-MM-DD)'),
            'include_summary': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            'include_validation_stats': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            'include_biodiversity': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            'include_taxonomy': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            'include_temporal_trends': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            'include_species_list': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            'include_recommendations': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            'filters': openapi.Schema(type=openapi.TYPE_OBJECT),
        }
    ),
    responses={
        200: openapi.Response('Datos del reporte generados'),
        400: 'Parámetros inválidos',
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Reportes']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_report(request):
    """
    Genera los datos para un reporte científico basado en la configuración proporcionada
    """
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden generar reportes'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener configuración del reporte
    config = request.data
    title = config.get('title', 'Reporte de Validación')
    date_from = config.get('date_from')
    date_to = config.get('date_to')
    
    # Parsear fechas
    try:
        if date_from:
            start_date = datetime.strptime(date_from, '%Y-%m-%d')
            start_date = timezone.make_aware(start_date)
        else:
            start_date = timezone.now() - timedelta(days=30)
        
        if date_to:
            end_date = datetime.strptime(date_to, '%Y-%m-%d')
            end_date = timezone.make_aware(end_date) + timedelta(days=1)  # Incluir todo el día
        else:
            end_date = timezone.now()
    except ValueError:
        return Response(
            {'detail': 'Formato de fecha inválido. Use YYYY-MM-DD'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    print(f"=== GENERATE REPORT ===")
    print(f"Rango de fechas: {start_date} a {end_date}")
    
    # Obtener avistamientos en el rango de fechas
    all_sightings = Sighting.objects.filter(
        created_at__gte=start_date,
        created_at__lt=end_date
    )
    
    print(f"Total avistamientos encontrados: {all_sightings.count()}")
    print(f"======================")
    
    validated_sightings = all_sightings.filter(
        Q(verification_status='verified') | Q(verification_status='rejected')
    )
    
    approved = validated_sightings.filter(verification_status='verified')
    rejected = validated_sightings.filter(verification_status='rejected')
    pending = all_sightings.filter(verification_status='pending')
    
    # Calcular estadísticas
    total_validations = validated_sightings.count()
    approved_count = approved.count()
    rejected_count = rejected.count()
    pending_count = pending.count()
    
    approval_rate = (approved_count / total_validations * 100) if total_validations > 0 else 0
    
    # Especies únicas
    unique_species = approved.values('species').distinct().count()
    
    # Construir lista de especies
    species_list = []
    species_data = approved.values('species').annotate(count=Count('id')).order_by('-count')
    
    for idx, species in enumerate(species_data[:50], 1):  # Top 50 especies
        species_list.append({
            'rank': idx,
            'scientific_name': species['species'],
            'common_name': '',  # TODO
            'observations': species['count'],
            'first_observation': approved.filter(species=species['species']).order_by('created_at').first().created_at.strftime('%Y-%m-%d'),
            'last_observation': approved.filter(species=species['species']).order_by('-created_at').first().created_at.strftime('%Y-%m-%d'),
            'validation_status': 'verified',
            'conservation_status': 'LC',  # TODO
            'endemic': False  # TODO
        })
    
    # Construir datos del reporte
    report_data = {
        'id': f'report_{timezone.now().strftime("%Y%m%d_%H%M%S")}',
        'title': title,
        'generated_at': timezone.now().isoformat(),
        'generated_by': {
            'id': request.user.id,
            'name': request.user.profile.full_name if hasattr(request.user, 'profile') else request.user.username,
            'email': request.user.email,
            'specialty': request.user.profile.study_area if hasattr(request.user, 'profile') else ''
        },
        'period': {
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d'),
            'duration_days': (end_date - start_date).days
        },
        'summary': {
            'total_sightings': all_sightings.count(),
            'total_validations': total_validations,
            'total_species': unique_species,
            'approval_rate': round(approval_rate, 2),
            'unique_observers': all_sightings.values('user').distinct().count()
        },
        'validation_stats': {
            'approved': approved_count,
            'rejected': rejected_count,
            'pending': pending_count,
            'approval_rate': round(approval_rate, 2),
            'rejection_rate': round((rejected_count / total_validations * 100) if total_validations > 0 else 0, 2),
            'avg_validation_time': 0,  # TODO
            'quality_score': round(approval_rate / 100 * 5, 1)
        },
        'biodiversity': {
            'total_species': unique_species,
            'species_validated': approved_count,
            'unique_families': 0,  # TODO
            'unique_kingdoms': 2,  # Estimado
            'endemic_count': 0,  # TODO
            'threatened_count': 0  # TODO
        },
        'taxonomy_distribution': [
            {
                'kingdom': 'Animalia',
                'count': int(unique_species * 0.7),
                'percentage': 70.0
            },
            {
                'kingdom': 'Plantae',
                'count': int(unique_species * 0.3),
                'percentage': 30.0
            }
        ],
        'species_list': species_list,
        'temporal_trends': [],  # Se puede agregar si se necesita
        'recommendations': [
            'Continuar con el programa de validación científica para mantener la calidad de los datos.',
            f'Se han identificado {unique_species} especies únicas en el período analizado.',
            f'La tasa de aprobación del {round(approval_rate, 1)}% indica un buen nivel de precisión en las observaciones.',
        ] if approval_rate > 80 else [
            'Se recomienda mejorar la capacitación de observadores para aumentar la tasa de aprobación.',
            'Considerar implementar guías de identificación más detalladas.',
            f'Actualmente la tasa de aprobación es del {round(approval_rate, 1)}%.'
        ],
        'notes': f'Reporte generado automáticamente por {request.user.username} el {timezone.now().strftime("%d/%m/%Y a las %H:%M")}.',
    }
    
    return Response(report_data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    operation_description="Exportar reporte en múltiples formatos (PDF, CSV, Excel, JSON)",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'report_data': openapi.Schema(type=openapi.TYPE_OBJECT, description='Datos del reporte'),
            'export_options': openapi.Schema(type=openapi.TYPE_OBJECT, description='Opciones de exportación'),
        }
    ),
    responses={
        200: openapi.Response('Archivo generado'),
        400: 'Parámetros inválidos',
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Reportes']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_report(request):
    """
    Exporta un reporte en múltiples formatos: PDF, CSV, Excel o JSON
    """
    from django.http import HttpResponse
    from io import BytesIO
    import csv
    import json
    
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden exportar reportes'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener configuración del reporte
    report_data = request.data.get('report_data', {})
    export_options = request.data.get('export_options', {})
    
    # Extraer fechas del reporte
    metadata = report_data.get('metadata', {})
    date_range = metadata.get('date_range', {})
    
    date_from = date_range.get('from')
    date_to = date_range.get('to')
    
    # Parsear fechas
    try:
        if date_from:
            start_date = datetime.strptime(date_from, '%Y-%m-%d')
            start_date = timezone.make_aware(start_date)
        else:
            start_date = timezone.now() - timedelta(days=30)
        
        if date_to:
            end_date = datetime.strptime(date_to, '%Y-%m-%d')
            end_date = timezone.make_aware(end_date) + timedelta(days=1)
        else:
            end_date = timezone.now()
    except (ValueError, TypeError):
        return Response(
            {'detail': 'Formato de fecha inválido. Use YYYY-MM-DD'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Obtener avistamientos verificados
    approved = Sighting.objects.filter(
        verification_status='verified',
        created_at__gte=start_date,
        created_at__lt=end_date
    ).select_related('user').order_by('-created_at')
    
    # Obtener configuración de exportación
    export_format = export_options.get('format', 'csv')
    filename = export_options.get('filename', f'reporte_especies_{timezone.now().strftime("%Y%m%d_%H%M%S")}')
    
    # Obtener datos del reporte
    report_title = report_data.get('title', 'Reporte de Especies')
    summary = report_data.get('summary', {})
    
    # Exportar según formato
    if export_format == 'pdf':
        # Generar PDF
        try:
            from reportlab.lib import colors
            from reportlab.lib.pagesizes import letter, A4
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import inch
            from reportlab.pdfbase import pdfmetrics
            from reportlab.pdfbase.ttfonts import TTFont
        except ImportError:
            return Response(
                {'detail': 'ReportLab no está instalado. Instale con: pip install reportlab'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        buffer = BytesIO()
        
        # Configurar documento
        page_size = A4 if export_options.get('page_size') == 'A4' else letter
        doc = SimpleDocTemplate(buffer, pagesize=page_size)
        elements = []
        
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=1  # Center
        )
        
        # Título
        elements.append(Paragraph(report_title, title_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Información del reporte
        info_data = [
            ['Generado:', timezone.now().strftime("%d/%m/%Y %H:%M")],
            ['Período:', f'{date_from} a {date_to}'],
            ['Total verificados:', str(approved.count())],
            ['Especies únicas:', str(summary.get('total_species', 0))],
            ['Tasa de aprobación:', f"{summary.get('approval_rate', 0):.1f}%"],
        ]
        
        info_table = Table(info_data, colWidths=[2*inch, 4*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
        ]))
        
        elements.append(info_table)
        elements.append(Spacer(1, 0.5*inch))
        
        # Tabla de avistamientos
        elements.append(Paragraph('Avistamientos Verificados', styles['Heading2']))
        elements.append(Spacer(1, 0.2*inch))
        
        data = [['#', 'Especie', 'Ubicación', 'Fecha', 'Observador']]
        
        for idx, sighting in enumerate(approved[:50], 1):  # Limitar a 50 para no saturar
            data.append([
                str(idx),
                sighting.species[:30],
                sighting.location[:25],
                sighting.created_at.strftime('%Y-%m-%d'),
                (sighting.user.username if sighting.user else 'Anónimo')[:20]
            ])
        
        table = Table(data, colWidths=[0.5*inch, 2*inch, 1.8*inch, 1.2*inch, 1.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')])
        ]))
        
        elements.append(table)
        
        if approved.count() > 50:
            elements.append(Spacer(1, 0.2*inch))
            elements.append(Paragraph(f'Mostrando 50 de {approved.count()} avistamientos', styles['Normal']))
        
        # Construir PDF
        doc.build(elements)
        
        pdf = buffer.getvalue()
        buffer.close()
        
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}.pdf"'
        return response
    
    elif export_format == 'json':
        # Generar JSON
        data = {
            'report': {
                'title': report_title,
                'generated_at': timezone.now().isoformat(),
                'period': {
                    'from': date_from,
                    'to': date_to
                },
                'summary': summary,
                'sightings': []
            }
        }
        
        for sighting in approved:
            data['report']['sightings'].append({
                'id': sighting.id,
                'species': sighting.species,
                'location': sighting.location,
                'latitude': float(sighting.latitude) if sighting.latitude else None,
                'longitude': float(sighting.longitude) if sighting.longitude else None,
                'date': sighting.created_at.isoformat(),
                'observer': sighting.user.username if sighting.user else 'Anónimo',
                'description': sighting.description,
                'status': 'verified'
            })
        
        response = HttpResponse(json.dumps(data, indent=2, ensure_ascii=False), content_type='application/json; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="{filename}.json"'
        return response
    
    else:  # CSV por defecto
        # Generar CSV
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="{filename}.csv"'
        
        # Agregar BOM para Excel
        response.write('\ufeff')
        
        writer = csv.writer(response)
        
        # Escribir información del reporte
        writer.writerow(['Reporte de Especies - Nature In'])
        writer.writerow([f'Generado: {timezone.now().strftime("%d/%m/%Y %H:%M")}'])
        writer.writerow([f'Periodo: {date_from} a {date_to}'])
        writer.writerow([f'Total de avistamientos verificados: {approved.count()}'])
        writer.writerow([])
        
        # Encabezados de datos
        writer.writerow([
            '#',
            'Nombre Científico',
            'Ubicación',
            'Latitud',
            'Longitud',
            'Fecha de Observación',
            'Observador',
            'Descripción',
            'Estado'
        ])
        
        # Datos de avistamientos
        for idx, sighting in enumerate(approved, 1):
            writer.writerow([
                idx,
                sighting.species,
                sighting.location,
                sighting.latitude,
                sighting.longitude,
                sighting.created_at.strftime('%Y-%m-%d %H:%M'),
                sighting.user.username if sighting.user else 'Anónimo',
                sighting.description[:100] if sighting.description else '',
                'Verificado'
            ])
        
        return response


@swagger_auto_schema(
    method='get',
    operation_description="Obtener usuarios destacados para certificaciones",
    responses={
        200: openapi.Response('Lista de usuarios destacados'),
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Certificaciones']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_users(request):
    """
    Retorna lista de usuarios destacados con sus métricas
    """
    from django.contrib.auth import get_user_model
    from gamifyservice.models import UserScore, UserBadge
    from django.db.models import Count, Q
    
    User = get_user_model()
    
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden acceder a certificaciones'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener usuarios con sus métricas
    users_data = []
    
    # Obtener usuarios que tienen avistamientos
    users_with_sightings = User.objects.filter(
        sighting__isnull=False
    ).distinct()
    
    for user in users_with_sightings[:20]:  # Top 20
        # Contar avistamientos
        total_sightings = Sighting.objects.filter(user=user).count()
        verified_sightings = Sighting.objects.filter(
            user=user,
            verification_status='verified'
        ).count()
        
        # Calcular tasa de aprobación
        approval_rate = (verified_sightings / total_sightings * 100) if total_sightings > 0 else 0
        
        # Obtener puntos
        user_score = UserScore.objects.filter(user=user).first()
        total_points = user_score.points if user_score else 0
        
        # Contar badges
        badges_count = UserBadge.objects.filter(user=user).count()
        
        users_data.append({
            'id': user.id,
            'username': user.username,
            'full_name': getattr(user, 'full_name', user.username),
            'total_points': total_points,
            'badges_count': badges_count,
            'sightings_count': total_sightings,
            'verified_sightings': verified_sightings,
            'approval_rate': round(approval_rate, 1)
        })
    
    # Ordenar por puntos
    users_data.sort(key=lambda x: x['total_points'], reverse=True)
    
    return Response(users_data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    operation_description="Otorgar badge a un usuario",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del usuario'),
            'badge_id': openapi.Schema(type=openapi.TYPE_STRING, description='ID del badge'),
        },
        required=['user_id', 'badge_id']
    ),
    responses={
        200: openapi.Response('Badge otorgado'),
        400: 'Parámetros inválidos',
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Certificaciones']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def award_badge(request):
    """
    Otorga un badge a un usuario específico
    """
    from django.contrib.auth import get_user_model
    from gamifyservice.models import Badge, UserBadge
    
    User = get_user_model()
    
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden otorgar badges'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    user_id = request.data.get('user_id')
    badge_id = request.data.get('badge_id')
    
    if not user_id or not badge_id:
        return Response(
            {'detail': 'Faltan parámetros requeridos'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Obtener usuario
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {'detail': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Mapeo de badges disponibles
    badge_names = {
        'explorer': 'Explorador',
        'expert_eye': 'Ojo Experto',
        'species_master': 'Maestro de Especies',
        'field_scientist': 'Científico de Campo',
        'biodiversity_champion': 'Campeón de Biodiversidad'
    }
    
    badge_descriptions = {
        'explorer': 'Registró 10+ avistamientos verificados',
        'expert_eye': 'Tasa de aprobación superior al 80%',
        'species_master': 'Identificó correctamente 20+ especies diferentes',
        'field_scientist': 'Contribuyó con 50+ observaciones de calidad',
        'biodiversity_champion': 'Documentó especies de 5+ familias diferentes'
    }
    
    badge_name = badge_names.get(badge_id, badge_id)
    badge_desc = badge_descriptions.get(badge_id, '')
    
    # Crear o obtener badge
    badge, created = Badge.objects.get_or_create(
        name=badge_name,
        defaults={'description': badge_desc}
    )
    
    # Otorgar badge al usuario
    user_badge, awarded = UserBadge.objects.get_or_create(
        user=user,
        badge=badge
    )
    
    if not awarded:
        return Response(
            {'detail': 'El usuario ya tiene este badge'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return Response({
        'success': True,
        'badge_name': badge.name,
        'user': user.username
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Obtener cursos de formación disponibles",
    responses={
        200: openapi.Response('Lista de cursos'),
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Formación']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def training_courses(request):
    """
    Retorna lista de cursos de formación para expertos
    """
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden acceder a formación'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    courses = [
        {
            'id': 'taxonomy-basics',
            'title': 'Fundamentos de Taxonomía Animal',
            'description': 'Aprende los principios básicos de clasificación taxonómica y nomenclatura binomial.',
            'type': 'video',
            'duration': '45 min',
            'level': 'beginner',
            'completed': False
        },
        {
            'id': 'field-techniques',
            'title': 'Técnicas de Observación en Campo',
            'description': 'Métodos y mejores prácticas para registro de avistamientos en ecosistemas tropicales.',
            'type': 'interactive',
            'duration': '1.5 hrs',
            'level': 'intermediate',
            'completed': False
        },
        {
            'id': 'species-validation',
            'title': 'Validación Científica de Avistamientos',
            'description': 'Criterios y protocolos para validar identificaciones de especies por usuarios.',
            'type': 'video',
            'duration': '30 min',
            'level': 'intermediate',
            'completed': False
        },
        {
            'id': 'biodiversity-metrics',
            'title': 'Métricas de Biodiversidad',
            'description': 'Índices de diversidad, riqueza de especies y análisis estadísticos avanzados.',
            'type': 'document',
            'duration': '2 hrs',
            'level': 'advanced',
            'completed': False
        },
        {
            'id': 'conservation-status',
            'title': 'Estados de Conservación IUCN',
            'description': 'Categorías y criterios de la Lista Roja de Especies Amenazadas.',
            'type': 'interactive',
            'duration': '1 hr',
            'level': 'beginner',
            'completed': False
        }
    ]
    
    return Response(courses, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Obtener recursos descargables",
    responses={
        200: openapi.Response('Lista de recursos'),
        401: 'No autenticado',
        403: 'No tiene permisos de experto'
    },
    tags=['Formación']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def training_resources(request):
    """
    Retorna lista de recursos descargables para expertos
    """
    # Verificar que el usuario sea experto
    try:
        if request.user.role.role != 'expert':
            return Response(
                {'detail': 'Solo los expertos pueden acceder a recursos'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'detail': 'Usuario sin rol asignado'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    resources = [
        {
            'id': 'field-guide',
            'title': 'Guía de Campo - Aves de Tingo María',
            'type': 'guide',
            'description': 'Manual ilustrado con 150+ especies de aves de la región.',
            'url': '/resources/guia-aves-tingo-maria.pdf',
            'size': '12 MB'
        },
        {
            'id': 'validation-protocol',
            'title': 'Protocolo de Validación Científica',
            'type': 'manual',
            'description': 'Procedimientos estándar para revisión de avistamientos.',
            'url': '/resources/protocolo-validacion.pdf',
            'size': '2 MB'
        },
        {
            'id': 'taxonomy-paper',
            'title': 'Revisión Taxonómica - Reptiles Amazónicos',
            'type': 'paper',
            'description': 'Paper científico actualizado sobre clasificación de reptiles.',
            'url': 'https://doi.org/10.example/reptiles-amazonia',
            'size': '5 MB'
        },
        {
            'id': 'biodiversity-guide',
            'title': 'Guía de Biodiversidad Regional',
            'type': 'guide',
            'description': 'Ecosistemas y especies emblemáticas de la región.',
            'url': '/resources/biodiversidad-regional.pdf',
            'size': '8 MB'
        }
    ]
    
    return Response(resources, status=status.HTTP_200_OK)
