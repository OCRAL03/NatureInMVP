from django.test import TestCase
from django.conf import settings
from pathlib import Path
from contentservice.models import SpeciesImage


class StaticImagesSmokeTest(TestCase):
    def test_seeded_species_images_exist(self):
        names = {
            'Tapirus terrestris': 'tapirus_terrestris.jpg',
            'Pecari tajacu': 'pecari_tajacu.jpg',
            'Rupicola peruvianus': 'rupicola_peruvianus.jpg',
            'Cedrela odorata': 'cedrela_odorata.jpg',
            'Ficus elastica': 'ficus_elastica.jpg',
        }
        for sci, default_fn in names.items():
            rec = SpeciesImage.objects.filter(scientific_name=sci).first()
            if rec and rec.image:
                file_path = Path(settings.MEDIA_ROOT) / rec.image.name
                assert file_path.exists(), f"media file missing: {file_path}"
            else:
                fn = (rec.filename if rec and rec.filename else default_fn)
                file_path = settings.BASE_DIR / 'static' / 'species' / fn
                assert file_path.exists(), f"static file missing: {file_path}"

