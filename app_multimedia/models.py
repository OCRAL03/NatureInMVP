from django.db import models

class TipoMultimedia(models.Model):
    tipo_multimedia = models.CharField(max_length=100)

class Multimedia(models.Model):
    tipo_multimedia = models.ForeignKey(TipoMultimedia, on_delete=models.CASCADE)
    url = models.CharField(max_length=512)
    titulo = models.CharField(max_length=200, null=True, blank=True)
    creditos = models.CharField(max_length=200, null=True, blank=True)

class EspecieMultimedia(models.Model):
    especie = models.ForeignKey('app_taxonomy.Especies', on_delete=models.CASCADE)
    multimedia = models.ForeignKey(Multimedia, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('especie', 'multimedia')

class FichaMultimedia(models.Model):
    ficha = models.ForeignKey('app_education.Fichas', on_delete=models.CASCADE)
    multimedia = models.ForeignKey(Multimedia, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('ficha', 'multimedia')
