from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from typing import Optional

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer para JWT con información adicional del usuario"""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Agregar claims personalizados
        role = getattr(getattr(user, 'role', None), 'role', 'student')
        token['role'] = role
        token['username'] = user.username
        token['email'] = user.email
        token['user_id'] = user.id
        return token


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer para cambio de contraseña"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({"new_password_confirm": "Las contraseñas no coinciden"})

        # Validar fuerza de la nueva contraseña
        try:
            validate_password(data['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})

        return data

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Contraseña actual incorrecta")
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    """Solicitud de reset de contraseña"""
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Confirmación de reset de contraseña"""
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({"new_password_confirm": "Las contraseñas no coinciden"})

        try:
            validate_password(data['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})

        return data


class EmailVerificationRequestSerializer(serializers.Serializer):
    """Solicitud de envío de código de verificación por email"""
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    def validate(self, data):
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        if not username and not email:
            raise serializers.ValidationError({'detail': 'Debe proporcionar username o email'})
        try:
            user = None
            if username:
                user = User.objects.get(username=username)
            else:
                user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Respuesta genérica, no revelar existencia
            pass
        return data


class EmailVerificationConfirmSerializer(serializers.Serializer):
    """Confirmación del código de verificación de email"""
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    code = serializers.CharField(required=True)  # 6 dígitos

    def validate(self, data):
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        code = data.get('code', '').strip()
        if not username and not email:
            raise serializers.ValidationError({'detail': 'Debe proporcionar username o email'})
        if not code.isdigit() or len(code) != 6:
            raise serializers.ValidationError({'code': 'El código debe ser numérico de 6 dígitos'})
        return data
