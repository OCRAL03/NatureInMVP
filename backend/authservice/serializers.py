from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        role = getattr(getattr(user, 'role', None), 'role', 'student')
        token['role'] = role
        token['username'] = user.username
        return token
