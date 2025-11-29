from django.core.management.base import BaseCommand
from django.db import transaction

from app_education.models import Fichas, NivelEducativo, GradoDeNivelEducativo
from app_taxonomy.models import (
    Categoria,
    Especies,
    TipoEspecie,
    Habitat,
    Locacion,
    TipoReproduccion,
    EstadoDeConservacion,
    PeligroHumano,
)
from app_multimedia.models import TipoMultimedia, Multimedia, FichaMultimedia


class Command(BaseCommand):
    help = "Puebla la base de datos con datos maestros y de prueba para NatureIn"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Iniciando carga de datos..."))

        try:
            with transaction.atomic():
                # 1) CATÁLOGOS MAESTROS (IDs fijos cuando aplica)
                flora, _ = Categoria.objects.get_or_create(id=1, defaults={"categoria": "Flora"})
                fauna, _ = Categoria.objects.get_or_create(id=2, defaults={"categoria": "Fauna"})

                secundaria, _ = NivelEducativo.objects.get_or_create(id=2, defaults={"nivel": "Secundaria"})

                grado1, _ = GradoDeNivelEducativo.objects.get_or_create(id=1, defaults={"grado": "1ro de Secundaria"})
                grado2, _ = GradoDeNivelEducativo.objects.get_or_create(id=2, defaults={"grado": "2do de Secundaria"})

                img_type, _ = TipoMultimedia.objects.get_or_create(id=1, defaults={"tipo_multimedia": "Imagen"})
                vid_type, _ = TipoMultimedia.objects.get_or_create(id=2, defaults={"tipo_multimedia": "Video"})
                aud_type, _ = TipoMultimedia.objects.get_or_create(id=3, defaults={"tipo_multimedia": "Audio"})

                self.stdout.write(self.style.SUCCESS("✓ Catálogos maestros creados."))

                # 2) Soportes requeridos para Especies (FKs obligatorias)
                tipo_ave, _ = TipoEspecie.objects.get_or_create(especie="Ave")
                tipo_planta, _ = TipoEspecie.objects.get_or_create(especie="Planta")

                hab_cueva, _ = Habitat.objects.get_or_create(habitat="Cueva")
                hab_bosque, _ = Habitat.objects.get_or_create(habitat="Bosque")

                loc_tingo, _ = Locacion.objects.get_or_create(locacion="Parque Nacional Tingo María")

                repro_ovip, _ = TipoReproduccion.objects.get_or_create(reproduccion="Ovíparo")
                repro_semillas, _ = TipoReproduccion.objects.get_or_create(reproduccion="Semillas")

                estado_preocup, _ = EstadoDeConservacion.objects.get_or_create(estado_conservacion="Preocupación Menor")
                peligro_bajo, _ = PeligroHumano.objects.get_or_create(nivel_peligro="Bajo")

                # 3) ESPECIES
                guacharo, _ = Especies.objects.get_or_create(
                    id=1,
                    defaults={
                        "categoria": fauna,
                        "tipo_especie": tipo_ave,
                        "nombre_comun": "Guácharo",
                        "nombre_cientifico": "Steatornis caripensis",
                        "descripcion": "Ave nocturna que habita en la Cueva de las Lechuzas. Utiliza ecolocalización para navegar en la oscuridad.",
                        "habitat": hab_cueva,
                        "locacion": loc_tingo,
                        "tipo_reproduccion": repro_ovip,
                        "estado_conservacion": estado_preocup,
                        "peligro": peligro_bajo,
                    },
                )

                orquidea, _ = Especies.objects.get_or_create(
                    id=2,
                    defaults={
                        "categoria": flora,
                        "tipo_especie": tipo_planta,
                        "nombre_comun": "Zapatito de la Reina",
                        "nombre_cientifico": "Phragmipedium besseae",
                        "descripcion": "Orquídea emblemática de la zona de Tingo María.",
                        "habitat": hab_bosque,
                        "locacion": loc_tingo,
                        "tipo_reproduccion": repro_semillas,
                        "estado_conservacion": estado_preocup,
                        "peligro": peligro_bajo,
                    },
                )

                self.stdout.write(self.style.SUCCESS("✓ Especies de prueba creadas."))

                # 4) FICHA EDUCATIVA (Guácharo)
                ficha_guacharo, created = Fichas.objects.get_or_create(
                    titulo="El Misterioso Guácharo",
                    defaults={
                        "descripcion": "Ave nocturna que habita en la Cueva de las Lechuzas. Utiliza ecolocalización para navegar en la oscuridad.",
                        "categoria": fauna,
                        "especie": guacharo,
                        "nivel_educativo": secundaria,
                        "grado_educativo": grado1,
                    },
                )

                if created:
                    media1 = Multimedia.objects.create(
                        tipo_multimedia=img_type,
                        url="https://upload.wikimedia.org/wikipedia/commons/4/4c/Oilbird_%28Steatornis_caripensis%29.jpg",
                        titulo="Guácharo en su nido",
                    )
                    FichaMultimedia.objects.create(ficha=ficha_guacharo, multimedia=media1)

                self.stdout.write(self.style.SUCCESS(f"✓ Ficha creada: {ficha_guacharo.titulo}"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error durante el seed: {str(e)}"))
            return

        self.stdout.write(self.style.SUCCESS("SUCCESS: Base de datos poblada correctamente para pruebas."))

