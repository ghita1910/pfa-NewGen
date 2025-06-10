# routes/home.py ou routes/admin.py selon ton organisation
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Prestataire, Utilisateur
from app.schemas.compte_schema import PrestataireOut2
from typing import List

router = APIRouter(prefix="/admin", tags=["admin"])
from sqlalchemy.orm import joinedload

@router.get("/pending-prestataires", response_model=List[PrestataireOut2])
def get_pending_prestataires(db: Session = Depends(get_db)):
    prestataires = (
        db.query(Prestataire)
        .options(
            joinedload(Prestataire.utilisateur).joinedload(Utilisateur.adresses)
        )
        .filter(Prestataire.isApproved == False)
        .all()
    )

    prestataires_out = []
    for p in prestataires:
        utilisateur = p.utilisateur
        adresse = utilisateur.adresses[0].adresse if utilisateur and utilisateur.adresses else "Adresse non renseignée"
        prestataires_out.append(
            PrestataireOut2(
                prestataireID=p.prestataireID,
                description=p.description,
                specialite=p.specialite,
                tarif=p.tarif,
                typeTarif=p.typeTarif,
                experience=p.experience,
                rating=p.rating,
                isApproved=p.isApproved,
                cin_photo=p.cin_photo,
                cv=p.cv,
                nom=utilisateur.nom,
                prenom=utilisateur.prenom,
                username=utilisateur.username,
                telephone=utilisateur.tel,
                photo=utilisateur.photo,
                email=utilisateur.email,
                adresse=adresse,
            )
        )
    return prestataires_out


from sqlalchemy.orm import joinedload

@router.get("/approuved-prestataires", response_model=List[PrestataireOut2])
def get_approved_prestataires(db: Session = Depends(get_db)):
    prestataires = (
        db.query(Prestataire)
        .options(
            joinedload(Prestataire.utilisateur).joinedload(Utilisateur.adresses)
        )
        .filter(Prestataire.isApproved == True)
        .all()
    )

    prestataires_out = []
    for p in prestataires:
        utilisateur = p.utilisateur
        adresse = utilisateur.adresses[0].adresse if utilisateur and utilisateur.adresses else "Adresse non renseignée"
        prestataires_out.append(
            PrestataireOut2(
                prestataireID=p.prestataireID,
                description=p.description,
                specialite=p.specialite,
                tarif=p.tarif,
                typeTarif=p.typeTarif,
                experience=p.experience,
                rating=p.rating,
                isApproved=p.isApproved,
                cin_photo=p.cin_photo,
                cv=p.cv,
                nom=utilisateur.nom,
                prenom=utilisateur.prenom,
                username=utilisateur.username,
                telephone=utilisateur.tel,
                photo=utilisateur.photo,
                email=utilisateur.email,
                adresse=adresse,
            )
        )
    return prestataires_out

# 🔹 Approuver un prestataire
@router.put("/approve-prestataire/{id}")
def approve_prestataire(id: int, db: Session = Depends(get_db)):
    prestataire = db.query(Prestataire).filter(Prestataire.prestataireID == id).first()
    if not prestataire:
        raise HTTPException(status_code=404, detail="Prestataire non trouvé")

    prestataire.isApproved = True
    db.commit()
    """ send_email(
        Utilisateur.email,
        "Approbation de votre compte",
        f"Bonjour {Utilisateur.prenom},\n\nVotre compte a été approuvé. Vous pouvez maintenant accéder à la plateforme.\n\nCordialement,\nL'équipe"
    ) """
    return {"message": "Prestataire approuvé avec succès"}
