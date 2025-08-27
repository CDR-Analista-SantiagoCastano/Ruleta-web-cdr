from celery import Celery
from dotenv import load_dotenv
import os

load_dotenv()

celery_app = Celery(
    "cdr_app",
    broker=os.getenv("BROKER_URL"),
    backend=os.getenv("RESULT_BACKEND"),
    include=["Conexion.celery.tasks"],
)

# Cargar configuración desde el archivo
celery_app.conf.update(
    task_serializer=os.getenv("TASK_SERIALIZER", "json"),
    result_serializer=os.getenv("RESULT_SERIALIZER", "json"),
    accept_content=[os.getenv("ACCEPT_CONTENT", "json")],
    enable_utc=os.getenv("ENABLE_UTC", "True").lower() in ("true", "1", "yes"),
)