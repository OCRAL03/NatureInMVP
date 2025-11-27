class TeacherService:
    @staticmethod
    def get_dashboard(aula_id: int, estudiante_id: int) -> dict:
        return {
            "aula_id": aula_id,
            "estudiante_id": estudiante_id,
            "progreso": [],
            "juego": {},
            "usuario": {},
            "source": "stub",
        }