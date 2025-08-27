from dotenv import load_dotenv
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class EmailSender:
    def __init__(self):
        load_dotenv()
        self.__email = os.getenv("EMAIL_CORREO")
        self.__clave = os.getenv("CLAVE_CORREO")
        self.__smtp_server = "smtp.gmail.com"
        self.__port = 587

    def enviar_email(self, asunto, mensaje, correo):
        try:
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

        except Exception as e:
            print(f"Error al enviar correos: {str(e)}")
            return {"success": False, "message": str(e)}
