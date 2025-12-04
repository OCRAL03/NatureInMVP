from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers

from authservice.models import UserRole
from .models import Sighting, UserProfile, UserActivity


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer para el perfil de usuario"""

    class Meta:
        model = UserProfile
        fields = [
            'full_name',
            'institution',
            'grade',
            'section',
            'subject',
            'study_area',
            'bio',
            'avatar_url',
            'phone',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """Serializer básico de usuario"""
    role = serializers.SerializerMethodField()
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile', 'date_joined']
        read_only_fields = ['id', 'date_joined']

    def get_role(self, obj):
        return getattr(getattr(obj, 'role', None), 'role', 'student')


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer para registro de nuevos usuarios
    Maneja la creación atómica de User + UserRole + UserProfile
    """
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    # Campos del perfil
    full_name = serializers.CharField(required=True)
    institution = serializers.CharField(required=False, allow_blank=True)
    grade = serializers.CharField(required=False, allow_blank=True)
    section = serializers.CharField(required=False, allow_blank=True)
    subject = serializers.CharField(required=False, allow_blank=True)
    study_area = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    # Rol del usuario
    role = serializers.ChoiceField(
        choices=['estudiante', 'docente', 'experto'],
        required=True
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password_confirm',
            'role',
            'full_name',
            'institution',
            'grade',
            'section',
            'subject',
            'study_area',
            'bio',
            'phone'
        ]

    def validate_username(self, value):
        """Validar que el username no exista"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso")
        return value

    def validate_email(self, value):
        """Validar que el email no exista"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado")
        return value

    def validate(self, data):
        """Validaciones cruzadas"""
        # Verificar que las contraseñas coincidan
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                "password_confirm": "Las contraseñas no coinciden"
            })

        # Validar fortaleza de la contraseña
        try:
            validate_password(data['password'])
        except DjangoValidationError as e:
            raise serializers.ValidationError({
                "password": list(e.messages)
            })

        # Validar campos específicos según el rol
        role = data.get('role')
        if role == 'estudiante':
            if not data.get('grade') or not data.get('section'):
                raise serializers.ValidationError({
                    "role": "Los estudiantes deben especificar grado y sección"
                })
        elif role == 'docente':
            if not data.get('subject'):
                raise serializers.ValidationError({
                    "role": "Los docentes deben especificar su materia/curso"
                })
        elif role == 'experto':
            if not data.get('study_area'):
                raise serializers.ValidationError({
                    "role": "Los expertos deben especificar su área de especialidad"
                })

        return data

    def create(self, validated_data):
        """Creación atómica de Usuario + Rol + Perfil"""
        # Extraer datos que no pertenecen al modelo User
        password = validated_data.pop('password')
        validated_data.pop('password_confirm')

        profile_data = {
            'full_name': validated_data.pop('full_name'),
            'institution': validated_data.pop('institution', ''),
            'grade': validated_data.pop('grade', ''),
            'section': validated_data.pop('section', ''),
            'subject': validated_data.pop('subject', ''),
            'study_area': validated_data.pop('study_area', ''),
            'bio': validated_data.pop('bio', ''),
            'phone': validated_data.pop('phone', ''),
        }

        role_name = validated_data.pop('role')

        # Mapeo de roles del frontend al backend
        role_map = {
            'estudiante': 'student',
            'docente': 'teacher',
            'experto': 'expert'
        }
        normalized_role = role_map.get(role_name, 'student')

        # Transacción atómica
        with transaction.atomic():
            # 1. Crear usuario base
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data.get('email', ''),
                password=password
            )

            # 2. Asignar rol
            UserRole.objects.create(user=user, role=normalized_role)

            # 3. Crear perfil extendido
            UserProfile.objects.create(user=user, **profile_data)

            # 4. Registrar actividad
            UserActivity.objects.create(
                user=user,
                activity_type='profile_update',
                description='Usuario registrado'
            )

        return user


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualización de perfil"""

    class Meta:
        model = UserProfile
        fields = [
            'full_name',
            'institution',
            'grade',
            'section',
            'subject',
            'study_area',
            'bio',
            'avatar_url',
            'phone'
        ]

    def update(self, instance, validated_data):
        """Actualizar perfil y registrar actividad"""
        profile = super().update(instance, validated_data)

        # Registrar actividad
        UserActivity.objects.create(
            user=profile.user,
            activity_type='profile_update',
            description='Perfil actualizado'
        )

        return profile


class SightingSerializer(serializers.ModelSerializer):
    """Serializer para avistamientos"""
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_full_name = serializers.CharField(source='user.profile.full_name', read_only=True)

    class Meta:
        model = Sighting
        fields = [
            'id',
            'user',
            'user_username',
            'user_full_name',
            'species',
            'location',
            'description',
            'latitude',
            'longitude',
            'image_url',
            'verification_status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'user', 'verification_status', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Crear avistamiento y registrar actividad"""
        sighting = super().create(validated_data)

        # Registrar actividad
        UserActivity.objects.create(
            user=sighting.user,
            activity_type='sighting',
            description=f'Avistamiento de {sighting.species} en {sighting.location}',
            metadata={
                'sighting_id': sighting.id,
                'species': sighting.species,
                'location': sighting.location
            }
        )

        return sighting


class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer para actividades de usuario"""
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)

    class Meta:
        model = UserActivity
        fields = ['id', 'activity_type', 'activity_type_display', 'description', 'metadata', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserStatsSerializer(serializers.Serializer):
    """Serializer para estadísticas de usuario"""
    total_sightings = serializers.IntegerField()
    verified_sightings = serializers.IntegerField()
    pending_sightings = serializers.IntegerField()
    total_activities = serializers.IntegerField()
    recent_activities = UserActivitySerializer(many=True)