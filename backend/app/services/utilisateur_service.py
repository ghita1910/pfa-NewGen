from sqlalchemy.orm import Session
from fastapi import HTTPException
from passlib.hash import bcrypt
from app.models.models import Utilisateur, Compte, Prestataire

class CustomException(Exception):
    def __init__(self, detail: str):
        self.detail = detail

def create_utilisateur_et_compte(db: Session, data: dict):
    # Vérification des duplications
    if data["email"]:
        existing_email = db.query(Compte).filter(Compte.email == data["email"]).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email déjà utilisé.")

    if data["tel"]:
        existing_tel = db.query(Compte).filter(Compte.tel == data["tel"]).first()
        if existing_tel:
            raise HTTPException(status_code=400, detail="Numéro de téléphone déjà utilisé.")

    try:

        utilisateur = Utilisateur(
            nom=data["nom"],
            prenom=data["prenom"],
            email=data["email"],
            tel=data["tel"],
            adresse=data["adresse"]
        )
        db.add(utilisateur)
        db.flush()

        compte = Compte(
            email=data["email"],
            password=data["password"],
            tel=data["tel"],
            utilisateurID=utilisateur.utilisateurID
        )
        db.add(compte)

        if data["role"].lower() == "prestataire":
            prestataire = Prestataire(
                prestataireID=utilisateur.utilisateurID,
                description="",
                rating=0.0,
                specialite="",  
                tarif=0.0,
                typeTarif=""
            )
            db.add(prestataire)

        db.commit()
        db.refresh(utilisateur)
        return utilisateur
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


def authenticate_user(db, email: str = None, tel: str = None, password: str = None):
    # Si un email est fourni, on cherche avec l'email
    if email:
        compte = db.query(Compte).filter(Compte.email == email).first()
    elif tel:
        compte = db.query(Compte).filter(Compte.tel == tel).first()
    else:
        raise CustomException("Email ou téléphone requis")

    if not compte:
        raise CustomException("Email ou mot de passe incorrect")

    if not password == compte.password:
        raise CustomException("Email ou mot de passe incorrect")

    return compte

def authenticate_admin(db: Session, email: str, password: str):
    compte = db.query(Compte).filter(Compte.email == email, Compte.utilisateurID == None).first()
    if not compte:
        raise Exception("Admin non trouvé")
    if compte.password != password:
        raise Exception("Mot de passe incorrect")
    return compte

