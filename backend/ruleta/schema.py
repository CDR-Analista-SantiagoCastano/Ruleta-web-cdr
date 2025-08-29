from typing import List, Optional
from pydantic import BaseModel

class DatosClienteRequest(BaseModel):
    nit: int
    n_pedido: int
    monto: float
    celular: str
    coordenadas: Optional[List[float]] = None
