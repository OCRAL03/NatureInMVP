from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'Credenciales incompletas'}, status=400)
    # Stub token for prototype
    return Response({'token': 'fake-token-for-' + username})


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
