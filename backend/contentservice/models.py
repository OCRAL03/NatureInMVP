from django.db import models


class SpeciesImage(models.Model):
    scientific_name = models.CharField(max_length=200, unique=True)
    filename = models.CharField(max_length=300)
    image = models.ImageField(upload_to='species/', blank=True, null=True)

    def __str__(self):
        return self.scientific_name

