from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

database = os.getenv("NAME_DATABASE_MYSQL")  # nombre de la base de datos
username = os.getenv("USER_DATABASE_MYSQL")  # usuario
password = os.getenv("PASSWORD_DATABASE_MYSQL")  # contraseña
server = os.getenv("HOST_DATABASE_MYSQL")
port = os.getenv("PORT_DATABASE_MYSQL", "3306")

DATABASE_URL = f"mysql+pymysql://{username}:{password}@{server}:{port}/{database}"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # mantiene viva la conexión
    pool_recycle=3600     # recicla conexiones cada hora
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
