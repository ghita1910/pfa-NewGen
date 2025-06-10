from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import Optional
from app.db.database import get_db
from app.models.models import Facture, DemandeService, Utilisateur, Notification

router = APIRouter(prefix="/facture", tags=["facture"])

# 📄 1. Création de la facture (par le prestataire)
@router.post("/create")
def create_facture(demandeServiceID: int, montant: float, db: Session = Depends(get_db)):
    existing = db.query(Facture).filter(Facture.demandeServiceID == demandeServiceID).first()
    if existing:
        raise HTTPException(status_code=400, detail="Facture already exists for this demande.")

    facture = Facture(
        demandeServiceID=demandeServiceID,
        montant=montant,
        Date=None
    )
    db.add(facture)
    db.commit()
    db.refresh(facture)

    # 🔔 Notification au client
    demande = db.query(DemandeService).filter(DemandeService.demandeServiceID == demandeServiceID).first()
    client = db.query(Utilisateur).filter(Utilisateur.utilisateurID == demande.client_id).first()
    prestataire = db.query(Utilisateur).filter(Utilisateur.utilisateurID == demande.prestataireID).first()

    notif = Notification(
        user_id=client.utilisateurID,
        titre="Nouvelle facture disponible",
        message=f"{prestataire.nom} {prestataire.prenom} a généré une facture pour votre demande.",
        timestamp=datetime.now(),
        is_read=False,
        role="client"
    )
    db.add(notif)
    db.commit()

    return {"message": "Facture created", "facture_id": facture.factureID}

# ✅ 2. Acceptation de la facture par le client
@router.put("/accept/{facture_id}")
def accept_facture(facture_id: int, db: Session = Depends(get_db)):
    facture = db.query(Facture).filter(Facture.factureID == facture_id).first()
    if not facture:
        raise HTTPException(status_code=404, detail="Facture not found.")

    demande = db.query(DemandeService).filter(DemandeService.demandeServiceID == facture.demandeServiceID).first()
    if not demande:
        raise HTTPException(status_code=404, detail="DemandeService not found.")

    facture.Date = date.today()
    demande.etat = "started"
    db.commit()

    # 🔔 Notification au prestataire
    client = db.query(Utilisateur).filter(Utilisateur.utilisateurID == demande.client_id).first()
    prestataire = db.query(Utilisateur).filter(Utilisateur.utilisateurID == demande.prestataireID).first()

    notif = Notification(
        user_id=prestataire.utilisateurID,
        titre="Facture acceptée",
        message=f"{client.nom} {client.prenom} a accepté votre facture.",
        timestamp=datetime.now(),
        is_read=False,
        role="prestataire"
    )
    db.add(notif)
    db.commit()

    return {"message": "Facture accepted and date set."}

# ❌ 3. Annulation de la facture par le client
@router.delete("/cancel/{facture_id}")
def cancel_facture(facture_id: int, db: Session = Depends(get_db)):
    facture = db.query(Facture).filter(Facture.factureID == facture_id).first()
    if not facture:
        raise HTTPException(status_code=404, detail="Facture not found.")

    demande = db.query(DemandeService).filter(DemandeService.demandeServiceID == facture.demandeServiceID).first()
    if not demande:
        raise HTTPException(status_code=404, detail="DemandeService not found.")

    client = db.query(Utilisateur).filter(Utilisateur.utilisateurID == demande.client_id).first()
    prestataire = db.query(Utilisateur).filter(Utilisateur.utilisateurID == demande.prestataireID).first()

    db.delete(facture)
    demande.etat = "canceled"
    db.commit()

    # 🔔 Notification au prestataire
    notif = Notification(
        user_id=prestataire.utilisateurID,
        titre="Facture annulée",
        message=f"{client.nom} {client.prenom} a annulé la facture liée à la demande.",
        timestamp=datetime.now(),
        is_read=False,
        role="prestataire"
    )
    db.add(notif)
    db.commit()

    return {"message": "Facture canceled and demande status updated."}
