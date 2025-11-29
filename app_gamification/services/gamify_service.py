class GamifyService:
    @staticmethod
    def otorgar_puntos(user_id: int, puntos: int) -> dict:
        return {"user_id": user_id, "puntos": puntos, "source": "stub"}

    @staticmethod
    def get_ranking() -> list:
        return [
            {"user_id": 1, "puntos": 100},
            {"user_id": 2, "puntos": 90},
        ]