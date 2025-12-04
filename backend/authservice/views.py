from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomTokenObtainPairSerializer
from .models import UserRole, UserProfile
from userservice.models import Institution


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'Credenciales incompletas'}, status=400)
    # Preferir SimpleJWT: delegar a /api/auth/token/
    return Response({'detail': 'Usa /api/auth/token/ para obtener JWT'}, status=400)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    User = get_user_model()
    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role') or 'student'
    full_name = request.data.get('fullName') or request.data.get('full_name') or ''
    email = request.data.get('email') or ''
    institution_name = request.data.get('institution') or ''
    grade = request.data.get('grade') or ''
    section = request.data.get('section') or ''
    subject = request.data.get('subject') or ''
    study_area = request.data.get('studyArea') or request.data.get('study_area') or ''
    if not username or not password:
        return Response({'detail': 'username y password requeridos'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'detail': 'usuario ya existe'}, status=400)
    user = User.objects.create_user(username=username, password=password)
    if email:
        user.email = email
        user.save(update_fields=['email'])
    UserRole.objects.get_or_create(user=user, defaults={'role': role})
    inst = None
    if institution_name:
        inst = Institution.objects.filter(name=institution_name).first()
    UserProfile.objects.get_or_create(
        user=user,
        defaults={
            'full_name': full_name,
            'email': email,
            'institution': inst,
            'grade': grade,
            'section': section,
            'subject': subject,
            'study_area': study_area,
        }
    )
    refresh = RefreshToken.for_user(user)
    return Response({'access': str(refresh.access_token), 'refresh': str(refresh), 'username': user.username, 'role': role}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    role = getattr(getattr(user, 'role', None), 'role', None)
    profile = getattr(user, 'profile', None)
    data = {
        'username': user.username,
        'email': getattr(user, 'email', ''),
        'role': role or 'student',
        'profile': {
            'full_name': getattr(profile, 'full_name', ''),
            'email': getattr(profile, 'email', ''),
            'institution': getattr(getattr(profile, 'institution', None), 'name', None),
            'grade': getattr(profile, 'grade', ''),
            'section': getattr(profile, 'section', ''),
            'subject': getattr(profile, 'subject', ''),
            'study_area': getattr(profile, 'study_area', ''),
        }
    }
    return Response(data)
