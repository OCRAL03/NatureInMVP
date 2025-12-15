"""
Script simple para poblar la base de datos
Ejecutar con: python populate_db.py
"""
import os
import sys
import django
import random
from datetime import datetime, timedelta

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'naturein.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from authservice.models import Role
from userservice.models import UserProfile, Sighting

User = get_user_model()

print("\n" + "="*60)
print("🌿 POBLAR BASE DE DATOS - MÓDULO DE EXPERTOS")
print("="*60 + "\n")

# 1. Crear roles
print("📋 Configurando roles...")
expert_role, _ = Role.objects.get_or_create(
    role='expert',
    defaults={'description': 'Experto científico en biodiversidad'}
)
student_role, _ = Role.objects.get_or_create(
    role='student',
    defaults={'description': 'Estudiante'}
)
print("  ✓ Roles configurados\n")

# 2. Crear expertos
print("🔬 Creando usuarios expertos...")
experts_data = [
    {
        'username': 'dr_martinez',
        'email': 'martinez@naturein.com',
        'password': 'expert123',
        'full_name': 'Dr. Carlos Martínez',
        'study_area': 'botany',
        'institution': 'Universidad Nacional',
        'bio': 'Especialista en flora nativa con 15 años de experiencia.'
    },
    {
        'username': 'dra_lopez',
        'email': 'lopez@naturein.com',
        'password': 'expert123',
        'full_name': 'Dra. María López',
        'study_area': 'zoology',
        'institution': 'Instituto de Biodiversidad',
        'bio': 'Experta en fauna silvestre y conservación de especies.'
    },
]

for expert_data in experts_data:
    user, created = User.objects.get_or_create(
        username=expert_data['username'],
        defaults={
            'email': expert_data['email']
        }
    )
    if created:
        user.set_password(expert_data['password'])
    user.role = expert_role
    user.save()
    
    UserProfile.objects.update_or_create(
        user=user,
        defaults={
            'full_name': expert_data['full_name'],
            'study_area': expert_data['study_area'],
            'institution': expert_data['institution'],
            'bio': expert_data['bio']
        }
    )
    print(f"  ✓ {expert_data['full_name']}")

print(f"\n✅ {len(experts_data)} expertos configurados\n")

# 3. Crear estudiantes
print("👨‍🎓 Creando usuarios estudiantes...")
students_data = [
    {'username': 'ana_student', 'email': 'ana@student.com', 'full_name': 'Ana Rodríguez'},
    {'username': 'luis_student', 'email': 'luis@student.com', 'full_name': 'Luis Fernández'},
    {'username': 'sofia_student', 'email': 'sofia@student.com', 'full_name': 'Sofía Castro'},
]

students = []
for student_data in students_data:
    user, created = User.objects.get_or_create(
        username=student_data['username'],
        defaults={'email': student_data['email']}
    )
    if created:
        user.set_password('student123')
    user.role = student_role
    user.save()
    
    UserProfile.objects.update_or_create(
        user=user,
        defaults={'full_name': student_data['full_name']}
    )
    students.append(user)
    print(f"  ✓ {student_data['full_name']}")

print(f"\n✅ {len(students)} estudiantes configurados\n")

# 4. Crear avistamientos
print("🦋 Creando avistamientos de prueba...")

species_data = [
    {'common_name': 'Quetzal', 'scientific_name': 'Pharomachrus mocinno', 'kingdom': 'Animalia'},
    {'common_name': 'Tucán pico iris', 'scientific_name': 'Ramphastos sulfuratus', 'kingdom': 'Animalia'},
    {'common_name': 'Jaguar', 'scientific_name': 'Panthera onca', 'kingdom': 'Animalia'},
    {'common_name': 'Perezoso', 'scientific_name': 'Bradypus variegatus', 'kingdom': 'Animalia'},
    {'common_name': 'Orquídea', 'scientific_name': 'Guarianthe skinneri', 'kingdom': 'Plantae'},
    {'common_name': 'Ceiba', 'scientific_name': 'Ceiba pentandra', 'kingdom': 'Plantae'},
    {'common_name': 'Mariposa morpho', 'scientific_name': 'Morpho peleides', 'kingdom': 'Animalia'},
    {'common_name': 'Rana de ojos rojos', 'scientific_name': 'Agalychnis callidryas', 'kingdom': 'Animalia'},
]

locations = [
    {'lat': 9.748917, 'lon': -83.753428, 'location': 'Parque Nacional Volcán Poás'},
    {'lat': 10.463731, 'lon': -84.003601, 'location': 'Reserva Monteverde'},
    {'lat': 9.561524, 'lon': -83.824291, 'location': 'Parque Manuel Antonio'},
]

statuses = ['pending', 'verified', 'rejected']
status_weights = [30, 60, 10]

for i in range(80):
    student = random.choice(students)
    species = random.choice(species_data)
    location = random.choice(locations)
    
    days_ago = random.randint(0, 90)
    sighting_date = timezone.now() - timedelta(days=days_ago)
    
    status_choice = random.choices(statuses, weights=status_weights)[0]
    
    Sighting.objects.create(
        user=student,
        common_name=species['common_name'],
        scientific_name=species['scientific_name'],
        kingdom=species['kingdom'],
        latitude=location['lat'],
        longitude=location['lon'],
        location_name=location['location'],
        sighting_date=sighting_date,
        verification_status=status_choice,
        confidence_score=random.uniform(0.7, 0.99),
        notes=f"Avistamiento de {species['common_name']}",
        created_at=sighting_date,
        updated_at=sighting_date
    )
    
    if (i + 1) % 20 == 0:
        print(f"  ✓ {i + 1} avistamientos creados...")

print(f"\n✅ Total de 80 avistamientos creados")

# Resumen
pending_count = Sighting.objects.filter(verification_status='pending').count()
verified_count = Sighting.objects.filter(verification_status='verified').count()
rejected_count = Sighting.objects.filter(verification_status='rejected').count()

print(f"\n📊 Resumen de avistamientos:")
print(f"  • Pendientes: {pending_count}")
print(f"  • Verificados: {verified_count}")
print(f"  • Rechazados: {rejected_count}")

print("\n" + "="*60)
print("✅ POBLACIÓN COMPLETADA EXITOSAMENTE")
print("="*60 + "\n")

print("📝 Credenciales de acceso:")
print("\nExpertos:")
print("  Usuario: dr_martinez | Contraseña: expert123")
print("  Usuario: dra_lopez   | Contraseña: expert123")
print("\nEstudiantes:")
print("  Usuario: ana_student | Contraseña: student123")
print("\n")
