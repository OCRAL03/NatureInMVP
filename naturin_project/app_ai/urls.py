from django.urls import path
from .views import ChatbotView, RecommendView

urlpatterns = [
    path('chatbot/', ChatbotView.as_view(), name='chatbot'),
    path('recommend/', RecommendView.as_view(), name='recommend'),
]