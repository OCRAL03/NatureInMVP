import secrets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import (
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)
from .models import LoginAttempt, PasswordResetToken


def get_client_ip(request):
    """Obtiene la IP real del cliente"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para obtención de tokens JWT.
    
    Incluye protección contra ataques de fuerza bruta mediante registro
    de intentos fallidos de login por usuario e IP.
    """
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', '')
        ip_address = get_client_ip(request)

        # Verificar si está bloqueado por intentos fallidos
        if LoginAttempt.is_blocked(username, ip_address):
            return Response({
                'detail': 'Demasiados intentos fallidos. Intenta nuevamente en 15 minutos.'
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # Intentar autenticación
        response = super().post(request, *args, **kwargs)

        # Registrar el intento
        success = response.status_code == 200
        LoginAttempt.record_attempt(username, ip_address, success)

        return response


@swagger_auto_schema(
    method='post',
    operation_description="Cambiar la contraseña del usuario autenticado",
    request_body=ChangePasswordSerializer,
    responses={
        200: openapi.Response('Contraseña actualizada exitosamente', examples={
            'application/json': {'message': 'Contraseña actualizada exitosamente'}
        }),
        400: 'Datos inválidos',
        401: 'No autenticado'
    },
    tags=['Autenticación']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Cambio de contraseña para usuarios autenticados"""
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({
            'message': 'Contraseña actualizada exitosamente'
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    operation_description="Solicitar recuperación de contraseña mediante email",
    request_body=PasswordResetRequestSerializer,
    responses={
        200: openapi.Response('Email de recuperación enviado', examples={
            'application/json': {'message': 'Si el email existe, recibirás un enlace de recuperación'}
        }),
        400: 'Datos inválidos'
    },
    tags=['Autenticación']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """Solicitud de recuperación de contraseña"""
    serializer = PasswordResetRequestSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)

            # Generar token seguro
            token = secrets.token_urlsafe(32)
            PasswordResetToken.objects.create(user=user, token=token)

            # TODO: Enviar email con el token
            # send_password_reset_email(user.email, token)

            # Por ahora, devolver token en respuesta (solo para desarrollo)
            return Response({
                'message': 'Si el email existe, recibirás un enlace de recuperación',
                'reset_token': token  # Eliminar en producción
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            pass

        # Respuesta genérica para no revelar si el email existe
        return Response({
            'message': 'Si el email existe, recibirás un enlace de recuperación'
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """Confirmación de reset de contraseña con token"""
    serializer = PasswordResetConfirmSerializer(data=request.data)

    if serializer.is_valid():
        token_str = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            token_obj = PasswordResetToken.objects.get(token=token_str)

            if not token_obj.is_valid():
                return Response({
                    'detail': 'Token expirado o ya utilizado'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Actualizar contraseña
            user = token_obj.user
            user.set_password(new_password)
            user.save()

            # Marcar token como usado
            token_obj.used = True
            token_obj.save()

            return Response({
                'message': 'Contraseña actualizada exitosamente'
            }, status=status.HTTP_200_OK)

        except PasswordResetToken.DoesNotExist:
            return Response({
                'detail': 'Token inválido'
            }, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout (para invalidar refresh tokens si es necesario)"""
    # Con JWT, el logout se maneja principalmente en el cliente
    # eliminando los tokens del localStorage
    return Response({'message': 'Logout exitoso'}, status=status.HTTP_200_OK)