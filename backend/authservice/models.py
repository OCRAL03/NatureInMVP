
from django.conf import settings
from django.db import models
from django.utils import timezone
from datetime import timedelta


class UserRole(models.Model):
    ROLE_CHOICES = [
        ('student', 'Estudiante'),
        ('teacher', 'Docente'),
        ('expert', 'Experto'),
        ('admin', 'Admin'),
    ]
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='role')
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class LoginAttempt(models.Model):
    """Registro de intentos de login para prevenir ataques de fuerza bruta"""
    username = models.CharField(max_length=150)
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['username', 'timestamp']),
            models.Index(fields=['ip_address', 'timestamp']),
        ]

    @classmethod
    def is_blocked(cls, username, ip_address, max_attempts=5, window_minutes=15):
        """Verifica si un usuario/IP está bloqueado por intentos fallidos"""
        threshold = timezone.now() - timedelta(minutes=window_minutes)
        recent_failures = cls.objects.filter(
            models.Q(username=username) | models.Q(ip_address=ip_address),
            timestamp__gte=threshold,
            success=False
        ).count()
        return recent_failures >= max_attempts

    @classmethod
    def record_attempt(cls, username, ip_address, success):
        """Registra un intento de login"""
        return cls.objects.create(
            username=username,
            ip_address=ip_address,
            success=success
        )


class PasswordResetToken(models.Model):
    """Tokens de recuperación de contraseña con expiración"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)

    def is_valid(self, expiry_hours=24):
        """Verifica si el token sigue válido"""
        if self.used:
            return False
        expiry_time = self.created_at + timedelta(hours=expiry_hours)
        return timezone.now() < expiry_time