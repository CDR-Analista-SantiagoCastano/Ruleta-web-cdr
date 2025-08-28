from Conexion.celery.celery_app import celery_app
from Conexion.celery.email import EmailSender

@celery_app.task
def enviar_email_task(asunto: str, mensaje: str, correo):
    '''Tarea de Celery para enviar correos electrónicos'''
    sender = EmailSender()
    return sender.enviar_email(asunto, mensaje, correo)
