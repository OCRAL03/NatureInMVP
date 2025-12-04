from django.urls import path
from .views import ia_chat

urlpatterns = [
    path('chat/', ia_chat),
]

