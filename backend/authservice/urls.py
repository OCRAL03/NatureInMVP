from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    change_password,
    request_password_reset,
    reset_password,
    logout,
    email_verification_request,
    email_verification_confirm,
    email_verification_resend,
    health
)

urlpatterns = [
    # Autenticación JWT
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Verificación de email
    path('email/verify/request/', email_verification_request, name='email_verify_request'),
    path('email/verify/confirm/', email_verification_confirm, name='email_verify_confirm'),
    path('email/verify/resend/', email_verification_resend, name='email_verify_resend'),

    # Gestión de contraseñas
    path('change-password/', change_password, name='change_password'),
    path('password-reset/request/', request_password_reset, name='password_reset_request'),
    path('password-reset/confirm/', reset_password, name='password_reset_confirm'),

    # Logout
    path('logout/', logout, name='logout'),

    # Health
    path('health/', health, name='health'),
]
