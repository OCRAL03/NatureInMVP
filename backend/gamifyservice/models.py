from django.conf import settings
from django.db import models
from django.dispatch import Signal


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


class Rank(models.Model):
    name = models.CharField(max_length=64, unique=True)
    min_points = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class UserScore(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    rank = models.ForeignKey(Rank, null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        unique_together = ('user',)


class BadgeDefinition(models.Model):
    code = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=200, blank=True)
    threshold_points = models.IntegerField(default=0)


class Mission(models.Model):
    title = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    reward_points = models.IntegerField(default=0)


class UserProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'mission')


class GameType(models.Model):
    name = models.CharField(max_length=64, unique=True)


class Game(models.Model):
    title = models.CharField(max_length=128)
    type = models.ForeignKey(GameType, on_delete=models.CASCADE)
    iframe_url = models.URLField(blank=True)
    lti_launch_url = models.URLField(blank=True)
    lti_consumer_key = models.CharField(max_length=128, blank=True)
    lti_shared_secret = models.CharField(max_length=128, blank=True)


activity_completed = Signal()
