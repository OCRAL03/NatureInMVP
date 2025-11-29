import os


def is_enabled(flag_name: str, default: bool = False) -> bool:
    """Lee banderas de entorno como ENABLE_GAMIFICATION=true."""
    val = os.getenv(flag_name)
    if val is None:
        return default
    return str(val).lower() in {"1", "true", "yes", "on"}

