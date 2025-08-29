from Conexion.celery.celery_app import celery_app
from Conexion.celery.email import EmailSender
from Conexion.celery.logging_config import logger  

@celery_app.task
def enviar_email_task(asunto: str, mensaje: str, correo):
    '''Tarea de Celery para enviar correos electrónicos'''
    try:
        sender = EmailSender()
        return sender.enviar_email(asunto, mensaje, correo)
    except Exception as e:
        logger.error(f"Fallo al enviar correo a {correo} | Mensaje: {mensaje} | Error: {str(e)}")
        return {"status": "error", "detail": str(e)}

