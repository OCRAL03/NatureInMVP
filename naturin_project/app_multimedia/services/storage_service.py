class StorageService:
    @staticmethod
    def subir_a_s3(file_obj) -> str:
        return "https://s3.example.com/fake-url"

    @staticmethod
    def asociar_archivo(user_id: int, url: str) -> dict:
        return {"user_id": user_id, "url": url, "source": "stub"}