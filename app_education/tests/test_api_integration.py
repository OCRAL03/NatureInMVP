from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from app_education.models import Fichas, NivelEducativo, GradoDeNivelEducativo
from app_taxonomy.models import Categoria


class FichaFilterIntegrationTest(APITestCase):
    databases = {'default'}

    def setUp(self):
        # Datos maestros mínimos (IDs explícitos para coincidir con filtros)
        self.flora = Categoria.objects.create(id=1, categoria='Flora')
        self.fauna = Categoria.objects.create(id=2, categoria='Fauna')

        self.secundaria = NivelEducativo.objects.create(id=2, nivel='Secundaria')
        self.grado1 = GradoDeNivelEducativo.objects.create(id=1, grado='1ro de Secundaria')

        # Ficha de prueba (Fauna)
        self.ficha_fauna = Fichas.objects.create(
            titulo="Ficha de Prueba Fauna",
            descripcion="Descripción de prueba",
            categoria=self.fauna,
            nivel_educativo=self.secundaria,
            grado_educativo=self.grado1,
        )

        # URL base del endpoint
        self.url = '/api/v1/education/fichas/'

    def _get_results(self, response):
        """Compatibilidad con respuestas paginadas y no paginadas."""
        if isinstance(response.data, list):
            return response.data
        return response.data.get('results', [])

    def test_filtro_estricto_categoria_valida(self):
        """
        RF-09: Filtrar por categoría válida (2=Fauna) debe devolver resultados.
        """
        response = self.client.get(f"{self.url}?categoria=2")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = self._get_results(response)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['titulo'], "Ficha de Prueba Fauna")

    def test_filtro_estricto_categoria_invalida(self):
        """
        RF-09: Filtrar por categoría inválida (99) debe devolver 400 Bad Request.
        Valida que StrictDjangoFilterBackend sigue activo.
        """
        response = self.client.get(f"{self.url}?categoria=99")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('categoria', response.data)

    def test_filtro_combinado_alias(self):
        """
        Validar que los alias (search + filtros) funcionan juntos.
        """
        # Búsqueda que coincide + Categoría correcta
        response = self.client.get(f"{self.url}?categoria=2&search=Prueba")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = self._get_results(response)
        self.assertEqual(len(results), 1)

        # Búsqueda que NO coincide
        response = self.client.get(f"{self.url}?categoria=2&search=XYZ")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = self._get_results(response)
        self.assertEqual(len(results), 0)

