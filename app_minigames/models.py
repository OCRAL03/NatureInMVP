from django.db import models
from django.conf import settings

# Create your models here.

class ExternalTool(models.Model):
    name = models.CharField(max_length=150)
    launch_url = models.URLField()
    consumer_key = models.CharField(max_length=200)
    shared_secret = models.CharField(max_length=200, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Juego(models.Model):
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    imagen = models.ImageField(upload_to='juegos/', blank=True, null=True)
    url = models.URLField(blank=True)  # iframe fallback
    external_tool = models.ForeignKey(ExternalTool, on_delete=models.SET_NULL, null=True, blank=True, help_text="Si está vacío se usará url (iframe).")
    lti_result_sourcedid = models.TextField(blank=True, null=True)  
    lti_outcome_url = models.URLField(blank=True, null=True)       
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre
