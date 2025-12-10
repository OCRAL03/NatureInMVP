import base64
import hashlib
import hmac
import time
from urllib.parse import quote, urlencode

from django.conf import settings
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from django.contrib.auth import get_user_model
from .models import Point, Badge, UserBadge, UserScore, Rank, BadgeDefinition, Mission, UserProgress, activity_completed

User = get_user_model()

def _update_user_score(user, points_to_add):
    """
    Helper para actualizar el puntaje y rango de un usuario de forma centralizada.
    """
    if not points_to_add:
        return None, None

    Point.objects.create(user=user, value=points_to_add)
    score, _ = UserScore.objects.get_or_create(user=user)
    score.points = int(score.points or 0) + points_to_add
    candidate_rank = Rank.objects.filter(min_points__lte=score.points).order_by('-min_points').first()
    if candidate_rank:
        score.rank = candidate_rank
    score.save()
    return score.points, getattr(score.rank, 'name', None)

award_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
        'actividad_id': openapi.Schema(type=openapi.TYPE_INTEGER),
        'puntos': openapi.Schema(type=openapi.TYPE_INTEGER),
        'badge_code': openapi.Schema(type=openapi.TYPE_STRING),
    },
)
award_response = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'awarded_points': openapi.Schema(type=openapi.TYPE_INTEGER),
        'new_total': openapi.Schema(type=openapi.TYPE_INTEGER),
        'rank': openapi.Schema(type=openapi.TYPE_STRING),
        'awarded_badge': openapi.Schema(type=openapi.TYPE_STRING),
    },
)


@swagger_auto_schema(method='post', request_body=award_request, responses={200: award_response})
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def award(request):
    uid = request.data.get('user_id')
    user = request.user if not uid else User.objects.filter(id=uid).first() or request.user
    puntos = int(request.data.get('puntos', 0))
    actividad_id = request.data.get('actividad_id')
    badge_code = request.data.get('badge_code')
    new_total = None
    current_rank = None
    awarded_badge = None

    new_total, current_rank = _update_user_score(user, puntos)

    if badge_code:
        defn = BadgeDefinition.objects.filter(code=badge_code).first()
        name = defn.name if defn else badge_code
        badge, _ = Badge.objects.get_or_create(name=name, defaults={'description': defn.description if defn else ''})
        UserBadge.objects.get_or_create(user=user, badge=badge)
        awarded_badge = badge.name
    else:
        score = UserScore.objects.filter(user=user).first()
        if score:
            for defn in BadgeDefinition.objects.all():
                if score.points >= defn.threshold_points:
                    badge, _ = Badge.objects.get_or_create(name=defn.name, defaults={'description': defn.description})
                    UserBadge.objects.get_or_create(user=user, badge=badge)

    return Response({'awarded_points': puntos, 'new_total': new_total, 'rank': current_rank, 'awarded_badge': awarded_badge})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def metrics(request):
    user = request.user
    total_points = sum(p.value for p in Point.objects.filter(user=user))
    badges = list(UserBadge.objects.filter(user=user).values_list('badge__name', flat=True))
    return Response({'total_points': total_points, 'badges': badges})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ranking(request):
    qs = UserScore.objects.select_related('rank').order_by('-points')[:50]
    data = [{'user_id': s.user_id, 'puntos': s.points, 'rango': (s.rank.name if s.rank else None)} for s in qs]
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def badges_me(request):
    names = list(UserBadge.objects.filter(user=request.user).values_list('badge__name', flat=True))
    return Response({'badges': names})


missions_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'mission_id': openapi.Schema(type=openapi.TYPE_INTEGER),
        'progress': openapi.Schema(type=openapi.TYPE_INTEGER),
        'completed': openapi.Schema(type=openapi.TYPE_BOOLEAN),
    },
)

@swagger_auto_schema(method='post', request_body=missions_request)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def missions_progress(request):
    mission_id = request.data.get('mission_id')
    progress = int(request.data.get('progress', 0))
    completed = bool(request.data.get('completed', False))
    mission = Mission.objects.filter(id=mission_id).first()
    if not mission:
        return Response({'detail': 'mission not found'}, status=404)
    up, _ = UserProgress.objects.get_or_create(user=request.user, mission=mission)
    up.progress = progress
    up.completed = completed
    up.save()
    if completed and mission.reward_points:
        _update_user_score(request.user, mission.reward_points)
    return Response({'mission_id': mission_id, 'progress': progress, 'completed': completed})


def _oauth_signature(method, url, params, consumer_secret):
    base_elems = [method.upper(), quote(url, safe=''), quote(urlencode(sorted(params.items())), safe='')]
    base_str = '&'.join(base_elems)
    key = f"{consumer_secret}&".encode()
    sig = hmac.new(key, base_str.encode(), hashlib.sha1).digest()
    return base64.b64encode(sig).decode()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def lti_launch(request):
    launch_url = request.data.get('launch_url') or getattr(settings, 'LTI_LAUNCH_URL', None)
    consumer_key = request.data.get('consumer_key') or getattr(settings, 'LTI_CONSUMER_KEY', None)
    shared_secret = request.data.get('shared_secret') or getattr(settings, 'LTI_SHARED_SECRET', None)
    if not (launch_url and consumer_key and shared_secret):
        return Response({'detail': 'LTI configuración incompleta'}, status=400)

    # Minimal LTI 1.1 params
    oauth_nonce = str(int(time.time() * 1000))
    oauth_timestamp = str(int(time.time()))
    params = {
        'lti_version': 'LTI-1p0',
        'lti_message_type': 'basic-lti-launch-request',
        'resource_link_id': 'naturein-activity',
        'user_id': str(request.user.id),
        'roles': getattr(getattr(request.user, 'role', None), 'role', 'student'),
        'launch_presentation_locale': 'es-ES',
        'oauth_consumer_key': consumer_key,
        'oauth_nonce': oauth_nonce,
        'oauth_timestamp': oauth_timestamp,
        'oauth_callback': 'about:blank',
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_version': '1.0',
    }
    signature = _oauth_signature('POST', launch_url, params, shared_secret)
    params['oauth_signature'] = signature
    return Response({'launch_url': launch_url, 'params': params})
