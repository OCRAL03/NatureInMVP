from django.db import models


class Sighting(models.Model):
    species = models.CharField(max_length=120)
    location = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.species} @ {self.location}"
