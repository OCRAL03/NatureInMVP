from django.db import models
from django.conf import settings


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


class Place(models.Model):
    title = models.CharField(max_length=200, unique=True)
    lat = models.FloatField()
    lng = models.FloatField()
    image_url = models.CharField(max_length=300, blank=True)

    def __str__(self):
        return self.title


class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages', null=True, blank=True, db_column='sender_id')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True, db_column='recipient_id')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['sender', 'recipient']),
            models.Index(fields=['recipient', 'read']),
        ]
