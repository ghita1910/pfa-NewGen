from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.compte_schema import CompteCreate, CompteOut, CompteLogin
from app.services.utilisateur_service import create_utilisateur_et_compte, authenticate_user
from app.utils.auth_utils import get_current_user  # On importe la fonction qui vérifie le token
from app.utils.jwt_utils import create_access_token  # On importe la fonction pour créer le token
from app.models.models import Utilisateur


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=CompteOut)
def sign_up(data: CompteCreate, db: Session = Depends(get_db)):
    try:
        utilisateur = create_utilisateur_et_compte(db, data.dict())
        return utilisateur.comptes[0]  # Retourne le compte
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/signin")
def sign_in(data: CompteLogin, db: Session = Depends(get_db)):
    try:
        # Authentifier l'utilisateur avec son email et son mot de passe
        compte = authenticate_user(db, email=data.email, tel=data.tel, password=data.password)

        # Vérifier si l'utilisateur existe
        utilisateur = db.query(Utilisateur).filter(Utilisateur.email == data.email).first()
        
        if not utilisateur:
            raise HTTPException(status_code=400, detail="Utilisateur non trouvé")

        # Créer le token JWT avec l'email de l'utilisateur
        access_token = create_access_token(data={"sub": data.email, "role": utilisateur.role})

        # Retourner les données (incluant le token)
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "email": utilisateur.email,
            "tel": utilisateur.tel
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



# Exemple de route protégée
@router.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):  # Utilise get_current_user pour valider le token
    return {"message": "Vous avez accès à cette route", "user": current_user}
