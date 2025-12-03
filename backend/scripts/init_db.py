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
    except Exception as e:
        print(f'ERROR_MIGRATE: {e}')


if __name__ == '__main__':
    main()
