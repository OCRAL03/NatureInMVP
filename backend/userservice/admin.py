from django.contrib import admin
from .models import UserProfile, Sighting, UserActivity


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'institution', 'created_at']
    search_fields = ['user__username', 'full_name', 'institution']
    list_filter = ['created_at', 'institution']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Sighting)
class SightingAdmin(admin.ModelAdmin):
    list_display = ['species', 'user', 'location', 'verification_status', 'created_at']
    search_fields = ['species', 'location', 'user__username']
    list_filter = ['verification_status', 'created_at']
    readonly_fields = ['created_at', 'updated_at']

    actions = ['mark_as_verified', 'mark_as_rejected']

    def mark_as_verified(self, request, queryset):
        queryset.update(verification_status='verified')
    mark_as_verified.short_description = "Marcar como verificado"

    def mark_as_rejected(self, request, queryset):
        queryset.update(verification_status='rejected')
    mark_as_rejected.short_description = "Marcar como rechazado"


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'description', 'created_at']
    search_fields = ['user__username', 'description']
    list_filter = ['activity_type', 'created_at']
    readonly_fields = ['created_at']