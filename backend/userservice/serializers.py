from rest_framework import serializers
from .models import Sighting, Institution, Place, Message
from django.contrib.auth import get_user_model


class SightingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sighting
        fields = ['id', 'species', 'location', 'created_at']


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['id', 'name', 'type', 'address', 'phone']


class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = ['id', 'title', 'lat', 'lng', 'image_url']


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    recipient = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())

    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'created_at', 'read']

    def validate(self, attrs):
        content = (attrs.get('content') or '').strip()
        if not content:
            raise serializers.ValidationError({'content': 'Contenido requerido'})
        if len(content) > 500:
            raise serializers.ValidationError({'content': 'Contenido demasiado largo (máx 500 caracteres)'})
        sender = attrs.get('sender')
        recipient = attrs.get('recipient')
        if sender and recipient and sender.id == recipient.id:
            raise serializers.ValidationError({'recipient': 'No puedes enviarte mensajes a ti mismo'})
        return attrs
