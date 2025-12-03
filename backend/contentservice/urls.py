from django.urls import path
from .views import generate_ficha

urlpatterns = [
    path('generate-ficha', generate_ficha)
]
