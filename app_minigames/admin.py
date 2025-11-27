from django.contrib import admin
from .models import ExternalTool, Juego

@admin.register(ExternalTool)
class ExternalToolAdmin(admin.ModelAdmin):
    list_display = ('name','launch_url','created')
    search_fields = ('name','launch_url')

@admin.register(Juego)
class JuegoAdmin(admin.ModelAdmin):
    list_display = ('nombre','external_tool','created')
    search_fields = ('nombre','descripcion')
