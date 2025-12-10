from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from pathlib import Path
from .models import Sighting, Institution, Place, Message
from .serializers import SightingSerializer, InstitutionSerializer, PlaceSerializer, MessageSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def sightings(request):
    if request.method == 'POST':
        serializer = SightingSerializer(data=request.data)
        if serializer.is_valid():
            sighting = serializer.save()
            return Response(SightingSerializer(sighting).data, status=201)
        return Response(serializer.errors, status=400)

    qs = Sighting.objects.order_by('-created_at')
    return Response(SightingSerializer(qs, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def institutions(request):
    qs = Institution.objects.order_by('name')
    return Response(InstitutionSerializer(qs, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def places(request):
    qs = Place.objects.order_by('title')
    return Response(PlaceSerializer(qs, many=True).data)


message_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'recipient_id': openapi.Schema(type=openapi.TYPE_INTEGER),
        'recipient': openapi.Schema(type=openapi.TYPE_INTEGER),
        'content': openapi.Schema(type=openapi.TYPE_STRING),
    },
    required=['content']
)

@swagger_auto_schema(method='post', request_body=message_request)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def messages(request):
    user_id = getattr(getattr(request, 'user', None), 'id', None)
    if request.method == 'POST':
        payload = {'sender': user_id, 'recipient': request.data.get('recipient') or request.data.get('recipient_id'), 'content': request.data.get('content')}
        serializer = MessageSerializer(data=payload, context={'request': request})
        if serializer.is_valid():
            msg = serializer.save()
            return Response(MessageSerializer(msg).data, status=201)
        return Response(serializer.errors, status=400)
    q_with = request.GET.get('with')
    qs = Message.objects.filter(recipient_id=user_id)
    if q_with:
        qs = qs.filter(sender_id=int(q_with))
    qs = qs.order_by('-created_at')[:100]
    return Response(MessageSerializer(qs, many=True).data)
@api_view(['GET'])
@permission_classes([AllowAny])
def docs_institutions(request):
    base_dir = Path(__file__).resolve().parents[2]
    file_path = base_dir / 'docs' / 'instituciones_educativas.md'
    items = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                t = line.strip()
                if not t:
                    continue
                if t.startswith('COLEGIO') or t.startswith('COLEGIO') or 'SECUNDARIO' in t or 'Amazonas' in t or 'Galileo' in t:
                    name = t.replace(':', '').strip()
                    items.append({'name': name})
                elif t.startswith('Dirección:'):
                    addr = t.split('Dirección:')[-1].strip()
                    if items:
                        items[-1]['address'] = addr
                elif t.startswith('Teléfono:'):
                    phone = t.split('Teléfono:')[-1].strip()
                    if items:
                        items[-1]['phone'] = phone
    except Exception:
        pass
    for it in items:
        it.setdefault('type', 'Mixto')
    return Response(items)


@api_view(['GET'])
@permission_classes([AllowAny])
def docs_places(request):
    base_dir = Path(__file__).resolve().parents[2]
    file_path = base_dir / 'docs' / 'lugares_turiscos.md'
    items = []
    current = None
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                t = line.strip()
                if not t:
                    continue
                # Title lines are numbered like '1. Parque Nacional Tingo María (PNTM)'
                if t[0].isdigit() and '.' in t[:3]:
                    title = t.split('.', 1)[1].strip()
                    current = {'title': title}
                    items.append(current)
                elif t.startswith('Ubicación'):
                    # next line contains actual location
                    # handled by subsequent iterations
                    pass
                elif current and ('Distrito' in t or 'Caserío' in t or 'Campus' in t or 'Cerro' in t or 'Carretera' in t or 'Sector' in t or 'Zona' in t or 'Plaza de Armas' in t or 'Huallaga' in t or 'UNAS' in t):
                    current.setdefault('location', t)
                elif current and t.startswith('Descripción del Lugar'):
                    pass
                elif current and not any(t.startswith(prefix) for prefix in ['Horarios', 'Recomendaciones', 'Flora', 'Fauna']):
                    # first free text after title becomes description
                    if 'description' not in current and len(t) > 15:
                        current['description'] = t
    except Exception:
        pass
    return Response(items)
