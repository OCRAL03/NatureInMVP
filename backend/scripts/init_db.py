import os
import subprocess
import sys
from pathlib import Path

from dotenv import load_dotenv
import psycopg2


def get_env():
    base_dir = Path(__file__).resolve().parents[1]
    env_file = base_dir / '.env'
    if env_file.exists():
        load_dotenv(env_file)
    return {
        'name': os.environ.get('DB_NAME', 'naturein_database'),
        'user': os.environ.get('DB_USER', 'postgres'),
        'password': os.environ.get('DB_PASSWORD', ''),
        'host': os.environ.get('DB_HOST', 'localhost'),
        'port': int(os.environ.get('DB_PORT', '5432')),
    }


def create_database(cfg):
    conn = psycopg2.connect(dbname='postgres', user=cfg['user'], password=cfg['password'], host=cfg['host'], port=cfg['port'])
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname=%s", (cfg['name'],))
    exists = cur.fetchone()
    if not exists:
        cur.execute(f'CREATE DATABASE "{cfg['name']}"')
    cur.close()
    conn.close()


def run_manage(args):
    base_dir = Path(__file__).resolve().parents[1]
    manage = base_dir / 'manage.py'
    subprocess.check_call([sys.executable, str(manage)] + args)


def main():
    cfg = get_env()
    try:
        create_database(cfg)
    except Exception as e:
        print(f'ERROR_DB: {e}')
    try:
        run_manage(['makemigrations'])
        run_manage(['migrate'])
        # Crear usuarios semilla
        from django.contrib.auth import get_user_model
        from authservice.models import UserRole
        User = get_user_model()
        seeds = [
            ('ana_est', 'student'),
            ('luis_doc', 'teacher'),
            ('carla_exp', 'expert'),
        ]
        for username, role in seeds:
            user, created = User.objects.get_or_create(username=username)
            if created:
                user.set_password('naturein123')
                user.save()
            UserRole.objects.get_or_create(user=user, defaults={'role': role})
    except Exception as e:
        print(f'ERROR_MIGRATE: {e}')
    try:
        # Django ORM bootstrap
        base_dir = Path(__file__).resolve().parents[1]
        sys.path.append(str(base_dir))
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'naturein.settings')
        import django
        django.setup()
        from gamifyservice.models import Rank, BadgeDefinition, Mission
        from userservice.models import Institution

        # Seed ranks
        ranks = [
            {'name': 'Explorador', 'min_points': 0},
            {'name': 'Naturalista', 'min_points': 100},
            {'name': 'Guardián', 'min_points': 250},
        ]
        for r in ranks:
            Rank.objects.get_or_create(name=r['name'], defaults={'min_points': r['min_points']})

        # Seed badge definitions
        badges = [
            {'code': 'explorador_50', 'name': 'Explorador de la selva', 'description': 'Alcanza 50 puntos', 'threshold_points': 50},
            {'code': 'naturalista_150', 'name': 'Naturalista en ascenso', 'description': 'Alcanza 150 puntos', 'threshold_points': 150},
            {'code': 'guardian_300', 'name': 'Guardián de la biodiversidad', 'description': 'Alcanza 300 puntos', 'threshold_points': 300},
        ]
        for b in badges:
            BadgeDefinition.objects.get_or_create(code=b['code'], defaults={'name': b['name'], 'description': b['description'], 'threshold_points': b['threshold_points']})

        # Seed missions
        missions = [
            {'title': 'Completa tu primera actividad', 'description': 'Realiza un minijuego y guarda tu progreso', 'reward_points': 30},
            {'title': 'Explora una especie nueva', 'description': 'Lee una ficha y comparte en clase', 'reward_points': 20},
            {'title': 'Participa en el foro', 'description': 'Escribe un comentario sobre una especie', 'reward_points': 15},
        ]
        for m in missions:
            Mission.objects.get_or_create(title=m['title'], defaults={'description': m['description'], 'reward_points': m['reward_points']})
        print('SEED_OK')
    except Exception as e:
        print(f'ERROR_SEED: {e}')

    # Seed institutions from docs
    try:
        docs_path = Path(__file__).resolve().parents[2] / 'docs' / 'Instituciones educativas.md'
        if docs_path.exists():
            content = docs_path.read_text(encoding='utf-8')
            lines = [l.strip() for l in content.splitlines()]
            if lines:
                name = None; itype = ''; address = ''; phone = ''
                def flush():
                    nonlocal name, itype, address, phone
                    if name:
                        Institution.objects.get_or_create(
                            name=name,
                            defaults={'type': itype, 'address': address, 'phone': phone}
                        )
                    name = None; itype = ''; address = ''; phone = ''
                for ln in lines:
                    if ln.startswith('COLEGIO'):
                        flush(); name = ln.strip()
                    elif ln.lower().startswith('público') or ln.lower().startswith('privado'):
                        itype = 'público' if 'público' in ln.lower() else 'privado'
                    elif ln.startswith('Dirección:'):
                        address = ln.replace('Dirección:', '').strip()
                    elif ln.startswith('Teléfono:'):
                        phone = ln.replace('Teléfono:', '').strip()
                flush()
                print('INSTITUTIONS_SEEDED')
            else:
                fallback = [
                    {'name':'COLEGIO 32483 RICARDO PALMA SORIANO','type':'público','address':'CALLE LA BANDERA 260, Rupa Rupa, Leoncio Prado, Huánuco','phone':'563112'},
                    {'name':'COLEGIO SECUNDARIO 32950','type':'público','address':'VILLA RICA, Rupa Rupa, Leoncio Prado, Huánuco','phone':''},
                    {'name':'COLEGIO SECUNDARIO 33164 VENENILLO','type':'público','address':'VENENILLO S/N, Rupa Rupa, Leoncio Prado, Huánuco','phone':''},
                    {'name':'COLEGIO AMAZONAS','type':'privado','address':'JIRON PIURA 1100, Rupa Rupa, Leoncio Prado, Huánuco','phone':''},
                    {'name':'COLEGIO CESAR VALLEJO','type':'público','address':'AVENIDA UNION 1775, Rupa Rupa, Leoncio Prado, Huánuco','phone':'564850'},
                    {'name':'COLEGIO CIENCIAS','type':'privado','address':'JIRON TITO JAIME FERNANDEZ 664, Rupa Rupa, Leoncio Prado, Huánuco','phone':'562921'},
                    {'name':'COLEGIO CIMAFIQ','type':'privado','address':'JIRON CAYUMBA 696, Rupa Rupa, Leoncio Prado, Huánuco','phone':''},
                    {'name':'COLEGIO GALILEO GALILEI','type':'privado','address':'AVENIDA ALAMEDA PERU 1237-1242, Rupa Rupa, Leoncio Prado, Huánuco','phone':''},
                    {'name':'COLEGIO GENERALISIMO JOSE DE SAN MARTIN','type':'privado','address':'AVENIDA JOSE CARLOS MARIATEGUI, Rupa Rupa, Leoncio Prado, Huánuco','phone':'804965'},
                    {'name':'COLEGIO SECUNDARIO GOMEZ ARIAS DAVILA','type':'público','address':'JIRON ENRIQUE PIMENTEL CUADRA 4, Rupa Rupa, Leoncio Prado, Huánuco','phone':'562306'},
                    {'name':'COLEGIO INGENIERIA','type':'privado','address':'AVENIDA ALAMEDA PERU 769, Rupa Rupa, Leoncio Prado, Huánuco','phone':''},
                    {'name':'COLEGIO INTERNACIONAL ELIM','type':'privado','address':'AVENIDA GENERAL SAN MARTIN MZ U LOTE 02, Rupa Rupa, Leoncio Prado, Huánuco','phone':''},
                    {'name':'COLEGIO JAVIER PEREZ DE CUELLAR','type':'privado','address':'JIRON HUANUCO 237-241, Rupa Rupa, Leoncio Prado, Huánuco','phone':'561327'},
                    {'name':'COLEGIO LA SAGRADA FAMILIA FE Y ALEGRIA 64','type':'público','address':'AVENIDA LA BANDERA 241, Rupa Rupa, Leoncio Prado, Huánuco','phone':'562085'},
                    {'name':'COLEGIO LOS LAURELES','type':'público','address':'CALLE LOS LAURELES S/N, Rupa Rupa, Leoncio Prado, Huánuco','phone':''},
                    {'name':'COLEGIO MARIANO BONIN','type':'público','address':'JIRON JULIO BURGA CUADRA 3, Rupa Rupa, Leoncio Prado, Huánuco','phone':'561912'},
                    {'name':'COLEGIO MARISCAL RAMON CASTILLA','type':'público','address':'JIRON TARAPACA 133, Rupa Rupa, Leoncio Prado, Huánuco','phone':'561050'},
                    {'name':'COLEGIO PADRE ABAD','type':'público','address':'JIRON UCAYALI 404, Rupa Rupa, Leoncio Prado, Huánuco','phone':'561546'},
                    {'name':'COLEGIO SAN IGNACIO DE LOYOLA','type':'privado','address':'JIRON BOLOGNESI 166 - 175, Rupa Rupa, Leoncio Prado, Huánuco','phone':''},
                    {'name':'COLEGIO SAN JORGE','type':'público','address':'Rupa Rupa, Leoncio Prado, Huánuco','phone':''},
                ]
                for it in fallback:
                    Institution.objects.get_or_create(name=it['name'], defaults={'type': it['type'], 'address': it['address'], 'phone': it['phone']})
                print('INSTITUTIONS_FALLBACK_SEEDED')
        else:
            print('DOCS_NOT_FOUND')
    except Exception as e:
        print(f'ERROR_INSTITUTIONS: {e}')


if __name__ == '__main__':
    main()
