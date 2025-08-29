import random
from Conexion.celery.tasks import enviar_email_task
from Conexion.celery.celery_app import celery_app
from ruleta.models import Cliente, Pedido
from sqlalchemy.orm import Session
import pandas as pd
import datetime


class Ruleta:
    
    ''' Clase que se encarga de llevar a cabo toda la logica interna del proceso del juego  
        Cuando se inicializa, esta crea una variable interna titulada "OPCIONES" en la cual va a estar todas las opciones de premios.
    '''
    
    def __init__ (self,):
        self.OPCIONES = {
            "1": {
                "rango": {"inicial": 20000000, "final": float('inf')},
                "premios": ["NO PREMIO", "5 LLAVEROS", "NO PREMIO", "DTO. 5%", "5 LLAVEROS", "NO PREMIO", "DTO. 6%", "5 LLAVEROS", "DTO. 4%"]
            },
            "2": {
                "rango": {"inicial": 10000000, "final": 20000000},
                "premios": ["NO PREMIO", "5 LLAVEROS", "NO PREMIO", "DTO. 4%", "5 LLAVEROS", "NO PREMIO", "DTO. 5%", "5 LLAVEROS", "DTO. 3%"]
            },
            "3": {
                "rango": {"inicial": 5000000, "final": 10000000},
                "premios": ["NO PREMIO", "5 LLAVEROS", "NO PREMIO", "DTO. 3%", "5 LLAVEROS", "NO PREMIO", "DTO. 4%", "5 LLAVEROS", "DTO. 2%"]
            },
            "0": {
                "rango": {"inicial": 500000, "final": 1000000},
                "premios": ["NO PREMIO", "1 LLAVEROS", "NO PREMIO", "DTO. 2%", "2 LLAVEROS", "NO PREMIO", "DTO. 3%", "1 LLAVEROS", "DTO. 1%"]
            }
        }
    
    def ingresar_monto(self, monto: float) -> None:
        '''
        En espera de las variables:  
        monto: hace referencia a el valor del pedido realizado por el cliente u usuario  
        \nSe define la variable interna "monto"
        '''
        if not isinstance(monto, (int, float)) or monto <= 0:
            raise ValueError("El monto debe ser un número positivo")
        self.monto = monto
    
    def calcular_premio(self, ):
        '''
            Con base en el monto ingresado, se determina a que rango pertenece y se devuelven los premios asociados a ese rango  
            DEVUELVE una lista de premio ( [] )
        '''
        premios = []
        for rango, opcion in self.OPCIONES.items():
            if self.monto >= opcion["rango"]["inicial"] and (opcion["rango"]["final"] is None or self.monto < opcion["rango"]["final"]):
                premios = opcion["premios"]
                break
        
        return premios
    
    def calcular_resultado(self, premios = []):
        '''
            Con base en los premios disponibles, se determina el resultado de la ruleta\n
            las variables que recibe son:
                premios: lista de premios disponibles  
            \n\nDEVUELVE: el índice (tipo int) y el premio (tipo string) seleccionado de forma aleatoria
        '''
        numero_flotante_aleatorio = random.random()
    
        for i in range(len(premios)):
            if numero_flotante_aleatorio <= ((i + 1)/len(premios)):
                print(numero_flotante_aleatorio)
                resultado = premios[i]
                n_resultado = i
                break   
        
        return n_resultado, resultado

    def enviar_email(self, resultado, fecha, monto, nit, n_pedido) -> None:
        '''
            Envía un correo electrónico a los emails registrados con el resultado de la ruleta\n
            Las variables a recibir son:\n
                resultado: El resultado de la ruleta
                fecha: La fecha en que se realizó el pedido
                monto: El monto del pedido
                nit: El NIT del cliente
                n_pedido: El número de pedido
        '''
        asunto = f"🎉 Nuevo resultado de la Ruleta de Premios | Pedido: {n_pedido}"

        mensaje = f"""
        <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f4f6f8;
                        padding: 20px;
                        margin: 0;
                    }}
                    .card {{
                        background: #ffffff;
                        border-radius: 12px;
                        padding: 25px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        max-width: 650px;
                        margin: auto;
                    }}
                    h2 {{
                        color: #007bff;
                        margin-bottom: 15px;
                        text-align: center;
                    }}
                    p {{
                        font-size: 15px;
                        color: #333;
                        margin: 5px 0;
                    }}
                    table {{
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        font-size: 14px;
                    }}
                    th, td {{
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: center;
                    }}
                    th {{
                        background-color: #007bff;
                        color: white;
                        font-weight: bold;
                    }}
                    tr:nth-child(even) {{
                        background-color: #f9f9f9;
                    }}
                    .highlight {{
                        font-size: 16px;
                        font-weight: bold;
                        color: #28a745;
                    }}
                    .footer {{
                        margin-top: 20px;
                        font-size: 12px;
                        color: #666;
                        text-align: center;
                    }}
                </style>
            </head>
            <body>
                <div class="card">
                    <h2>📢 Registro de resultado en la Ruleta de Premios</h2>
                    <p><strong>Cliente NIT:</strong> {nit}</p>
                    <p>Se ha generado un nuevo resultado que debe ser registrado en el sistema de premios.</p>
                    <table>
                        <tr>
                            <th>Pedido</th>
                            <th>NIT</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                            <th>Premio obtenido</th>
                        </tr>
                        <tr>
                            <td>{n_pedido}</td>
                            <td>{nit}</td>
                            <td>${monto:,.2f}</td>
                            <td>{fecha}</td>
                            <td class="highlight">{resultado}</td>
                        </tr>
                    </table>
                    <p class="footer">⚙️ Correo interno generado automáticamente por el sistema de Ruleta de Premios.</p>
                </div>
            </body>
        </html>
        """


        correos = [
            "analista@cdr.net.co"
        ]
        
        for correo in correos:
            print(f"DEBUG: Encolando envío para {correo} con broker {celery_app.conf.broker_url}")
            enviar_email_task.delay(asunto, mensaje, correo)

    def generar_excel(self, db: Session):
        ''' 
            Genera un excel resumen de todos los pedidos que se encuentran en la base de datos  
            db: objeto de tipo Session que tiene como funcion servir de conexión a la base de datos
        '''
        try:
            datos = (
                db.query(
                    Cliente.nit,
                    Pedido.n_pedido,
                    Pedido.monto,
                    Pedido.celular,
                    Pedido.premio,
                    Pedido.fecha
                )
                .join(Pedido, Cliente.nit == Pedido.nit)
                .all()
            )
            
            dataframe = pd.DataFrame(datos, columns=["nit", "n_pedido", "monto", "celular", "premio", "fecha"])
            
            # Ruta en el contenedor que está montada a tu máquina
            output_path = "/app/export/reporte.xlsx"

            dataframe.to_excel(output_path, index=False)

            print(f"Excel guardado en: {output_path}")
        except Exception as e:
            print(e)
            return False
        
        return True