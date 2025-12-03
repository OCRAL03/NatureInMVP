from django.conf import settings
from django.db import models


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
