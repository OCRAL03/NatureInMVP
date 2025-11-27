class GeoService:
    @staticmethod
    def crear_avistamiento(data: dict) -> dict:
        return {"created": True, "data": data, "source": "stub"}