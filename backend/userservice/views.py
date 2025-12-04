from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Sighting, Institution
from .serializers import SightingSerializer, InstitutionSerializer


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
