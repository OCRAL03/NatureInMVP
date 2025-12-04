from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import os, requests

@api_view(['POST'])
@permission_classes([AllowAny])  # permite acceso sin autenticación
def ia_chat(request):
    user_message = request.data.get("message", "")
    api_key = os.environ.get("API_KEY")

    if not api_key:
        return Response({"error": "API key no encontrada"}, status=500)

    # si está autenticado usamos su rol, si no, asumimos student
    try:
        role = request.user.role.role
    except Exception:
        role = "student"

    if role == "admin":
        return Response({"error": "El rol admin no tiene acceso al chat."}, status=403)

    role_prompts = {
        "student": "Responde como un orientador académico, dando apoyo y guía sencilla.Trata de no dar mucho texto y ser conciso.",
        "teacher": "Responde como un instructor experto, ofreciendo soporte pedagógico y recursos docentes.Trata de no dar mucho texto y ser conciso.",
        "expert": "Responde como un colega especializado, con lenguaje técnico y profundo.Trata de no dar mucho texto y ser conciso.",
        "admin": "No mostrar chat ni responder.",
    }
    system_prompt = role_prompts.get(role, role_prompts["student"])

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        groq_data = response.json()

        # reformateamos para que el frontend siempre reciba message
        if "choices" in groq_data and len(groq_data["choices"]) > 0:
            message = groq_data["choices"][0].get("message", {
                "role": "assistant",
                "content": "No se recibió respuesta válida del modelo."
            })
        else:
            message = {"role": "assistant", "content": "No se recibió respuesta válida del modelo."}

        return Response({"choices": [{"message": message}]})

    except requests.exceptions.RequestException as e:
        return Response({"error": f"Error al conectar con Groq: {str(e)}"}, status=500)