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


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)
    institution = models.ForeignKey('userservice.Institution', on_delete=models.SET_NULL, null=True, blank=True)
    grade = models.CharField(max_length=16, blank=True)
    section = models.CharField(max_length=8, blank=True)
    subject = models.CharField(max_length=64, blank=True)
    study_area = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
