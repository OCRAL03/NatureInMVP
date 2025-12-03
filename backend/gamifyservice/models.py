from django.conf import settings
from django.db import models


class Point(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    value = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class Badge(models.Model):
    name = models.CharField(max_length=64, unique=True)
    description = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.name


class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')
