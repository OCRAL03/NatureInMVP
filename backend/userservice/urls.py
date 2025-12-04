from django.urls import path
from .views import sightings, institutions, places

urlpatterns = [
    path('sightings', sightings),
    path('institutions', institutions),
    path('places', places)
]
