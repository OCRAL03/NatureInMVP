from django.urls import path
from .views import sightings, institutions, places, messages, docs_institutions, docs_places

urlpatterns = [
    path('sightings', sightings),
    path('institutions', institutions),
    path('places', places),
    path('messages', messages),
    path('docs/institutions', docs_institutions),
    path('docs/places', docs_places),
]
