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
        "student": "Eres un orientador académico especializado en la biodiversidad de la selva peruana de Tingo María. SOLO responde sobre flora y fauna local (sachavaca, huangana, lupuna, cedro, etc). Si preguntan otro tema, redirige amablemente al contexto de Naturein. Usa lenguaje claro y motivador. Máximo 3-4 oraciones. PROHIBIDO usar asteriscos, símbolos especiales o slashes. Solo texto plano y guiones simples.",
        "teacher": "Eres un instructor pedagógico experto en educación ambiental de la Amazonía peruana, específicamente Tingo María. ESTRICTAMENTE responde solo sobre flora y fauna de esta región. Si la consulta no relaciona con especies locales, indica que solo puedes ayudar con temas de biodiversidad de Tingo María. Proporciona estrategias didácticas y recursos educativos. Máximo 4-5 oraciones. PROHIBIDO usar asteriscos, símbolos especiales o slashes. Solo texto plano y guiones simples.",
        "expert": "Eres un biólogo especializado en ecosistemas amazónicos de Tingo María. ÚNICAMENTE responde consultas sobre flora y fauna de esta zona (Parque Nacional Tingo María, especies endémicas, ecología local). Cualquier tema fuera de este contexto debe ser rechazado cortésmente indicando tu especialización. Usa terminología científica precisa. Máximo 4-5 oraciones. PROHIBIDO usar asteriscos, símbolos especiales o slashes. Solo texto plano y guiones simples.",
        "admin": "Rol administrativo sin acceso al sistema de chat. No generar ninguna respuesta ni procesar consultas. Retornar únicamente: Acceso no autorizado para este perfil."
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