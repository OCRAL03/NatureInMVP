from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Sighting
from .serializers import SightingSerializer


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
