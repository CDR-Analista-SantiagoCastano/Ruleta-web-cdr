from datetime import datetime

try:
    from zoneinfo import ZoneInfo
except ImportError:
    from pytz import timezone as ZoneInfo

def now_colombia():
    """Devuelve la hora actual en zona horaria de Colombia, sin información de zona (naive)."""
    try:
        return datetime.now(ZoneInfo("America/Bogota")).replace(tzinfo=None)
    except:
        return datetime.now().replace(tzinfo=None)