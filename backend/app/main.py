from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Configuration CORS
origins = [
    "http://localhost:8081",
    "http://127.0.0.1:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modèle Pydantic pour DataPost
class Prestataire(BaseModel):
    id: int
    title: str
    body: str

# Modèle pour l'authentification
class Account(BaseModel):
    username: str
    password: str

# Endpoint qui retourne une liste de villes
@app.get("/", response_model=List[Prestataire])
def read_root():
    liste = [
        Prestataire(id=1, title="Prestataire 1", body="Plombier"),
        Prestataire(id=2, title="Prestataire 2", body="Lavage"),
        Prestataire(id=3, title="Prestataire 3", body="Jardinage"),
        Prestataire(id=4, title="Prestataire 4", body="Coursier"),
        Prestataire(id=5, title="Prestataire 5", body="Mecanicien")
    ]
    return liste


# Endpoint d'authentification
@app.post("/auth")
def authenticate(auth: Account):
    if auth.username == "admin" and auth.password == "pwd":
        return {"result":True}
    return {"result":False}


#uvicorn main:app --reload