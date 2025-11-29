from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiExample,
)

from .models import Fichas
from .serializers import FichasSerializer
from .filters import FichaFilterSet
from .backends import StrictDjangoFilterBackend
from rest_framework.response import Response
import sys
class FichasViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fichas.objects.filter(is_active=True).order_by("id")
    serializer_class = FichasSerializer

    # Filtros estrictos + búsqueda y ordenamiento
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

    @extend_schema(
        summary="Listar Fichas",
        description=(
            "Lista las fichas educativas. Filtros opcionales por IDs:\n\n"
            "- categoria: CategoriaEnum (IDs permitidos: 1, 2)\n"
            "- nivel_educativo: NivelEducativoEnum (IDs permitidos: 1, 2, 3)\n"
            "- grado: GradoEnum (IDs permitidos: 1..6)\n\n"
            "Ejemplo de uso rápido (curl):\n"
            "`curl -X GET http://127.0.0.1:8001/api/v1/education/fichas/`\n"
            "Responde 200 OK y una lista (vacía si no hay datos)."
        ),
        parameters=[
            OpenApiParameter(
                name='categoria',
                location=OpenApiParameter.QUERY,
                description='Filtra por categoría (IDs permitidos).',
                type={'$ref': '#/components/schemas/CategoriaEnum'},
            ),
            OpenApiParameter(
                name='nivel_educativo',
                location=OpenApiParameter.QUERY,
                description='Filtra por nivel educativo (IDs permitidos).',
                type={'$ref': '#/components/schemas/NivelEducativoEnum'},
            ),
            OpenApiParameter(
                name='grado',
                location=OpenApiParameter.QUERY,
                description='Filtra por grado educativo (IDs permitidos).',
                type={'$ref': '#/components/schemas/GradoEnum'},
            ),
        ],
        examples=[
            OpenApiExample(
                name='Listado simple',
                description='Lista sin filtros, respuesta 200 OK.',
                value=None,
            )
        ],
    )

    def list(self, request, *args, **kwargs):
        # Aplica filtros estrictos + búsqueda + ordenamiento
        queryset = self.filter_queryset(self.get_queryset())

        # Paginación si está configurada
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # Sin paginación: retorna lista completa
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
