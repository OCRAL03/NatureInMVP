from django.urls import path
from .views import sightings

urlpatterns = [
    path('sightings', sightings)
]
