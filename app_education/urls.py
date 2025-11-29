from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FichasViewSet

router = DefaultRouter()
router.register(r'fichas', FichasViewSet, basename='fichas')

urlpatterns = [
    path('', include(router.urls)),
]
