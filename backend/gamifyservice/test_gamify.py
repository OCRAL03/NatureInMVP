from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class GamifyTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def _token(self, username='guser', password='p1'):
        User = get_user_model()
        User.objects.create_user(username=username, password=password)
        res = self.client.post('/api/auth/token/', {'username': username, 'password': password}, format='json')
        return res.data.get('access')

    def test_award_points_and_rank(self):
        token = self._token('ranker', 'p2')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        res = self.client.post('/api/gamify/award', {'puntos': 150}, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertTrue((res.data.get('new_total') or 0) >= 150)

