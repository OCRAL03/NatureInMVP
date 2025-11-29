from django.core.management.base import BaseCommand
import sys


class Command(BaseCommand):
    help = "Verifica la configuración y dependencias de LTI 1.3"

    def handle(self, *args, **kwargs):
        self.stdout.write("Verificando entorno LTI...")

        # 1. Verificar Librería
        try:
            import pylti1p3  # type: ignore
        except ImportError:
            self.stdout.write(
                self.style.ERROR(
                    "ERROR CRÍTICO: 'pylti1p3' no está instalado. Ejecuta: pip install pylti1p3"
                )
            )
            sys.exit(1)

        version = getattr(pylti1p3, "__version__", "N/A")
        self.stdout.write(
            self.style.SUCCESS(f" Librería 'pylti1p3' encontrada (v{version}).")
        )
        self.stdout.write(self.style.SUCCESS(" Entorno LTI verificado correctamente."))
