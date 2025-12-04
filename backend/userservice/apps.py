from django.apps import AppConfig


class UserserviceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'userservice'
    verbose_name = 'Servicio de Usuarios'

    def ready(self):
        """Importar señales cuando la app esté lista"""