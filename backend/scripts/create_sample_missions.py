"""
Script para crear misiones de ejemplo relacionadas con biodiversidad
Ejecutar: python manage.py shell < scripts/create_sample_missions.py
o desde shell: exec(open('scripts/create_sample_missions.py').read())
"""

from gamifyservice.models import Mission

# Limpiar misiones existentes (opcional, comentar si no quieres eliminar)
# Mission.objects.all().delete()

missions_data = [
    {
        'title': 'Primer Avistamiento',
        'description': 'Registra tu primer avistamiento de una especie en la naturaleza. Toma una foto y agrega la ubicación.',
        'reward_points': 20,
    },
    {
        'title': 'Explorador de la Biodiversidad',
        'description': 'Registra 5 avistamientos diferentes de especies. Observa y documenta la diversidad de tu entorno.',
        'reward_points': 50,
    },
    {
        'title': 'Guardián del Bosque',
        'description': 'Visita 3 zonas diferentes de exploración y registra al menos un avistamiento en cada una.',
        'reward_points': 75,
    },
    {
        'title': 'Maestro de la Observación',
        'description': 'Consigue que 3 de tus avistamientos sean verificados por expertos. La precisión es clave.',
        'reward_points': 100,
    },
    {
        'title': 'Conocedor de Especies',
        'description': 'Consulta las fichas de información de 10 especies diferentes para aprender sobre su hábitat y características.',
        'reward_points': 30,
    },
    {
        'title': 'Fotógrafo Naturalista',
        'description': 'Registra 5 avistamientos con fotografías de alta calidad que muestren claramente la especie.',
        'reward_points': 60,
    },
    {
        'title': 'Amigo de las Aves',
        'description': 'Registra avistamientos de 5 especies diferentes de aves. Escucha y observa con atención.',
        'reward_points': 80,
    },
    {
        'title': 'Conservacionista Activo',
        'description': 'Completa 10 actividades educativas relacionadas con la conservación de la biodiversidad.',
        'reward_points': 120,
    },
    {
        'title': 'Explorador Semanal',
        'description': 'Registra al menos un avistamiento durante 7 días consecutivos. La constancia es importante.',
        'reward_points': 150,
    },
    {
        'title': 'Leyenda de la Naturaleza',
        'description': 'Alcanza 500 puntos totales y conviértete en una leyenda de la conservación.',
        'reward_points': 200,
    },
]

print("Creando misiones de ejemplo...")
created_count = 0

for mission_data in missions_data:
    mission, created = Mission.objects.get_or_create(
        title=mission_data['title'],
        defaults={
            'description': mission_data['description'],
            'reward_points': mission_data['reward_points'],
        }
    )
    if created:
        created_count += 1
        print(f"✓ Creada: {mission.title} (+{mission.reward_points} puntos)")
    else:
        print(f"- Ya existe: {mission.title}")

print(f"\n{created_count} misiones nuevas creadas.")
print(f"Total de misiones en la BD: {Mission.objects.count()}")
