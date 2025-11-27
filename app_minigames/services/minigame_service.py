class MinigameService:
    @staticmethod
    def registrar_partida(user_id: int, juego_id: int, resultado: dict) -> dict:
        return {"user_id": user_id, "juego_id": juego_id, "resultado": resultado, "source": "stub"}

    @staticmethod
    def get_dificultad_adaptativa(user_id: int) -> str:
        return "media"