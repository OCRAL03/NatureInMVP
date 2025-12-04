from rest_framework import serializers
from .models import Sighting, Institution


class SightingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sighting
        fields = ['id', 'species', 'location', 'created_at']


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['id', 'name', 'type', 'address', 'phone']
