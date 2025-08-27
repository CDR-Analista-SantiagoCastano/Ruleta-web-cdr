from sqlalchemy import Column, Integer, String, Date, DateTime, DECIMAL, ForeignKey, Text, BIGINT
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
from sqlalchemy.dialects.mssql import DATETIME2

Base = declarative_base()

class Cliente(Base):
    __tablename__ = "clientes"

    nit = Column(BIGINT, primary_key=True, autoincrement=False)

class Pedido(Base):
    __tablename__ = "pedidos"

    n_pedido = Column(BIGINT, primary_key=True, autoincrement=False)
    nit = Column(BIGINT, nullable=False)
    monto = Column(DECIMAL(15, 2), nullable=False)
    celular = Column(String(15), nullable=False)
    premio = Column(String(50), nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow, nullable=False)