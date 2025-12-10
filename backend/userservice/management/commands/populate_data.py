"""
Comando de Django para poblar la base de datos con datos de prueba
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from authservice.models import UserRole
from userservice.models import UserProfile, Sighting
import random
from datetime import timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Poblar la base de datos con datos de prueba para el modulo de expertos'

    def handle(self, *args, **options):
        self.stdout.write("\n" + "="*60)
        self.stdout.write("🌿 POBLAR BASE DE DATOS - MODULO DE EXPERTOS")
        self.stdout.write("="*60 + "\n")
        
        # Crear expertos
        self.create_experts()
        
        # Crear estudiantes
        students = self.create_students()
        
        # Crear avistamientos
        self.create_sightings(students)
        
        self.stdout.write("\n" + "="*60)
        self.stdout.write(self.style.SUCCESS("✅ POBLACION COMPLETADA EXITOSAMENTE"))
        self.stdout.write("="*60 + "\n")
        
        self.stdout.write("\n📝 Credenciales de acceso:")
        self.stdout.write("\nExpertos:")
        self.stdout.write("  Usuario: dr_martinez | Contraseña: expert123")
        self.stdout.write("  Usuario: dra_lopez   | Contraseña: expert123")
        self.stdout.write("\nEstudiantes:")
        self.stdout.write("  Usuario: ana_student | Contraseña: student123\n")

    def create_experts(self):
        self.stdout.write("\n🔬 Creando usuarios expertos...")
        
        experts_data = [
            {
                'username': 'dr_martinez',
                'email': 'martinez@naturein.com',
                'password': 'expert123',
                'full_name': 'Dr. Carlos Martinez',
                'study_area': 'botany',
                'institution': 'Universidad Nacional',
                'bio': 'Especialista en flora nativa con 15 años de experiencia.'
            },
            {
                'username': 'dra_lopez',
                'email': 'lopez@naturein.com',
                'password': 'expert123',
                'full_name': 'Dra. Maria Lopez',
                'study_area': 'zoology',
                'institution': 'Instituto de Biodiversidad',
                'bio': 'Experta en fauna silvestre y conservacion de especies.'
            },
        ]
        
        for expert_data in experts_data:
            user, created = User.objects.get_or_create(
                username=expert_data['username'],
                defaults={'email': expert_data['email']}
            )
            if created:
                user.set_password(expert_data['password'])
                user.save()
            
            UserRole.objects.update_or_create(
                user=user,
                defaults={'role': 'expert'}
            )
            
            UserProfile.objects.update_or_create(
                user=user,
                defaults={
                    'full_name': expert_data['full_name'],
                    'study_area': expert_data['study_area'],
                    'institution': expert_data['institution'],
                    'bio': expert_data['bio']
                }
            )
            self.stdout.write(f"  ✓ {expert_data['full_name']}")
        
        self.stdout.write(self.style.SUCCESS(f"\n✅ {len(experts_data)} expertos configurados\n"))

    def create_students(self):
        self.stdout.write("👨‍🎓 Creando usuarios estudiantes...")
        
        students_data = [
            {'username': 'ana_student', 'email': 'ana@student.com', 'full_name': 'Ana Rodriguez'},
            {'username': 'luis_student', 'email': 'luis@student.com', 'full_name': 'Luis Fernandez'},
            {'username': 'sofia_student', 'email': 'sofia@student.com', 'full_name': 'Sofia Castro'},
        ]
        
        students = []
        for student_data in students_data:
            user, created = User.objects.get_or_create(
                username=student_data['username'],
                defaults={'email': student_data['email']}
            )
            if created:
                user.set_password('student123')
                user.save()
            
            UserRole.objects.update_or_create(
                user=user,
                defaults={'role': 'student'}
            )
            
            UserProfile.objects.update_or_create(
                user=user,
                defaults={'full_name': student_data['full_name']}
            )
            students.append(user)
            self.stdout.write(f"  ✓ {student_data['full_name']}")
        
        self.stdout.write(self.style.SUCCESS(f"\n✅ {len(students)} estudiantes configurados\n"))
        return students

    def create_sightings(self, students):
        self.stdout.write("🦋 Creando avistamientos de prueba...")
        
        species_data = [
            'Quetzal (Pharomachrus mocinno)',
            'Tucan pico iris (Ramphastos sulfuratus)',
            'Jaguar (Panthera onca)',
            'Perezoso (Bradypus variegatus)',
            'Orquidea Guarianthe (Guarianthe skinneri)',
            'Ceiba (Ceiba pentandra)',
            'Mariposa morpho azul (Morpho peleides)',
            'Rana de ojos rojos (Agalychnis callidryas)',
        ]
        
        locations = [
            'Parque Nacional Volcan Poas',
            'Reserva Monteverde',
            'Parque Manuel Antonio',
        ]
        
        statuses = ['pending', 'verified', 'rejected']
        status_weights = [30, 60, 10]
        
        for i in range(80):
            student = random.choice(students)
            species = random.choice(species_data)
            location = random.choice(locations)
            
            days_ago = random.randint(0, 90)
            
            status_choice = random.choices(statuses, weights=status_weights)[0]
            
            # Coordenadas aproximadas para Costa Rica
            lat = round(9.0 + random.uniform(0, 2), 6)
            lon = round(-84.0 + random.uniform(0, 1), 6)
            
            Sighting.objects.create(
                user=student,
                species=species,
                location=location,
                description=f"Avistamiento de {species} durante una salida de campo. Observado en {location}.",
                latitude=lat,
                longitude=lon,
                verification_status=status_choice
            )
            
            if (i + 1) % 20 == 0:
                self.stdout.write(f"  ✓ {i + 1} avistamientos creados...")
        
        self.stdout.write(self.style.SUCCESS("\n✅ Total de 80 avistamientos creados"))
        
        # Resumen
        pending_count = Sighting.objects.filter(verification_status='pending').count()
        verified_count = Sighting.objects.filter(verification_status='verified').count()
        rejected_count = Sighting.objects.filter(verification_status='rejected').count()
        
        self.stdout.write(f"\n📊 Resumen de avistamientos:")
        self.stdout.write(f"  • Pendientes: {pending_count}")
        self.stdout.write(f"  • Verificados: {verified_count}")
        self.stdout.write(f"  • Rechazados: {rejected_count}")
