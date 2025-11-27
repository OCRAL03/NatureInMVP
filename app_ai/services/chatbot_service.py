class ChatbotService:
    @staticmethod
    def answer(question: str) -> dict:
        # TODO: Integrar LLM/IA real; por ahora, respondemos con stub
        return {
            "answer": f"Pregunta recibida: {question}",
            "source": "stub",
        }