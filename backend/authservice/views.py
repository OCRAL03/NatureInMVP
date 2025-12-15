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
    PasswordResetConfirmSerializer,
    EmailVerificationRequestSerializer,
    EmailVerificationConfirmSerializer
)
from .models import LoginAttempt, PasswordResetToken, EmailVerificationCode, SuspiciousActivity
from django.conf import settings
from django.utils import timezone
from cryptography.fernet import Fernet
import hashlib
import secrets as py_secrets


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
            try:
                user = User.objects.get(username=username)
                SuspiciousActivity.objects.create(
                    user=user,
                    ip_address=ip_address,
                    event='login_bruteforce_blocked',
                    metadata={'username': username}
                )
            except User.DoesNotExist:
                SuspiciousActivity.objects.create(
                    user=None,
                    ip_address=ip_address,
                    event='login_bruteforce_blocked',
                    metadata={'username': username}
                )
            return Response({
                'detail': 'Demasiados intentos fallidos. Intenta nuevamente en 15 minutos.'
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # Intentar autenticación
        response = super().post(request, *args, **kwargs)

        # Registrar el intento preliminar
        success = response.status_code == 200

        # Si autenticó pero email no verificado, bloquear login
        if success:
            try:
                user = User.objects.get(username=username)
                email_verified = getattr(getattr(user, 'profile', None), 'email_verified', False)
                if not email_verified:
                    SuspiciousActivity.objects.create(
                        user=user,
                        ip_address=ip_address,
                        event='login_unverified_email',
                        metadata={'username': username}
                    )
                    LoginAttempt.record_attempt(username, ip_address, False)
                    return Response({
                        'detail': 'Correo no verificado. Completa la verificación para iniciar sesión.',
                        'code': 'email_unverified'
                    }, status=status.HTTP_403_FORBIDDEN)
            except User.DoesNotExist:
                pass

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
            # Solo permitir si correo verificado
            email_verified = getattr(getattr(user, 'profile', None), 'email_verified', False)
            if not email_verified:
                return Response({
                    'message': 'Si el email existe y está verificado, recibirás un enlace de recuperación'
                }, status=status.HTTP_200_OK)

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


def _send_email(to_email: str, subject: str, body: str):
    """Enviar email utilizando configuración de Django; en desarrollo, registrar actividad"""
    try:
        from django.core.mail import send_mail
        default_from = getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@naturein.local')
        send_mail(subject, body, default_from, [to_email], fail_silently=True)
    except Exception:
        pass


def _hash_code(code: str, salt: str) -> str:
    return hashlib.sha256(f'{code}:{salt}'.encode()).hexdigest()


def _generate_code() -> str:
    return f'{py_secrets.randbelow(900000)+100000}'


@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    return Response({'status': 'ok'})


@swagger_auto_schema(
    method='post',
    operation_description="Solicitar código de verificación de email (expira en 15 minutos).",
    request_body=EmailVerificationRequestSerializer,
    responses={
        200: openapi.Response('Código enviado si el usuario existe', examples={
            'application/json': {'message': 'Si existe el usuario, se envió un código de verificación'}
        }),
        400: 'Datos inválidos'
    },
    tags=['Autenticación']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def email_verification_request(request):
    serializer = EmailVerificationRequestSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data.get('username', '').strip()
        email = serializer.validated_data.get('email', '').strip()
        user = None
        if username:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                pass
        elif email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                pass
        if user:
            # Generar código y guardar hash
            code = _generate_code()
            salt = py_secrets.token_hex(8)
            code_hash = _hash_code(code, salt)
            EmailVerificationCode.objects.create(
                user=user,
                code_hash=code_hash,
                salt=salt
            )
            # Enviar email
            to_email = user.email
            subject = 'Tu código de verificación de NatureIn'
            body = f'Tu código de verificación es: {code}. Expira en 15 minutos.'
            _send_email(to_email, subject, body)
        resp = {'message': 'Si existe el usuario, se envió un código de verificación'}
        if settings.DEBUG and user:
            resp['dev_code'] = code
        return Response(resp, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    operation_description="Confirmar el código de verificación de email (máximo 3 intentos).",
    request_body=EmailVerificationConfirmSerializer,
    responses={
        200: openapi.Response('Email verificado', examples={'application/json': {'message': 'Email verificado exitosamente'}}),
        400: 'Código inválido',
        403: 'Límite de intentos alcanzado o código expirado'
    },
    tags=['Autenticación']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def email_verification_confirm(request):
    serializer = EmailVerificationConfirmSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data.get('username', '').strip()
        email = serializer.validated_data.get('email', '').strip()
        code = serializer.validated_data['code']
        ip_address = get_client_ip(request)
        user = None
        try:
            user = User.objects.get(username=username) if username else User.objects.get(email=email)
        except User.DoesNotExist:
            pass
        if not user:
            return Response({'detail': 'Código inválido'}, status=status.HTTP_400_BAD_REQUEST)
        # Obtener el último código activo
        ev = EmailVerificationCode.objects.filter(user=user, used=False).order_by('-created_at').first()
        if not ev or not ev.is_valid(expiry_minutes=15):
            SuspiciousActivity.objects.create(user=user, ip_address=ip_address, event='email_code_invalid_or_expired', metadata={})
            return Response({'detail': 'Código expirado o inválido'}, status=status.HTTP_403_FORBIDDEN)
        # Validar hash
        if _hash_code(code, ev.salt) == ev.code_hash:
            ev.register_attempt(True)
            # Marcar perfil como verificado
            try:
                profile = user.profile
            except Exception:
                from userservice.models import UserProfile
                profile = UserProfile.objects.create(user=user)
            profile.email_verified = True
            profile.email_verified_at = timezone.now()
            profile.save(update_fields=['email_verified', 'email_verified_at'])
            return Response({'message': 'Email verificado exitosamente'}, status=status.HTTP_200_OK)
        else:
            ev.register_attempt(False)
            if ev.attempts >= ev.max_attempts:
                SuspiciousActivity.objects.create(user=user, ip_address=ip_address, event='email_code_max_attempts', metadata={'attempts': ev.attempts})
                return Response({'detail': 'Límite de intentos alcanzado'}, status=status.HTTP_403_FORBIDDEN)
            return Response({'detail': 'Código incorrecto'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    operation_description="Reenviar el código de verificación al email registrado.",
    request_body=EmailVerificationRequestSerializer,
    responses={200: 'Código reenviado si el usuario existe'},
    tags=['Autenticación']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def email_verification_resend(request):
    return email_verification_request(request)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout (para invalidar refresh tokens si es necesario)"""
    # Con JWT, el logout se maneja principalmente en el cliente
    # eliminando los tokens del localStorage
    return Response({'message': 'Logout exitoso'}, status=status.HTTP_200_OK)
