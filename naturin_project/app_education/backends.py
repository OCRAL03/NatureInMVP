from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError


class StrictDjangoFilterBackend(DjangoFilterBackend):
    """Backend de filtros que levanta errores 400 para entradas inválidas.

    En lugar de ignorar valores inválidos, devuelve ValidationError con
    mensajes concretos provenientes del FilterSet/form.
    """

    def filter_queryset(self, request, queryset, view):
        filterset = self.get_filterset(request, queryset, view)
        if filterset is None:
            return queryset
        if not filterset.is_valid():
            # Mensajes estructurados por campo
            raise ValidationError(detail=filterset.errors)
        return filterset.qs

