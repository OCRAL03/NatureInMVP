from rest_framework import serializers

from .models import Fichas


class FichasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fichas
        fields = [
            "id",
            "titulo",
            "descripcion",
            "categoria",
            "especie",
            "nivel_educativo",
            "grado_educativo",
        ]

