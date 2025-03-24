from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Charger les variables d'environnement à partir du fichier .env
load_dotenv()

# URL de connexion PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")

# Créer un moteur SQLAlchemy
engine = create_engine(DATABASE_URL)

# Créer une session locale liée au moteur
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base de classe pour les modèles ORM
Base = declarative_base()

# Fournir une session à chaque requête, et s'assurer de la fermer proprement
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
