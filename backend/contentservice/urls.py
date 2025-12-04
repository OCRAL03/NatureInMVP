from django.urls import path
from .views import generate_ficha, llm_chat, llm_health

urlpatterns = [
    path('generate-ficha', generate_ficha),
    path('chat', llm_chat),
    path('llm/health', llm_health),
]
