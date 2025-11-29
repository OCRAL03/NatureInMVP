import subprocess
import sys
from datetime import datetime


def run_command(command: str, error_message: str):
    try:
        print(f" Ejecutando: {command}")
        subprocess.check_call(command, shell=True)
        print("Éxito.")
    except subprocess.CalledProcessError:
        print(f"ERROR: {error_message}")
        sys.exit(1)


def main():
    print("INICIANDO PROTOCOLO DE MERGE SEGURO (SANDBOX)")
    print("-------------------------------------------------------")

    # Configuración
    rama_principal = "Education-Multimedia"
    rama_remota = "origin/FeatureLTIGames"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    rama_backup = f"backup/{rama_principal}_{timestamp}"
    rama_sandbox = "sandbox-integration"

    # 1. Asegurar estado limpio
    print("\n[Paso 1/6] Asegurando entorno de trabajo...")
    run_command(f"git checkout {rama_principal}", "No se pudo cambiar a la rama principal.")
    run_command("git pull origin " + rama_principal, "No se pudo actualizar la rama local.")

    # 2. Crear Backup
    print(f"\n[Paso 2/6] Creando punto de restauración: {rama_backup}")
    run_command(f"git branch {rama_backup}", "Falló la creación del backup.")

    # 3. Preparar Sandbox
    print("\n[Paso 3/6] Configurando Sandbox...")
    # Si existe sandbox anterior, eliminarlo (ignorar errores)
    subprocess.call(f"git branch -D {rama_sandbox}", shell=True)
    run_command(f"git checkout -b {rama_sandbox}", "No se pudo crear la rama sandbox.")

    # 4. Fusión (Merge)
    print(f"\n[Paso 4/6] Fusionando {rama_remota} en Sandbox...")
    run_command("git fetch origin", "No se pudo obtener referencias remotas.")

    try:
        subprocess.check_call(
            f"git merge {rama_remota} --allow-unrelated-histories --no-commit",
            shell=True,
        )
        print("Merge preparado (sin commit).")
    except subprocess.CalledProcessError:
        print("⚠ CONFLICTOS DETECTADOS. Por favor resuélvelos manualmente en tu editor.")
        print("   Una vez resueltos, haz commit y corre este script de nuevo (o continúa manual).")
        sys.exit(1)

    # 5. Validación Automática
    print("\n[Paso 5/6] Ejecutando pruebas de seguridad...")
    run_command("pip install -r requirements.txt", "Error instalando dependencias.")
    run_command("python manage.py migrate", "Error en migraciones.")

    try:
        subprocess.check_call(
            "python manage.py test app_education.tests.test_api_integration",
            shell=True,
        )
        print("¡TESTS DE INTEGRACIÓN PASARON!")
    except subprocess.CalledProcessError:
        print(" LOS TESTS FALLARON. El merge ha roto la lógica estricta.")
        print("   Acción: Revisa el código. Tu rama principal sigue segura.")
        sys.exit(1)

    # 6. Consolidación (Solo si todo pasó)
    confirm = input("\nTodo parece correcto. ¿Deseas aplicar los cambios a la rama principal? (s/n): ")
    if confirm.strip().lower() == "s":
        print("\n[Paso 6/6] Consolidando cambios...")
        run_command(f"git checkout {rama_principal}", "Error volviendo a rama principal.")
        run_command(f"git merge {rama_sandbox}", "Error en el merge final.")
        run_command(f"git branch -D {rama_sandbox}", "Error limpiando sandbox.")
        print("\n INTEGRACIÓN EXITOSA. Listo para hacer push.")
        print(f"   (Recuerda: Tienes un backup en '{rama_backup}' si lo necesitas)")
    else:
        print("\nOperación cancelada. Estás en la rama sandbox para inspección manual.")


if __name__ == "__main__":
    main()

