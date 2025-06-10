from sqlalchemy.orm import Session
from fastapi import HTTPException
from passlib.hash import bcrypt
from app.models.models import Utilisateur, Compte, Prestataire, Adresse
from app.schemas.compte_schema import CompteCreate, UtilisateurCreate, PrestataireCreate

class CustomException(Exception):
    def __init__(self, detail: str):
        self.detail = detail

def create_utilisateur_et_compte(
    db: Session,
    compte_data: CompteCreate,
    utilisateur_data: UtilisateurCreate,
    prestataire_data: PrestataireCreate = None,
    adresse_data: dict = None  # New parameter for address + coords
):
    if isinstance(compte_data, dict):
        compte_data = CompteCreate(**compte_data)
    if isinstance(utilisateur_data, dict):
        utilisateur_data = UtilisateurCreate(**utilisateur_data)
    if prestataire_data and isinstance(prestataire_data, dict):
        prestataire_data = PrestataireCreate(**prestataire_data)

    # Vérification des duplications
    if compte_data.email:
        existing_email = db.query(Compte).filter(Compte.email == compte_data.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email déjà utilisé.")

    if compte_data.tel:
        existing_tel = db.query(Compte).filter(Compte.tel == compte_data.tel).first()
        if existing_tel:
            raise HTTPException(status_code=400, detail="Numéro de téléphone déjà utilisé.")

    existing_username = db.query(Utilisateur).filter(Utilisateur.username == utilisateur_data.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà utilisé.")

    try:
        utilisateur = Utilisateur(
            nom=utilisateur_data.nom,
            prenom=utilisateur_data.prenom,
            email=compte_data.email,
            tel=compte_data.tel,
            role=utilisateur_data.role.lower(),
            age=utilisateur_data.age,
            gender=utilisateur_data.gender,
            username=utilisateur_data.username,
            photo=utilisateur_data.photo
        )
        db.add(utilisateur)
        db.flush()

        compte = Compte(
            email=compte_data.email,
            tel=compte_data.tel,
            password=bcrypt.hash(compte_data.password),
            utilisateurID=utilisateur.utilisateurID
        )
        db.add(compte)

        # Add Adresse if provided
        if adresse_data:
            nouvelle_adresse = Adresse(
                adresse=adresse_data.get("adresse", ""),
                latitude=adresse_data.get("latitude"),
                longitude=adresse_data.get("longitude"),
                utilisateurID=utilisateur.utilisateurID
            )
            db.add(nouvelle_adresse)

        if utilisateur_data.role.lower() == "prestataire" and prestataire_data:
            prestataire = Prestataire(
                prestataireID=utilisateur.utilisateurID,
                description=prestataire_data.description,
                specialite=prestataire_data.specialite,
                tarif=prestataire_data.tarif or 0.0,
                typeTarif=prestataire_data.typeTarif,
                cv=prestataire_data.cv,
                cin_photo=prestataire_data.cin_photo,
                experience=prestataire_data.experience,
                rating=0.0,
                isApproved=False
            )
            db.add(prestataire)

        db.commit()
        db.refresh(utilisateur)
        return utilisateur

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


def authenticate_user(db, email: str = None, tel: str = None, password: str = None):
    if email:
        compte = db.query(Compte).filter(Compte.email == email).first()
    elif tel:
        compte = db.query(Compte).filter(Compte.tel == tel).first()
    else:
        raise CustomException("Email ou téléphone requis")

    if not compte or not bcrypt.verify(password, compte.password):
        raise CustomException("Email, téléphone ou mot de passe incorrect")

    return compte


def authenticate_admin(db: Session, email: str, password: str):
    compte = db.query(Compte).filter(Compte.email == email, Compte.utilisateurID == None).first()
    if not compte or compte.password != password:
        raise Exception("Admin non trouvé ou mot de passe incorrect")
    return compte
