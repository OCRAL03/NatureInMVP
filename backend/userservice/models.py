from django.db import models


class Institution(models.Model):
    name = models.CharField(max_length=200, unique=True)
    type = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=300, blank=True)
    phone = models.CharField(max_length=32, blank=True)

    def __str__(self):
        return self.name


class Sighting(models.Model):
    species = models.CharField(max_length=120)
    location = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.species} @ {self.location}"
