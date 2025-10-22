from django.db import models
from django.conf import settings

class Rango(models.Model):
    nombre_rango = models.CharField(max_length=50)

class NivelDificultad(models.Model):
    nombre_dificultad = models.CharField(max_length=10)

class TipoJuego(models.Model):
    tipo_juego = models.CharField(max_length=50)

class Juego(models.Model):
    nombre_juego = models.CharField(max_length=100)
    tipo_juego = models.ForeignKey(TipoJuego, on_delete=models.CASCADE)
    instrucciones = models.CharField(max_length=500)
    descripcion = models.CharField(max_length=50)
    nivel_dificultad = models.ForeignKey(NivelDificultad, on_delete=models.CASCADE)

class Recompensa(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500)
    icono_url = models.CharField(max_length=255)
    puntos = models.IntegerField(default=0)
    criterio = models.TextField()

class DefinicionInsignia(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500)
    icon_url = models.CharField(max_length=255)
    criterio = models.CharField(max_length=500, null=True, blank=True)

class InsigniasUsuario(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    insignia = models.ForeignKey(DefinicionInsignia, on_delete=models.CASCADE)
    fecha_obtenida = models.DateTimeField(auto_now_add=True)

class JuegoUsuario(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    juego = models.ForeignKey(Juego, on_delete=models.CASCADE)
    puntuacion = models.IntegerField(null=True, blank=True)
    fecha_jugada = models.DateTimeField(auto_now_add=True)
    recompensa = models.ForeignKey(Recompensa, null=True, blank=True, on_delete=models.CASCADE)

class UsuarioPuntaje(models.Model):
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    rango_avance = models.ForeignKey(Rango, on_delete=models.CASCADE, default=1)
