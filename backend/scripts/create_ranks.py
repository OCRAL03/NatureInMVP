"""
Script para crear rangos basados en puntos
Ejecutar: python manage.py shell < scripts/create_ranks.py
o desde shell: exec(open('scripts/create_ranks.py').read())
"""

from gamifyservice.models import Rank

# Limpiar rangos existentes (opcional)
# Rank.objects.all().delete()

ranks_data = [
    {'name': 'Explorador Novato', 'min_points': 0},
    {'name': 'Observador Curioso', 'min_points': 100},
    {'name': 'Rastreador de la Naturaleza', 'min_points': 300},
    {'name': 'Guardián Verde', 'min_points': 600},
    {'name': 'Protector de la Biodiversidad', 'min_points': 1000},
    {'name': 'Maestro Naturalista', 'min_points': 2000},
    {'name': 'Sabio de la Selva', 'min_points': 4000},
    {'name': 'Leyenda Viviente', 'min_points': 8000},
]

print("Creando rangos...")
created_count = 0

for rank_data in ranks_data:
    rank, created = Rank.objects.get_or_create(
        name=rank_data['name'],
        defaults={'min_points': rank_data['min_points']}
    )
    if created:
        created_count += 1
        print(f"✓ Creado: {rank.name} (desde {rank.min_points} puntos)")
    else:
        print(f"- Ya existe: {rank.name}")

print(f"\n{created_count} rangos nuevos creados.")
print(f"Total de rangos en la BD: {Rank.objects.count()}")
