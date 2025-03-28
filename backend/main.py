from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth  # 👈 importer les routes de /auth.py

app = FastAPI()

# Configuration CORS
origins = [
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://10.10.1.190:8081",
    "http://192.168.1.3:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes d'authentification
app.include_router(auth.router)

# Route de test
@app.get("/")
def root():
    return {"message": "🚀 API PFA en ligne, bienvenue Hamza !"}


#uvicorn main:app --reload

