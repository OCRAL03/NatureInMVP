from django.db import models

class Roles(models.Model):
    nombre_rol = models.CharField(max_length=50, unique=True)
