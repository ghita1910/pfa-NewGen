from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.compte_schema import CompteLogin, CompteCheck
from app.services.utilisateur_service import create_utilisateur_et_compte, authenticate_user, authenticate_admin
from app.utils.auth_utils import get_current_user
from app.utils.jwt_utils import create_access_token
from app.models.models import Utilisateur, Compte, Prestataire
import os

router = APIRouter(prefix="/auth", tags=["auth"])


from fastapi import Form  # Déjà importé

@router.post("/signup-client")
async def sign_up_client(
    email: str = Form(None),
    tel: str = Form(None),
    password: str = Form(...),
    nom: str = Form(...),
    prenom: str = Form(...),
    adresse: str = Form(...),
    latitude: float = Form(None),    # Nouveau champ latitude
    longitude: float = Form(None),   # Nouveau champ longitude
    username: str = Form(...),
    age: str = Form(...),
    gender: str = Form(...),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        user_folder = f"UsersAssets/{username}"
        os.makedirs(user_folder, exist_ok=True)

        photo_path = "UsersAssets/default.jpg"
        if photo:
            ext = photo.filename.split(".")[-1]
            photo_path = f"{user_folder}/photo.{ext}"
            with open(photo_path, "wb") as f:
                f.write(await photo.read())

        compte_data = {
            "email": email,
            "tel": tel,
            "password": password,
            "role": "customer"
        }

        utilisateur_data = {
            "nom": nom,
            "prenom": prenom,
            "email": email,
            "tel": tel,
            "username": username,
            "role": "customer",
            "photo": photo_path,
            "age": age,
            "gender": gender,
        }

        utilisateur = create_utilisateur_et_compte(
            db=db,
            compte_data=compte_data,
            utilisateur_data=utilisateur_data
        )

        from app.models.models import Adresse
        nouvelle_adresse = Adresse(
            adresse=adresse,
            latitude=latitude,       # Stocker latitude
            longitude=longitude,     # Stocker longitude
            utilisateurID=utilisateur.utilisateurID
        )
        db.add(nouvelle_adresse)
        db.commit()

        return {"message": "Client créé avec succès"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/signup-prestataire")
async def sign_up_prestataire(
    email: str = Form(None),
    tel: str = Form(None),
    password: str = Form(...),
    nom: str = Form(...),
    prenom: str = Form(...),
    adresse: str = Form(...),
    latitude: float = Form(None),       # Ajout latitude
    longitude: float = Form(None),      # Ajout longitude
    username: str = Form(...),
    age: str = Form(...),
    gender: str = Form(...),
    photo: UploadFile = File(None),
    cv: UploadFile = File(None),
    cin_photo: UploadFile = File(None),
    description: str = Form(...),
    specialite: str = Form(...),
    experience: str = Form(...),
    tarif: float = Form(...),
    typeTarif: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        user_folder = f"UsersAssets/{username}"
        os.makedirs(user_folder, exist_ok=True)

        def save_file(f: UploadFile, name: str):
            ext = f.filename.split(".")[-1]
            path = f"{user_folder}/{name}.{ext}"
            with open(path, "wb") as file:
                file.write(f.file.read())
            return path

        photo_path = save_file(photo, "photo") if photo else "UsersAssets/default.jpg"
        cv_path = save_file(cv, "cv") if cv else None
        cin_path = save_file(cin_photo, "cin") if cin_photo else None

        compte_data = {
            "email": email,
            "tel": tel,
            "password": password,
            "role": "prestataire"
        }

        utilisateur_data = {
            "nom": nom,
            "prenom": prenom,
            "email": email,
            "tel": tel,
            "username": username,
            "role": "prestataire",
            "photo": photo_path,
            "age": age,
            "gender": gender,
        }

        prestataire_data = {
            "description": description,
            "specialite": specialite,
            "experience": experience,
            "cv": cv_path,
            "cin_photo": cin_path,
            "tarif": tarif,
            "typeTarif": typeTarif,
        }

        utilisateur = create_utilisateur_et_compte(
            db=db,
            compte_data=compte_data,
            utilisateur_data=utilisateur_data,
            prestataire_data=prestataire_data
        )

        from app.models.models import Adresse
        nouvelle_adresse = Adresse(
            adresse=adresse,
            latitude=latitude,       # Stockage latitude
            longitude=longitude,     # Stockage longitude
            utilisateurID=utilisateur.utilisateurID
        )
        db.add(nouvelle_adresse)
        db.commit()

        return {"message": "Prestataire créé avec succès"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/signin")
def sign_in(data: CompteLogin, db: Session = Depends(get_db)):
    try:
        compte = authenticate_user(db, email=data.email, tel=data.tel, password=data.password)

        utilisateur = compte.utilisateur
        if not utilisateur:
            raise HTTPException(status_code=400, detail="Utilisateur non trouvé")

        access_token = create_access_token(data={"sub": utilisateur.utilisateurID, "role": utilisateur.role})


        return {
            "access_token": access_token,
            "token_type": "bearer",
            "utilisateurID": utilisateur.utilisateurID,
            "role": utilisateur.role  # 👈 Ajouté ici
        }


    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/admin-login")
def admin_login(data: CompteLogin, db: Session = Depends(get_db)):
    try:
        compte = authenticate_admin(db, email=data.email, password=data.password)

        access_token = create_access_token(data={"sub": data.email, "role": "admin"})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "email": compte.email,
            "tel": compte.tel
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/check")
def check_email_or_tel(data: CompteCheck, db: Session = Depends(get_db)):
    if data.email:
        if db.query(Compte).filter(Compte.email == data.email).first():
            raise HTTPException(status_code=400, detail="Email déjà utilisé.")
    if data.tel:
        if db.query(Compte).filter(Compte.tel == data.tel).first():
            raise HTTPException(status_code=400, detail="Numéro de téléphone déjà utilisé.")
    return {"message": "Disponible"}


@router.post("/approve-prestataire/{id}")
def approve_prestataire(id: int, db: Session = Depends(get_db)):
    prestataire = db.query(Prestataire).filter(Prestataire.prestataireID == id).first()
    if not prestataire:
        raise HTTPException(status_code=404, detail="Prestataire non trouvé")

    prestataire.isApproved = True
    db.commit()
    return {"message": "Prestataire approuvé avec succès"}


@router.get("/pending-prestataires")
def get_pending_prestataires(db: Session = Depends(get_db)):
    prestataires = db.query(Prestataire).filter(Prestataire.isApproved == False).all()
    return prestataires


@router.get("/clients")
def get_all_clients(db: Session = Depends(get_db)):
    clients = db.query(Utilisateur).filter(Utilisateur.role == "customer").all()
    return clients

@router.get("/prestataires")
def get_all_prestataires(db: Session = Depends(get_db)):
    prestataires = db.query(Utilisateur).filter(Utilisateur.role == "prestataire").all()
    return prestataires



@router.delete("/delete-client/{id}")
def delete_client(id: int, db: Session = Depends(get_db)):
    utilisateur = db.query(Utilisateur).filter(Utilisateur.utilisateurID == id).first()

    if not utilisateur:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    if utilisateur.role != "customer":
        raise HTTPException(status_code=403, detail="Ce n'est pas un client")

    comptes = db.query(Compte).filter(Compte.utilisateurID == id).all()
    for compte in comptes:
        db.delete(compte)

    db.delete(utilisateur)
    db.commit()

    return {"message": "Client supprimé avec succès"}


@router.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    return {"message": "Vous avez accès à cette route", "user": current_user}


# ✅ ✅ ✅ AJOUT GOOGLE CHECK ✅ ✅ ✅
@router.get("/check-user")
def check_user_exists(email: str, db: Session = Depends(get_db)):
    compte = db.query(Compte).filter(Compte.email == email).first()
    return {"exists": compte is not None}
