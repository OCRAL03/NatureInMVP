from django.shortcuts import render

# Create your views here.

def landing(request):
    return render(request, 'core/landing.html')

def header(request):
    return render(request, 'base/header.html')
def footer(request):
    return render(request, 'base/footer.html')

def base(request):
    return render(request, 'base/base.html')
