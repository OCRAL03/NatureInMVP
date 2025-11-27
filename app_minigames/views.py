from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from .models import Juego, ExternalTool
import logging
import uuid
from oauthlib.oauth1 import Client, SIGNATURE_TYPE_BODY
from urllib.parse import parse_qs, urlencode

logger = logging.getLogger(__name__)

def games_view(request):
    juegos = Juego.objects.all().order_by('-created')
    return render(request, 'games/base.html', {'juegos': juegos})

def launch_educaplay(request, juego_id, tool_id):
    juego = get_object_or_404(Juego, pk=juego_id)
    tool = get_object_or_404(ExternalTool, pk=tool_id)

    params = {
        'lti_message_type': 'basic-lti-launch-request',
        'lti_version': 'LTI-1p0',
        'resource_link_id': f'game-{juego.id}',
        'user_id': str(request.user.id) if request.user.is_authenticated else str(uuid.uuid4()),
        'roles': 'Learner' if not getattr(request.user, 'is_staff', False) else 'Instructor',
        'context_id': 'course-1',
        'context_title': 'NatureIn Course',
        'launch_presentation_locale': 'es',
        'tool_consumer_instance_guid': request.get_host(),
        'launch_presentation_return_url': request.build_absolute_uri('/'),
        'lis_person_contact_email_primary': getattr(request.user, 'email', ''),
        'ext_lti_resource_id': str(juego.id),
    }

    client = Client(
        client_key=tool.consumer_key,
        client_secret=tool.shared_secret or '',
        signature_type=SIGNATURE_TYPE_BODY,
    )

    body_str = urlencode(params)
    sign_headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'}

    uri, headers, body = client.sign(
        tool.launch_url,
        http_method='POST',
        body=body_str,
        headers=sign_headers
    )

    # oauthlib puede devolver bytes
    if isinstance(body, bytes):
        body = body.decode()

    form_params = {k: v[0] for k, v in parse_qs(body).items()}

    # render template que envía el form desde el navegador (sin CSRF token)
    return render(request, '../templates/games/lti_launch_form.html', {
        'launch_url': tool.launch_url,
        'form_params': form_params,
        'juego': juego,
    })


# Ejemplo simple para enviar nota via Outcomes (LTI 1.1)
import requests
from xml.etree import ElementTree as ET

def send_grade_to_outcome(consumer_key, shared_secret, outcome_url, sourcedid, score):
    """
    outcome_url: lis_outcome_service_url (string)
    sourcedid: lis_result_sourcedid (string)
    score: float 0..1
    """
    # Construir XML según LTI 1.1 outcomes spec
    envelope = f"""
    <?xml version = "1.0" encoding = "UTF-8"?>
    <imsx_POXEnvelopeRequest xmlns = "http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
      <imsx_POXHeader>
        <imsx_POXRequestHeaderInfo>
          <imsx_version>V1.0</imsx_version>
          <imsx_messageIdentifier>{uuid.uuid4()}</imsx_messageIdentifier>
        </imsx_POXRequestHeaderInfo>
      </imsx_POXHeader>
      <imsx_POXBody>
        <replaceResultRequest>
          <resultRecord>
            <sourcedGUID>
              <sourcedId>{sourcedid}</sourcedId>
            </sourcedGUID>
            <result>
              <resultScore>
                <language>en</language>
                <textString>{score}</textString>
              </resultScore>
            </result>
          </resultRecord>
        </replaceResultRequest>
      </imsx_POXBody>
    </imsx_POXEnvelopeRequest>
    """

    # OAuth1 sign the POST (body)
    client = Client(
        client_key=consumer_key,
        client_secret=shared_secret,
        signature_type=SIGNATURE_TYPE_BODY,
    )
    uri, headers, body = client.sign(outcome_url, http_method='POST', body=envelope, headers={'Content-Type': 'application/xml'})
    resp = requests.post(uri, data=body, headers=headers, timeout=10)
    return resp