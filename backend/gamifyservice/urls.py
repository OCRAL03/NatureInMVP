from django.urls import path
from .views import award, metrics, lti_launch

urlpatterns = [
    path('award', award),
    path('metrics', metrics),
    path('lti/launch', lti_launch),
]
