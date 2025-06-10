from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import auth  # 👈 auth existant
from app.api import home  # ✅ nouveau fichier à 
from app.api import admin  # ✅ nouveau fichier à ajouter
from app.api import favorites  # ✅ nouveau fichier à ajouter
from app.api import notifications  # ✅ nouveau fichier à ajouter
from app.api import websocket  # ✅ nouveau fichier à ajouter
from app.api import message  # ✅ nouveau fichier à ajouter
from app.api import chatbot
from app.api import facture,payment
app = FastAPI()

# Dossier statique
app.mount("/UsersAssets", StaticFiles(directory="UsersAssets"), name="UsersAssets")

# CORS
origins = [
    "http://192.168.1.5:8081",
    "http://localhost:5173",
    
    "http://localhost:5173",
    "http://192.168.1.5:8081",
    "http://192.168.1.5:8081",
   
    "http://192.168.1.5:8081",
    "http://172.20.10.11:8081",
    "http://172.20.10.5:8081",
    "http://192.168.1.5:8081",
    "http://192.168.1.5:8081",
    "http://192.168.1.3:8081",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://10.10.1.190:8081",
]

app.add_middleware(
    CORSMiddleware,

    allow_origins=origins,  # ou l'origine de ton frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router)
app.include_router(home.router)  # ✅ nouvelle ligne
app.include_router(admin.router)
app.include_router(favorites.router)
app.include_router(notifications.router)
app.include_router(websocket.router)
app.include_router(message.router)  # ✅ nouvelle ligne

app.include_router(chatbot.router)
app.include_router(facture.router)
app.include_router(payment.router)



# uvicorn main:app --reload
# http://localhost:8000/docs