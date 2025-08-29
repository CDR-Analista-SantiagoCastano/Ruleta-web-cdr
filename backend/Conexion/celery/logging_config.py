import logging
from logging.handlers import RotatingFileHandler
import os

log_dir = "/app/logs"
os.makedirs(log_dir, exist_ok=True)

log_path = os.path.join(log_dir, "fallos_envio_email.log")

handler = RotatingFileHandler(
    log_path,
    maxBytes=1024 * 1024,
    backupCount=5
)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

logger = logging.getLogger("email_logger")
logger.setLevel(logging.ERROR)
logger.addHandler(handler)

