import typer
from Conexion.db import get_db
from sqlalchemy.orm import Session
from ruleta.ruleta import Ruleta

def generar_excel():
    db = next(get_db())
    try:
        ruleta_obj = Ruleta()
        ruleta_obj.generar_excel(db)
        print("Excel generado correctamente ✅")
    finally:
        db.close()

if __name__ == "__main__":
    typer.run(generar_excel)
