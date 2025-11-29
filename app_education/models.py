from django.db import models
from django.conf import settings

class TipoActividad(models.Model):
    tipo_actividad = models.CharField(max_length=100)

class NivelEducativo(models.Model):
    nivel = models.CharField(max_length=20)

class GradoDeNivelEducativo(models.Model):
    grado = models.CharField(max_length=50)

class TipoInstitucion(models.Model):
    tipo_institucion = models.CharField(max_length=50)

class Instituciones(models.Model):
    nombre_institucion = models.CharField(max_length=100)
    distrito = models.ForeignKey('app_geo.Distrito', on_delete=models.CASCADE)
    tipo_institucion = models.ForeignKey(TipoInstitucion, on_delete=models.CASCADE)
    direccion = models.CharField(max_length=300, null=True, blank=True)

class Aulas(models.Model):
    nombre_aula = models.CharField(max_length=100, null=True, blank=True)
    codigo_aula = models.CharField(max_length=20, unique=True)
    institucion = models.ForeignKey(Instituciones, on_delete=models.CASCADE)
    docente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    ficha = models.ForeignKey('Fichas', null=True, blank=True, on_delete=models.CASCADE)

class Fichas(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    categoria = models.ForeignKey('app_taxonomy.Categoria', null=True, blank=True, on_delete=models.CASCADE)
    especie = models.ForeignKey('app_taxonomy.Especies', null=True, blank=True, on_delete=models.CASCADE)
    nivel_educativo = models.ForeignKey(NivelEducativo, on_delete=models.CASCADE)
    grado_educativo = models.ForeignKey(GradoDeNivelEducativo, on_delete=models.CASCADE)

class Actividades(models.Model):
    titulo = models.CharField(max_length=100, null=True, blank=True)
    instrucciones = models.TextField(null=True, blank=True)
    tipo_actividad = models.ForeignKey(TipoActividad, on_delete=models.CASCADE)
    aula = models.ForeignKey(Aulas, on_delete=models.CASCADE)

class AulaEstudiante(models.Model):
    aula = models.ForeignKey(Aulas, on_delete=models.CASCADE)
    estudiante = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    fecha_ingreso = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('aula', 'estudiante')

class Comentarios(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ficha = models.ForeignKey(Fichas, null=True, blank=True, on_delete=models.CASCADE)
    comentario = models.CharField(max_length=200, null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

class Progreso(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    actividad = models.ForeignKey(Actividades, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    puntuacion = models.IntegerField(null=True, blank=True)
    completado = models.BooleanField(default=False)
