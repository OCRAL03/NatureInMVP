"""
Script para poblar la base de datos con datos de prueba para el módulo de expertos
Ejecutar con: python manage.py shell < scripts/populate_expert_data.py
"""
import os
import django
import random
from datetime import datetime, timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'naturein.settings')
django.setup()

from django.contrib.auth import get_user_model
from authservice.models import UserRole
from userservice.models import UserProfile, Sighting

User = get_user_model()

def create_expert_users():
    """Crear usuarios expertos si no existen"""
    print("\n🔬 Creando usuarios expertos...")
    
    experts_data = [
        {
            'username': 'dr_martinez',
            'email': 'martinez@naturein.com',
            'password': 'expert123',
            'full_name': 'Dr. Carlos Martínez',
            'study_area': 'botany',
            'institution': 'Universidad Nacional',
            'bio': 'Especialista en flora nativa con 15 años de experiencia en clasificación taxonómica.'
        },
        {
            'username': 'dra_lopez',
            'email': 'lopez@naturein.com',
            'password': 'expert123',
            'full_name': 'Dra. María López',
            'study_area': 'zoology',
            'institution': 'Instituto de Biodiversidad',
            'bio': 'Experta en fauna silvestre y conservación de especies en peligro.'
        },
        {
            'username': 'dr_garcia',
            'email': 'garcia@naturein.com',
            'password': 'expert123',
            'full_name': 'Dr. Juan García',
            'study_area': 'entomology',
            'institution': 'Museo de Historia Natural',
            'bio': 'Investigador especializado en insectos y artrópodos de Centroamérica.'
        }
    ]
    
    created_experts = []
    
    for expert_data in experts_data:
        username = expert_data['username']
        
        # Verificar si ya existe
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            print(f"  ✓ Usuario {username} ya existe")
        else:
            user = User.objects.create_user(
                username=username,
                email=expert_data['email'],
                password=expert_data['password']
            )
            print(f"  ✓ Creado usuario: {username}")
        
        # Asignar rol de experto
        UserRole.objects.update_or_create(
            user=user,
            defaults={'role': 'expert'}
        )
        
        # Crear o actualizar perfil
        profile, created = UserProfile.objects.update_or_create(
            user=user,
            defaults={
                'full_name': expert_data['full_name'],
                'study_area': expert_data['study_area'],
                'institution': expert_data['institution'],
                'bio': expert_data['bio']
            }
        )
        
        created_experts.append(user)
        print(f"  ✓ Perfil configurado para {expert_data['full_name']}")
    
    print(f"\n✅ {len(created_experts)} expertos configurados\n")
    return created_experts


def create_student_users():
    """Crear usuarios estudiantes para avistamientos"""
    print("👨‍🎓 Creando usuarios estudiantes...")
    
    students_data = [
        {'username': 'ana_student', 'email': 'ana@student.com', 'full_name': 'Ana Rodríguez'},
        {'username': 'luis_student', 'email': 'luis@student.com', 'full_name': 'Luis Fernández'},
        {'username': 'sofia_student', 'email': 'sofia@student.com', 'full_name': 'Sofía Castro'},
        {'username': 'diego_student', 'email': 'diego@student.com', 'full_name': 'Diego Morales'},
    ]
    
    students = []
    
    for student_data in students_data:
        username = student_data['username']
        
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
        else:
            user = User.objects.create_user(
                username=username,
                email=student_data['email'],
                password='student123'
            )
        
        UserRole.objects.update_or_create(
            user=user,
            defaults={'role': 'student'}
        )
        
        UserProfile.objects.update_or_create(
            user=user,
            defaults={'full_name': student_data['full_name']}
        )
        
        students.append(user)
        print(f"  ✓ Estudiante: {student_data['full_name']}")
    
    print(f"\n✅ {len(students)} estudiantes configurados\n")
    return students


