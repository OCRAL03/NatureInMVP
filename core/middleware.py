from django.shortcuts import redirect
from datetime import date

class ParentalControlMiddleware:
    def __init__(self, get_response): self.get_response = get_response
    def __call__(self, request):
        user = request.user
        if user.is_authenticated and getattr(user,'fecha_nacimiento', None):
            age = (date.today() - user.fecha_nacimiento).days // 365
            if age < 13 and request.path.startswith('/foros/'):
                return redirect('core:underage_blocked') 
        return self.get_response(request)