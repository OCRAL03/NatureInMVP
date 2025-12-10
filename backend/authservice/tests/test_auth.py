from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_token_contains_role(self):
        User = get_user_model()
        User.objects.create_user(username='u1', password='p1')
        res = self.client.post('/api/auth/token/', {'username': 'u1', 'password': 'p1'}, format='json')
        self.assertEqual(res.status_code, 200)
        access = res.data.get('access')
        self.assertTrue(bool(access))

    def test_me_returns_profile(self):
        User = get_user_model()
        User.objects.create_user(username='u2', password='p2', email='e@example.com')
        res = self.client.post('/api/auth/token/', {'username': 'u2', 'password': 'p2'}, format='json')
        access = res.data.get('access')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
        me = self.client.get('/api/auth/me/')
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.data.get('username'), 'u2')
