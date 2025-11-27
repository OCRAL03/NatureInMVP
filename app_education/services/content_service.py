class ContentService:
    @staticmethod
    def crear_ficha(data: dict) -> dict:
        return {"created": True, "data": data, "source": "stub"}