import os
import sys
from pathlib import Path


def main():
    base_dir = Path(__file__).resolve().parents[1]
    sys.path.append(str(base_dir))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'naturein.settings')
    import django
    django.setup()
    from contentservice.models import SpeciesImage

    species = [
        ('Tapirus terrestris', 'tapirus_terrestris.jpg'),
        ('Pecari tajacu', 'pecari_tajacu.jpg'),
        ('Rupicola peruvianus', 'rupicola_peruvianus.jpg'),
        ('Cedrela odorata', 'cedrela_odorata.jpg'),
        ('Ficus elastica', 'ficus_elastica.jpg'),
    ]

    created = 0
    for sci, fn in species:
        obj, was_created = SpeciesImage.objects.get_or_create(
            scientific_name=sci,
            defaults={'filename': fn}
        )
        if not was_created:
            obj.filename = fn
            obj.save(update_fields=['filename'])
        created += int(was_created)
    print(f"Seeded SpeciesImage: {created} new records, {len(species) - created} updated")


if __name__ == '__main__':
    main()