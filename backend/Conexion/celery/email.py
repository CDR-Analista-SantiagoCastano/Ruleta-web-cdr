from dotenv import load_dotenv
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class EmailSender:
    '''Clase encargada de enviar correos electrónicos'''
    
    def __init__(self):
        load_dotenv()
        self.__email = os.getenv("EMAIL_CORREO")
        self.__clave = os.getenv("CLAVE_CORREO")
        self.__smtp_server = "smtp.gmail.com"
        self.__port = 587

    def enviar_email(self, asunto, mensaje, correo):
        '''
            Recibe un mensaje en formato HTML y lo envía al correo especificado\n
            Las variables que recibe son\n
                asunto: El asunto del correo\n
                mensaje: El contenido del correo en formato HTML\n
                correo: El correo electrónico del destinatario\n
        '''
        servidor = smtplib.SMTP(self.__smtp_server, self.__port)
        servidor.starttls()
        servidor.login(self.__email, self.__clave)
        
        msg = MIMEMultipart("alternative")
        msg["From"] = self.__email
        msg["To"] = correo
        msg["Subject"] = asunto
        msg.attach(MIMEText(mensaje, "html"))
        servidor.sendmail(self.__email, correo, msg.as_string())

        servidor.quit()
        print("Mensajes enviados con éxito ✅")
        return {"success": True, "message": ""}
