from django.contrib.auth.models import AbstractUser
from django.db import models

class UsuarioPersonalizado(AbstractUser):
    ROLE_CHOICES = (
        ('student','Estudiante'),
        ('teacher','Docente'),
        ('parent','Padre'),
        ('pro','Profesional Ambiental'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    fecha_nacimiento = models.DateField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    nombres = models.CharField(max_length=100, blank=True, null=True)
    apellido_paterno = models.CharField(max_length=50, blank=True, null=True)
    apellido_materno = models.CharField(max_length=50, blank=True, null=True)
    rol = models.ForeignKey('app_users.Roles', on_delete=models.SET_NULL, null=True, blank=True)
    nivel_educativo = models.ForeignKey('app_education.NivelEducativo', on_delete=models.SET_NULL, null=True, blank=True)
    grado_educativo = models.ForeignKey('app_education.GradoDeNivelEducativo', on_delete=models.SET_NULL, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True, null=True, blank=True)

# Create your models here.
