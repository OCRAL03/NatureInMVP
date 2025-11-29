class AuthService:
    @staticmethod
    def login(username: str, password: str) -> dict:
        # TODO: Implementar autenticación real y 2FA
        return {"username": username, "status": "ok", "source": "stub"}