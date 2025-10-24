from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.landing, name='landing'),
    path('header/', views.header, name='header'),
    path('footer/', views.footer, name='footer'),
    path('base/', views.base, name='base'),

]