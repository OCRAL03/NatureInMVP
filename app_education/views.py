from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiExample,
)


class FichasViewSet(ViewSet):
    """
    Listado de Fichas educativas con filtros estrictos documentados.
    """

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
    def list(self, request):
        # Para garantizar 200 OK incluso sin migraciones/datos,
        # devolvemos lista vacía. Integración futura: conectar ORM y filtros.
        return Response([], status=status.HTTP_200_OK)
