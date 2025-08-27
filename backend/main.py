from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from ruleta.routes import ruleta as ruleta_routes

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
     allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ruleta_routes, prefix="/api")