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

from .models import Point, Badge, UserBadge


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def award(request):
    user = request.user
    points = int(request.data.get('points', 0))
    badge_name = request.data.get('badge_name')
    if points:
        Point.objects.create(user=user, value=points)
    awarded_badge = None
    if badge_name:
        badge, _ = Badge.objects.get_or_create(name=badge_name)
        UserBadge.objects.get_or_create(user=user, badge=badge)
        awarded_badge = badge.name
    return Response({'awarded_points': points, 'awarded_badge': awarded_badge})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def metrics(request):
    user = request.user
    total_points = sum(p.value for p in Point.objects.filter(user=user))
    badges = list(UserBadge.objects.filter(user=user).values_list('badge__name', flat=True))
    return Response({'total_points': total_points, 'badges': badges})


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
