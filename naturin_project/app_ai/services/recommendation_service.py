class RecommendationService:
    @staticmethod
    def recommend_for_user(user_id: int) -> dict:
        # TODO: Implementar recomendador híbrido; por ahora, lista fija
        return {
            "user_id": user_id,
            "recommendations": [
                {"tipo": "ficha", "id": 1, "titulo": "Especie destacada"},
                {"tipo": "actividad", "id": 2, "titulo": "Quiz de biodiversidad"},
            ],
            "source": "stub",
        }