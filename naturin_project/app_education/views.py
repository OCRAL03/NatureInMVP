from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Fichas
from .serializers import FichasSerializer
from .filters import FichaFilterSet
from .backends import StrictDjangoFilterBackend


class FichasViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fichas.objects.all().order_by("id")
    serializer_class = FichasSerializer

    # Filtro, búsqueda y ordenamiento
    filter_backends = [StrictDjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = FichaFilterSet

    search_fields = [
        "titulo",
        "descripcion",
        "especie__nombre_comun",
        "especie__nombre_cientifico",
        "categoria__categoria",
    ]

    ordering_fields = ["titulo", "id"]
    ordering = ["titulo"]