def create_sightings(students):
    """Crear avistamientos de prueba"""
    print("🦋 Creando avistamientos de prueba...")
    
    species_data = [
        # Aves
        {'common_name': 'Quetzal', 'scientific_name': 'Pharomachrus mocinno', 'kingdom': 'Animalia'},
        {'common_name': 'Tucán pico iris', 'scientific_name': 'Ramphastos sulfuratus', 'kingdom': 'Animalia'},
        {'common_name': 'Águila harpía', 'scientific_name': 'Harpia harpyja', 'kingdom': 'Animalia'},
        {'common_name': 'Colibrí garganta rubí', 'scientific_name': 'Archilochus colubris', 'kingdom': 'Animalia'},
        
        # Mamíferos
        {'common_name': 'Jaguar', 'scientific_name': 'Panthera onca', 'kingdom': 'Animalia'},
        {'common_name': 'Perezoso de tres dedos', 'scientific_name': 'Bradypus variegatus', 'kingdom': 'Animalia'},
        {'common_name': 'Mono aullador', 'scientific_name': 'Alouatta palliata', 'kingdom': 'Animalia'},
        
        # Plantas
        {'common_name': 'Orquídea Guarianthe', 'scientific_name': 'Guarianthe skinneri', 'kingdom': 'Plantae'},
        {'common_name': 'Ceiba', 'scientific_name': 'Ceiba pentandra', 'kingdom': 'Plantae'},
        {'common_name': 'Heliconias', 'scientific_name': 'Heliconia rostrata', 'kingdom': 'Plantae'},
        
        # Insectos
        {'common_name': 'Mariposa morpho azul', 'scientific_name': 'Morpho peleides', 'kingdom': 'Animalia'},
        {'common_name': 'Escarabajo rinoceronte', 'scientific_name': 'Megasoma elephas', 'kingdom': 'Animalia'},
        
        # Reptiles
        {'common_name': 'Iguana verde', 'scientific_name': 'Iguana iguana', 'kingdom': 'Animalia'},
        {'common_name': 'Boa constrictor', 'scientific_name': 'Boa constrictor', 'kingdom': 'Animalia'},
        
        # Anfibios
        {'common_name': 'Rana de ojos rojos', 'scientific_name': 'Agalychnis callidryas', 'kingdom': 'Animalia'},
    ]
    
    locations = [
        {'lat': 9.748917, 'lon': -83.753428, 'location': 'Parque Nacional Volcán Poás'},
        {'lat': 10.463731, 'lon': -84.003601, 'location': 'Reserva Biológica Bosque Nuboso Monteverde'},
        {'lat': 9.561524, 'lon': -83.824291, 'location': 'Parque Nacional Manuel Antonio'},
        {'lat': 8.537981, 'lon': -83.484354, 'location': 'Parque Nacional Corcovado'},
        {'lat': 10.263418, 'lon': -83.785324, 'location': 'Parque Nacional Tortuguero'},
    ]
    
    statuses = ['pending', 'verified', 'rejected']
    status_weights = [30, 60, 10]  # 30% pending, 60% verified, 10% rejected
    
    accuracies = ['low', 'medium', 'high']
    accuracy_weights = [15, 35, 50]  # Mayor probabilidad de alta precisión
    
    sightings_created = 0
    
    # Crear avistamientos de los últimos 90 días
    for i in range(100):  # 100 avistamientos
        student = random.choice(students)
        species = random.choice(species_data)
        location = random.choice(locations)
        
        # Fecha aleatoria en los últimos 90 días
        days_ago = random.randint(0, 90)
        sighting_date = timezone.now() - timedelta(days=days_ago)
        
        status_choice = random.choices(statuses, weights=status_weights)[0]
        accuracy = random.choices(accuracies, weights=accuracy_weights)[0]
        
        # Crear avistamiento
        sighting = Sighting.objects.create(
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
            notes=f"Avistamiento de {species['common_name']} en {location['location']}. Observado durante una salida de campo.",
            created_at=sighting_date,
            updated_at=sighting_date if status_choice == 'pending' else sighting_date + timedelta(hours=random.randint(1, 48))
        )
        
        sightings_created += 1
        
        if sightings_created % 20 == 0:
            print(f"  ✓ {sightings_created} avistamientos creados...")
    
    print(f"\n✅ Total de {sightings_created} avistamientos creados")
    
    # Mostrar resumen por estado
    pending_count = Sighting.objects.filter(verification_status='pending').count()
    verified_count = Sighting.objects.filter(verification_status='verified').count()
    rejected_count = Sighting.objects.filter(verification_status='rejected').count()
    
    print(f"\n📊 Resumen de avistamientos:")
    print(f"  • Pendientes: {pending_count}")
    print(f"  • Verificados: {verified_count}")
    print(f"  • Rechazados: {rejected_count}")
    print(f"  • Total: {pending_count + verified_count + rejected_count}\n")


def main():
    """Ejecutar población de datos"""
    print("\n" + "="*60)
    print("🌿 POBLAR BASE DE DATOS - MÓDULO DE EXPERTOS")
    print("="*60 + "\n")
    
    # Crear expertos
    experts = create_expert_users()
    
    # Crear estudiantes
    students = create_student_users()
    
    # Crear avistamientos
    create_sightings(students)
    
    print("="*60)
    print("✅ POBLACIÓN COMPLETADA EXITOSAMENTE")
    print("="*60 + "\n")
    
    print("📝 Credenciales de acceso:")
    print("\nExpertos:")
    print("  Usuario: dr_martinez | Contraseña: expert123")
    print("  Usuario: dra_lopez   | Contraseña: expert123")
    print("  Usuario: dr_garcia   | Contraseña: expert123")
    print("\nEstudiantes:")
    print("  Usuario: ana_student | Contraseña: student123")
    print("  Usuario: luis_student | Contraseña: student123")
    print("\n")

if __name__ == '__main__':
    main()
