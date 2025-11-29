from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services.chatbot_service import ChatbotService
from .services.recommendation_service import RecommendationService

class ChatbotView(APIView):
    def post(self, request):
        question = request.data.get('question', '')
        result = ChatbotService.answer(question)
        return Response(result, status=status.HTTP_200_OK)

class RecommendView(APIView):
    def get(self, request):
        user_id = int(request.query_params.get('user_id', '0'))
        result = RecommendationService.recommend_for_user(user_id)
        return Response(result, status=status.HTTP_200_OK)
