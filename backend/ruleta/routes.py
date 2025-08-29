from fastapi import APIRouter, Depends, HTTPException, Response, Request, Cookie
from sqlalchemy.orm import Session
from Conexion.db import get_db
from ruleta.models import Cliente, Pedido
from ruleta.schema import DatosClienteRequest
from utils import now_colombia
from ruleta.ruleta import Ruleta
import uuid, json
from Conexion.redis.db import RedisDB


ruleta = APIRouter()
SESSION_EXPIRATION = 60*10  # 10 minutos

redis_client = RedisDB()

@ruleta.post("/opciones")
def opciones_ruleta(
    data: DatosClienteRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Endpoint para obtener la lista de opciones de la ruleta
    Se genera un session_id seguro que se guarda en Redis y se envía en cookie HttpOnly
    """
    pedido = db.query(Pedido).filter(Pedido.n_pedido == data.n_pedido).first()
    if pedido:
        raise HTTPException(status_code=401, detail="El pedido ya ha participado en el concurso")

    ruleta_obj = Ruleta()
    ruleta_obj.ingresar_monto(data.monto)

    premios = ruleta_obj.calcular_premio()
    if len(premios) == 0:
        raise HTTPException(status_code=401, detail="No estás dentro del rango permitido")

    # Generar session_id
    session_id = str(uuid.uuid4())

    # Guardar en Redis
    session_data = {
        "nit": data.nit,
        "n_pedido": data.n_pedido,
        "monto": data.monto,
        "celular": str(data.celular),
        "premios": premios,
        "coordenadas": data.coordenadas,
    }
    print(data.coordenadas)
    redis_client.setex_client(session_id, json.dumps(session_data), SESSION_EXPIRATION)

    # Enviar cookie segura HttpOnly
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=False,      # ⚠️ en producción con HTTPS
        samesite="Strict",  # Previene CSRF básico
        max_age=SESSION_EXPIRATION
    )

    return {"premios": premios}


@ruleta.post("/premio")
def obtener_premio(
    session_id: str = Cookie(None),
    db: Session = Depends(get_db)
):
    """
    Endpoint para obtener el premio de la ruleta
    Valida el session_id de la cookie contra Redis
    """
    print("Session ID from cookie:", session_id)  # Debugging line
    if not session_id:
        raise HTTPException(status_code=401, detail="Sesión no encontrada")

    session_data_raw = redis_client.get_client(session_id)
    if not session_data_raw:
        raise HTTPException(status_code=401, detail="Sesión inválida o expirada")

    session_data = json.loads(session_data_raw)

    # Validación en BD
    pedido = db.query(Pedido).filter(Pedido.n_pedido == session_data["n_pedido"]).first()
    if pedido:
        raise HTTPException(status_code=401, detail="El pedido ya ha participado en el concurso")

    # Calcular resultado
    ruleta_obj = Ruleta()
    ruleta_obj.ingresar_monto(session_data["monto"])

    premios = session_data["premios"]
    n_resultado, resultado = ruleta_obj.calcular_resultado(premios)
    gano = resultado != "NO PREMIO"

    # Crear cliente si no existe
    cliente = db.query(Cliente).filter(Cliente.nit == session_data["nit"]).first()
    if not cliente:
        new_cliente = Cliente(nit=session_data["nit"])
        try:
            db.add(new_cliente)
            db.flush()
        except Exception as e:
            db.rollback()
            print(e)
            raise HTTPException(status_code=500, detail="Error interno creando cliente")

    # Guardar pedido
    new_pedido = Pedido(
        n_pedido=session_data["n_pedido"],
        nit=session_data["nit"],
        monto=session_data["monto"],
        celular=session_data["celular"],
        premio=resultado,
        fecha=now_colombia(),
        latitud=session_data["coordenadas"][0] if session_data.get("coordenadas") else None,
        longitud=session_data["coordenadas"][1] if session_data.get("coordenadas") else None,
    )

    try:
        db.add(new_pedido)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno guardando pedido")

    # Enviar email si ganó
    if gano:
        ruleta_obj.enviar_email(resultado, now_colombia(), session_data["monto"], session_data["nit"], session_data["n_pedido"])

    # 🔑 Invalida la sesión después de reclamar el premio (opcional, seguridad extra)
    redis_client.delete_client(session_id)

    return {
        "gano": gano,
        "resultado": n_resultado,
        "premio": resultado
    }

    