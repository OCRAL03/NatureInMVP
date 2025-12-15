from django.contrib import admin
from .models import SpeciesImage


@admin.register(SpeciesImage)
class SpeciesImageAdmin(admin.ModelAdmin):
    list_display = ('scientific_name', 'filename')
    search_fields = ('scientific_name', 'filename')