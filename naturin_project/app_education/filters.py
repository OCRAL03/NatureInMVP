from django import forms
import django_filters
from django_filters import rest_framework as drf_filters

from .models import Fichas


# Opciones controladas segun contexto actual del sitio
CATEGORY_CHOICES = (
    (1, "Flora"),
    (2, "Fauna"),
)

NIVEL_CHOICES = (
    (2, "Secundaria"),
)

GRADO_CHOICES = (
    (1, "1° Secundaria"),
    (2, "2° Secundaria"),
)


class FichaFilterSet(drf_filters.FilterSet):
    """Filtros estrictos para listado de Fichas.

    - Valores inválidos provocan error 400 con mensajes claros.
    - Aliases amigables: `categoria`, `especie`, `nivel_educativo`, `grado`.
    - Compatibilidad con IDs originales: `idcategoria`, `idespecie`, `idniveleducativo`, `idgradoeducativo`.
    """

    # Alias amigable: categoria (Flora/Fauna)
    categoria = drf_filters.ChoiceFilter(
        field_name="categoria_id",
        choices=CATEGORY_CHOICES,
        label="Categoria",
        field_class=forms.TypedChoiceField,
        field_kwargs={
            "coerce": int,
            "empty_value": None,
            "error_messages": {
                "invalid_choice": "Categoría %(value)s no válida. Opciones: 1, 2",
            },
        },
    )

    # Alias amigable: especie (ID numerico >= 1)
    especie = drf_filters.NumberFilter(
        field_name="especie_id",
        label="Especie",
        min_value=1,
    )

    # Alias amigable: nivel educativo (solo Secundaria -> 2)
    nivel_educativo = drf_filters.ChoiceFilter(
        field_name="nivel_educativo_id",
        choices=NIVEL_CHOICES,
        label="Nivel Educativo",
        field_class=forms.TypedChoiceField,
        field_kwargs={
            "coerce": int,
            "empty_value": None,
            "error_messages": {
                "invalid_choice": "Nivel Educativo %(value)s no válido. Opciones: 2 (Secundaria)",
            },
        },
    )

    # Alias amigable: grado (1°/2° Secundaria)
    grado = drf_filters.ChoiceFilter(
        field_name="grado_educativo_id",
        choices=GRADO_CHOICES,
        label="Grado",
        field_class=forms.TypedChoiceField,
        field_kwargs={
            "coerce": int,
            "empty_value": None,
            "error_messages": {
                "invalid_choice": "Grado %(value)s no válido. Opciones: 1, 2",
            },
        },
    )

    # Compatibilidad con parametros originales (IDs crudos)
    idcategoria = drf_filters.NumberFilter(field_name="categoria_id", label="idcategoria", min_value=1)
    idespecie = drf_filters.NumberFilter(field_name="especie_id", label="idespecie", min_value=1)
    idniveleducativo = drf_filters.NumberFilter(field_name="nivel_educativo_id", label="idniveleducativo", min_value=1)
    idgradoeducativo = drf_filters.NumberFilter(field_name="grado_educativo_id", label="idgradoeducativo", min_value=1)

    class Meta:
        model = Fichas
        fields = [
            # Aliases
            "categoria",
            "especie",
            "nivel_educativo",
            "grado",
            # IDs originales
            "idcategoria",
            "idespecie",
            "idniveleducativo",
            "idgradoeducativo",
        ]

