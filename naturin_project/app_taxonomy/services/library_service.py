class LibraryService:
    @staticmethod
    def get_especie_details(especie_id: int) -> dict:
        return {"id": especie_id, "nombre": "Especie Stub", "source": "stub"}

    @staticmethod
    def buscar(query: str) -> list:
        return [
            {"id": 1, "nombre": "Stub 1"},
            {"id": 2, "nombre": "Stub 2"},
        ]