import os
import sys


def cleanup():
    print("🧹 Iniciando limpieza de configuración del proyecto...")

    root_req = "requirements.txt"
    inner_req = os.path.join("naturin_project", "requirements.txt")

    # 1. Verificar raíz
    if not os.path.exists(root_req):
        print(f"❌ Error Crítico: No se encuentra {root_req} en la raíz.")
        sys.exit(1)

    # 2. Eliminar redundancia
    if os.path.exists(inner_req):
        try:
            os.remove(inner_req)
            print(f"✅ Eliminado archivo redundante: {inner_req}")
            print("   Ahora el proyecto usa una única fuente de verdad en la raíz.")
        except Exception as e:
            print(f"⚠️  No se pudo eliminar {inner_req}: {e}")
    else:
        print(f"ℹ️  El archivo {inner_req} ya no existe. Todo limpio.")

    print("\n🚀 Estado: Listo para Push.")
    print("   Recuerda ejecutar: pip install -r requirements.txt")


if __name__ == "__main__":
    cleanup()

