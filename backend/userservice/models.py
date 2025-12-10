from django.conf import settings
from django.db import models


class Institution(models.Model):
    """Modelo para instituciones educativas"""
    name = models.CharField(max_length=200, unique=True)
    type = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=300, blank=True)
    phone = models.CharField(max_length=32, blank=True)

    class Meta:
        verbose_name = "Institución"
        verbose_name_plural = "Instituciones"

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    """
    Perfil extendido de usuario con información académica/profesional
    según el rol del usuario (estudiante, docente, experto)
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    full_name = models.CharField(max_length=255, blank=True, verbose_name="Nombre Completo")

    # Campos comunes
    institution = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name="Institución Educativa"
    )

    # Campos específicos para estudiantes
    grade = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Grado"
    )
    section = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        verbose_name="Sección"
    )

    # Campos específicos para docentes
    subject = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Materia/Curso"
    )

    # Campos específicos para expertos
    study_area = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Área de Especialidad"
    )

    # Campos adicionales
    bio = models.TextField(blank=True, verbose_name="Biografía")
    avatar_url = models.URLField(blank=True, null=True, verbose_name="URL del Avatar")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Teléfono")

    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuarios"
        ordering = ['-created_at']

    def __str__(self):
        return f"Perfil de {self.user.username} - {self.full_name}"

    def get_role_specific_info(self):
        """Retorna información específica según el rol del usuario"""
        role = getattr(getattr(self.user, 'role', None), 'role', 'student')

        if role == 'student':
            return {
                'institution': self.institution,
                'grade': self.grade,
                'section': self.section
            }
        elif role == 'teacher':
            return {
                'institution': self.institution,
                'subject': self.subject
            }
        elif role == 'expert':
            return {
                'study_area': self.study_area
            }
        return {}


class Sighting(models.Model):
    """
    Avistamiento de especies registrado por usuarios
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sightings',
        verbose_name="Usuario",
        null=True,
        blank=True
    )
    species = models.CharField(max_length=120, verbose_name="Especie")
    location = models.CharField(max_length=200, verbose_name="Ubicación")
    description = models.TextField(blank=True, verbose_name="Descripción")

    # Coordenadas geográficas
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        verbose_name="Latitud"
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        verbose_name="Longitud"
    )

    # Imagen del avistamiento
    image_url = models.URLField(blank=True, null=True, verbose_name="URL de Imagen")

    # Estado de verificación
    VERIFICATION_STATUS = [
        ('pending', 'Pendiente'),
        ('verified', 'Verificado'),
        ('rejected', 'Rechazado'),
    ]
    verification_status = models.CharField(
        max_length=20,
        choices=VERIFICATION_STATUS,
        default='pending',
        verbose_name="Estado de Verificación"
    )

    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Avistamiento"
        verbose_name_plural = "Avistamientos"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['verification_status']),
        ]

    def __str__(self):
        return f"{self.species} @ {self.location} por {self.user.username}"


class UserActivity(models.Model):
    """
    Registro de actividad del usuario para métricas y estadísticas
    """
    ACTIVITY_TYPES = [
        ('login', 'Inicio de Sesión'),
        ('sighting', 'Avistamiento Registrado'),
        ('content_view', 'Contenido Visto'),
        ('badge_earned', 'Insignia Ganada'),
        ('profile_update', 'Perfil Actualizado'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='activities'
    )
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Actividad de Usuario"
        verbose_name_plural = "Actividades de Usuarios"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['activity_type', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.get_activity_type_display()}"