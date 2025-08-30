from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from ruleta.routes import ruleta as ruleta_routes

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import request_validation_exception_handler

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://santiagocastanoacevedo.site", 
        "http://www.santiagocastanoacevedo.site", 
        "http://localhost:3000", 
        "https://santiagocastanoacevedo.site",
        "https://www.santiagocastanoacevedo.site",
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ruleta_routes, prefix="/api")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Extraemos errores y creamos un mensaje simple
    errors = exc.errors()
    # Ejemplo: "field 'celular' must be a string"
    messages = []
    for err in errors:
        loc = " -> ".join(str(loc) for loc in err['loc'])
        msg = err['msg']
        messages.append(f"{loc}: {msg}\n")
    
    # Puedes devolver todo en un string o concatenado
    detail_message = "; ".join(messages)
    
    return JSONResponse(
        status_code=422,
        content={"detail": detail_message}
    )