from django.contrib.auth import get_user_model
from rest_framework.test import APIClient


class TestGamify:
    def setup_method(self):
        self.client = APIClient()

    def _token(self, username='guser'):
        User = get_user_model()
        User.objects.get_or_create(username=username, defaults={'password': 'p1'})
        res = self.client.post('/api/auth/token/', {'username': username, 'password': 'p1'}, format='json')
        return res.data.get('access')

    def test_award_points_and_rank(self):
        token = self._token('ranker')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        res = self.client.post('/api/gamify/award', {'puntos': 150}, format='json')
        assert res.status_code == 200
        assert (res.data.get('new_total') or 0) >= 150

