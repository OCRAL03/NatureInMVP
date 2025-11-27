from django.db import models
from django.conf import settings

class Distrito(models.Model):
    distrito = models.CharField(max_length=20)

class Avistamientos(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    especie = models.ForeignKey('app_taxonomy.Especies', on_delete=models.CASCADE)
    fecha_avistamiento = models.DateField()
    comentario = models.CharField(max_length=200)
    latitud = models.DecimalField(max_digits=9, decimal_places=6)
    longitud = models.DecimalField(max_digits=9, decimal_places=6)
