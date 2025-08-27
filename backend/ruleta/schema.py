from typing import List
from pydantic import BaseModel

class DatosClienteRequest(BaseModel):
    nit: int
    n_pedido: int
    monto: float
    celular: str
