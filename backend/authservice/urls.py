from django.urls import path
from .views import login
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView

urlpatterns = [
    path('login/', login),
    path('token/', CustomTokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
]
