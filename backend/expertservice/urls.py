from django.urls import path
from . import views

urlpatterns = [
    path('validation-stats/', views.validation_stats, name='validation-stats'),
    path('pending-sightings/', views.pending_sightings, name='pending-sightings'),
    path('sightings/<int:sighting_id>/approve/', views.approve_sighting, name='approve-sighting'),
    path('sightings/<int:sighting_id>/reject/', views.reject_sighting, name='reject-sighting'),
    
    # Analytics endpoints
    path('analytics/biodiversity/', views.biodiversity_stats, name='biodiversity-stats'),
    path('analytics/validation-metrics/', views.validation_metrics, name='validation-metrics'),
    path('analytics/taxonomy-distribution/', views.taxonomy_distribution, name='taxonomy-distribution'),
    path('analytics/temporal/', views.temporal_data, name='temporal-data'),
    
    # Reports endpoints
    path('reports/generate/', views.generate_report, name='generate-report'),
    path('reports/export/', views.export_report, name='export-report'),
    
    # Certifications endpoints
    path('certifications/users/', views.top_users, name='top-users'),
    path('certifications/award-badge/', views.award_badge, name='award-badge'),
    
    # Training endpoints
    path('training/courses/', views.training_courses, name='training-courses'),
    path('training/resources/', views.training_resources, name='training-resources'),
]
