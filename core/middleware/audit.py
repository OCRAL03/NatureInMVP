import logging
from typing import Callable

logger = logging.getLogger(__name__)


class AuditDeleteMiddleware:
    """
    Middleware de auditoría simple: registra quién ejecuta DELETE.
    Regístralo en settings MIDDLEWARE para activarlo.
    """

    def __init__(self, get_response: Callable):
        self.get_response = get_response

    def __call__(self, request):
        # Antes de la vista
        if request.method == "DELETE":
            user = getattr(request, "user", None)
            logger.info(
                "DELETE audit: path=%s user=%s", request.path, getattr(user, "username", None)
            )
        response = self.get_response(request)
        # Después de la vista
        return response

