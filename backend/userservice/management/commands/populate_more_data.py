from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from authservice.models import UserRole
from userservice.models import Sighting
from datetime import timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Poblar la base de datos con más avistamientos para 2025'

    def handle(self, *args, **kwargs):
        self.stdout.write('Poblando base de datos con más avistamientos...')
        
        # Obtener usuarios estudiantes existentes
        students = User.objects.filter(role__role='student')
        if not students.exists():
            self.stdout.write(self.style.ERROR('No hay estudiantes. Ejecuta populate_data primero.'))
            return
        
        # Especies (usamos el campo 'species' del modelo)
        especies = [
            'Colibrí Ermitaño (Phaethornis longirostris)',
            'Tucán Pico Iris (Ramphastos sulfuratus)',
            'Quetzal Resplandeciente (Pharomachrus mocinno)',
            'Mono Aullador (Alouatta palliata)',
            'Jaguar (Panthera onca)',
            'Rana de Ojos Rojos (Agalychnis callidryas)',
            'Mariposa Morfo Azul (Morpho peleides)',
            'Perezoso de Tres Dedos (Bradypus variegatus)',
            'Guacamayo Rojo (Ara macao)',
            'Orquídea Imperial (Cattleya mossiae)',
            'Bromeliad Roja (Guzmania lingulata)',
            'Helecho Arborescente (Cyathea arborea)',
            'Águila Arpía (Harpia harpyja)',
            'Danta (Tapirus bairdii)',
            'Puma (Puma concolor)',
        ]
        
        locations = [
            {'lat': 9.7489, 'lon': -83.7534, 'name': 'Parque Nacional Volcán Poás'},
            {'lat': 10.4636, 'lon': -84.0144, 'name': 'Reserva Biológica Bosque Nuboso Monteverde'},
            {'lat': 9.5489, 'lon': -84.1703, 'name': 'Parque Nacional Manuel Antonio'},
            {'lat': 10.3333, 'lon': -84.8000, 'name': 'Parque Nacional Rincón de la Vieja'},
            {'lat': 8.5389, 'lon': -83.5714, 'name': 'Parque Nacional Corcovado'},
            {'lat': 10.2667, 'lon': -83.8000, 'name': 'Refugio Nacional de Vida Silvestre Caño Negro'},
        ]
        
        # Generar avistamientos para los últimos 6 meses (2025)
        start_date = timezone.now() - timedelta(days=180)
        end_date = timezone.now()
        
        verification_statuses = ['pending', 'verified', 'rejected']
        # Más verificados que pendientes o rechazados
        status_weights = [0.15, 0.75, 0.10]  # 15% pending, 75% verified, 10% rejected
        
        sightings_created = 0
        
        for day in range(180):
            current_date = start_date + timedelta(days=day)
            
            # Generar entre 1-4 avistamientos por día
            num_sightings = random.randint(1, 4)
            
            for _ in range(num_sightings):
                species_name = random.choice(especies)
                location = random.choice(locations)
                student = random.choice(students)
                status = random.choices(verification_statuses, weights=status_weights)[0]
                
                # Crear timestamp con hora aleatoria
                hours = random.randint(6, 18)  # Entre 6 AM y 6 PM
                minutes = random.randint(0, 59)
                timestamp = current_date.replace(hour=hours, minute=minutes)
                
                # Determinar updated_at basado en el status
                if status in ['verified', 'rejected']:
                    # Validado entre 1-7 días después
                    days_to_validate = random.randint(1, 7)
                    updated_at = timestamp + timedelta(days=days_to_validate)
                else:
                    updated_at = timestamp
                
                # Descripciones variadas
                descriptions = [
                    f"Avistamiento de {species_name} en {location['name']}. Observado durante caminata matutina.",
                    f"Encontrado cerca del sendero principal en {location['name']}.",
                    f"Visto en el dosel del bosque. Fotografiado en su hábitat natural.",
                    f"Avistamiento confirmado por guía local en {location['name']}.",
                    f"Espécimen saludable observado en {location['name']}.",
                ]
                
                sighting = Sighting.objects.create(
                    user=student,
                    species=species_name,
                    location=location['name'],
                    latitude=location['lat'] + random.uniform(-0.05, 0.05),
                    longitude=location['lon'] + random.uniform(-0.05, 0.05),
                    description=random.choice(descriptions),
                    verification_status=status,
                    created_at=timestamp,
                    updated_at=updated_at
                )
                sightings_created += 1
        
        # Estadísticas finales
        total_sightings = Sighting.objects.count()
        pending = Sighting.objects.filter(verification_status='pending').count()
        verified = Sighting.objects.filter(verification_status='verified').count()
        rejected = Sighting.objects.filter(verification_status='rejected').count()
        unique_species = Sighting.objects.values('species').distinct().count()
        
        self.stdout.write(self.style.SUCCESS(f'\n✓ Creados {sightings_created} nuevos avistamientos'))
        self.stdout.write(self.style.SUCCESS(f'\n📊 ESTADÍSTICAS TOTALES:'))
        self.stdout.write(f'  Total de avistamientos: {total_sightings}')
        self.stdout.write(f'  Pendientes: {pending}')
        self.stdout.write(f'  Verificados: {verified}')
        self.stdout.write(f'  Rechazados: {rejected}')
        self.stdout.write(f'  Especies únicas: {unique_species}')
        
        if verified > 0:
            approval_rate = (verified / (verified + rejected)) * 100
            self.stdout.write(f'  Tasa de aprobación: {approval_rate:.1f}%')
