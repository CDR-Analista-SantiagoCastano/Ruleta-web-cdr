from fastapi import APIRouter, Query, Depends, HTTPException
import random
from Conexion.db import get_db
from sqlalchemy.orm import Session
from ruleta.models import Cliente, Pedido
from ruleta.schema import DatosClienteRequest
from utils import now_colombia
from ruleta.ruleta import Ruleta

ruleta = APIRouter()

@ruleta.post("/opciones")
def opciones_ruleta(
    data: DatosClienteRequest,
    db: Session = Depends(get_db)
):
    '''Endpoint para obtener la lista de opciones de la ruleta en base al monto del pedido realizado por el cliente'''
    pedido = db.query(Pedido).filter(Pedido.n_pedido == data.n_pedido).first()
    
    if pedido:
        raise HTTPException(status_code=401, detail="El pedido ya ha participado en el concurso")
    
    ruleta_obj = Ruleta()
    ruleta_obj.ingresar_monto(data.monto)
    
    premios = ruleta_obj.calcular_premio()
    
    if len(premios) == 0:
        raise HTTPException(status_code=401, detail="No estas dentro del rango permitido")
    
    return {
        "nit": data.nit,
        "n_pedido": data.n_pedido,
        "monto": data.monto,
        "celular": str(data.celular),
        "premios": premios
    }

@ruleta.post("/premio")
def obtener_premio(
        data: DatosClienteRequest
    ,   db: Session = Depends(get_db)
):
    '''Endpoint para obtener el premio de la ruleta'''
    pedido = db.query(Pedido).filter(Pedido.n_pedido == data.n_pedido).first()
    if pedido:
        raise HTTPException(status_code=401, detail="El pedido ya ha participado en el concurso")
    
    ruleta_obj = Ruleta()
    ruleta_obj.ingresar_monto(data.monto)
    
    premios = ruleta_obj.calcular_premio()
    n_resultado, resultado = ruleta_obj.calcular_resultado(premios)
    
    gano = resultado != "NO PREMIO"
    
    cliente = db.query(Cliente).filter(Cliente.nit == data.nit).first()
    if not cliente:
        new_cliente = Cliente(
            nit=data.nit
        )
        
        try:
            db.add(new_cliente)
            db.flush()
        except Exception as e:
            db.rollback()
            print(e)
            raise HTTPException(status_code=401, detail="Hay un error interno, llame al area tecnica")
    
    new_pedido = Pedido(
        n_pedido = data.n_pedido,
        nit = data.nit,
        monto = data.monto,
        celular = data.celular,
        premio = resultado,
        fecha = now_colombia()
    )
    
    try:
        db.add(new_pedido)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=401, detail="Hay un error interno. Llame al area tecnica")

    if gano:
        ruleta_obj.enviar_email(resultado, now_colombia(), data.monto, data.nit, data.n_pedido)

    return {
        "gano": gano, 
        "resultado": n_resultado,
        "premio": resultado
    }
    
    