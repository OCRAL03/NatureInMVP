from django.urls import path
from .views import generate_ficha, llm_chat, llm_health, autocomplete, export_fichas_csv, teaching_guides

urlpatterns = [
    path('generate-ficha', generate_ficha),
    path('chat', llm_chat),
    path('llm/health', llm_health),
    path('autocomplete', autocomplete),
    path('export', export_fichas_csv),
    path('teaching/guides', teaching_guides),
]