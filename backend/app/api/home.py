from app.models.models import Notification
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Prestataire, Utilisateur,DemandeService,Adresse,Facture
from app.schemas.compte_schema import PrestataireOut
from app.schemas.compte_schema import DemandeServiceCreate, DemandeServiceEtatUpdate, DemandeServiceOut ,DemandeServiceFull
from typing import List

router = APIRouter(prefix="/home", tags=["home"])
from typing import Optional

@router.get("/prestataires", response_model=List[PrestataireOut])
def get_prestataires_by_service(service: Optional[str] = None, db: Session = Depends(get_db)):
    query = (
        db.query(Prestataire)
        .join(Utilisateur, Prestataire.prestataireID == Utilisateur.utilisateurID)
        .filter(Prestataire.isApproved == True)
    )

    if service:
        query = query.filter(Prestataire.specialite == service)

    results = query.all()

    prestataires_out = []
    for p in results:
        utilisateur = p.utilisateur
        adresse_obj = utilisateur.adresses[0] if utilisateur.adresses else None

        prestataires_out.append(PrestataireOut(
            prestataireID=p.prestataireID,
            description=p.description,
            specialite=p.specialite,
            tarif=p.tarif,
            typeTarif=p.typeTarif,
            experience=p.experience,
            rating=p.rating,
            isApproved=p.isApproved,
            nom=utilisateur.nom,
            prenom=utilisateur.prenom,
            username=utilisateur.username,
            telephone=utilisateur.tel,
            adresse=adresse_obj.adresse if adresse_obj else "",
            photo=utilisateur.photo,
            latitude=adresse_obj.latitude if adresse_obj else None,
            longitude=adresse_obj.longitude if adresse_obj else None
        ))

    return prestataires_out

@router.get("/prestataire/{id}", response_model=PrestataireOut)
def get_prestataire_by_id(id: int, db: Session = Depends(get_db)):
    prestataire = (
        db.query(Prestataire)
        .join(Utilisateur, Prestataire.prestataireID == Utilisateur.utilisateurID)
        .filter(Prestataire.prestataireID == id)
        .first()
    )

    if not prestataire:
        raise HTTPException(status_code=404, detail="Prestataire non trouvé")

    utilisateur = prestataire.utilisateur
    adresse_obj = utilisateur.adresses[0] if utilisateur.adresses else None

    return PrestataireOut(
        prestataireID=prestataire.prestataireID,
        description=prestataire.description,
        specialite=prestataire.specialite,
        tarif=prestataire.tarif,
        typeTarif=prestataire.typeTarif,
        experience=prestataire.experience,
        rating=prestataire.rating,
        isApproved=prestataire.isApproved,
        nom=utilisateur.nom,
        prenom=utilisateur.prenom,
        username=utilisateur.username,
        telephone=utilisateur.tel,
        adresse=adresse_obj.adresse if adresse_obj else "",
        photo=utilisateur.photo,
        latitude=adresse_obj.latitude if adresse_obj else None,
        longitude=adresse_obj.longitude if adresse_obj else None
    )


@router.post("/create-demande", response_model=DemandeServiceOut)
def create_demande(demande: DemandeServiceCreate, db: Session = Depends(get_db)):
    nouvelle = DemandeService(
        adresseID=demande.adresseID,
        Date=demande.Date,
        heure=demande.heure,
        etat=demande.etat,
        description=demande.description,
        client_id=demande.client_id,
        prestataireID=demande.prestataireID
    )
    db.add(nouvelle)
    db.commit()
    db.refresh(nouvelle)

    # 🔔 Notification au prestataire

    prestataire = db.query(Utilisateur).filter(Utilisateur.utilisateurID == demande.prestataireID).first()
    client = db.query(Utilisateur).filter(Utilisateur.utilisateurID == demande.client_id).first()

    notif = Notification(
        user_id=demande.prestataireID,
        titre="Nouvelle demande reçue",
        message=f"{client.nom} {client.prenom} vous a envoyé une demande de service.",
        timestamp=datetime.now(),
        is_read=False,
        role="prestataire"
    )
    db.add(notif)
    db.commit()

    return nouvelle



# 🟡 2. Récupérer les demandes d’un prestataire
@router.get("/demandes", response_model=List[DemandeServiceFull])
def get_demandes_by_prestataire(prestataire_id: int, db: Session = Depends(get_db)):
    demandes = (
        db.query(DemandeService)
        .filter(DemandeService.prestataireID == prestataire_id)
        .filter(DemandeService.etat == "en attente")   
        .all()
    )

    result = []
    for d in demandes:
        client = d.client
        prestataire_user = d.prestataire.utilisateur if d.prestataire else None

        result.append(DemandeServiceFull(
            demandeServiceID=d.demandeServiceID,
            Date=d.Date,
            heure=d.heure,
            etat=d.etat,
            description=d.description,
            client_id=d.client_id,
            prestataireID=d.prestataireID,
            nom_client=f"{client.nom} {client.prenom}" if client else "Client inconnu",
            adresse=d.adresse.adresse if d.adresse else "Adresse inconnue",
            username=client.username if client else "Nom d'utilisateur inconnu",
            photo=client.photo if client else None,
            prestataire_nom=prestataire_user.nom if prestataire_user else "Inconnu",
            prestataire_prenom=prestataire_user.prenom if prestataire_user else "Inconnu"
    ))


    return result
@router.put("/demande/{id}/etat", response_model=DemandeServiceOut)
def update_etat_demande(id: int, update: DemandeServiceEtatUpdate, db: Session = Depends(get_db)):
    demande = db.query(DemandeService).filter(DemandeService.demandeServiceID == id).first()
    if not demande:
        raise HTTPException(status_code=404, detail="Demande non trouvée")

    demande.etat = update.etat
    db.commit()
    db.refresh(demande)

    prestataire = db.query(Utilisateur).filter(Utilisateur.utilisateurID == demande.prestataireID).first()

    if update.etat == "acceptée":
        titre = "Demande acceptée"
        message = f"Votre demande a été acceptée par {prestataire.nom} {prestataire.prenom}."
    elif update.etat == "refusée":
        titre = "Demande refusée"
        message = f"Votre demande a été refusée par {prestataire.nom} {prestataire.prenom}."
    else:
        titre = "Mise à jour de la demande"
        message = f"Votre demande a été mise à jour par {prestataire.nom} {prestataire.prenom}."

    # Mise à jour d'une notification existante (non lue) ou création si aucune n'existe
    notif = (
        db.query(Notification)
        .filter(Notification.user_id == demande.client_id, Notification.role == "client", Notification.is_read == False)
        .order_by(Notification.timestamp.desc())
        .first()
    )

    if notif:
        notif.titre = titre
        notif.message = message
        notif.is_read = True
        notif.timestamp = datetime.now()
    else:
        notif = Notification(
            user_id=demande.client_id,
            titre=titre,
            message=message,
            timestamp=datetime.now(),
            is_read=False,
            role="client"
        )
        db.add(notif)

    db.commit()

    return demande
@router.get("/adresses/{utilisateur_id}")
def get_adresses(utilisateur_id: int, db: Session = Depends(get_db)):
    adresses = db.query(Adresse).filter(Adresse.utilisateurID == utilisateur_id).all()
    if not adresses:
        raise HTTPException(status_code=404, detail="Aucune adresse trouvée pour cet utilisateur.")
    return adresses
@router.get("/demande/{id}", response_model=DemandeServiceFull)
def get_demande_by_id(id: int, db: Session = Depends(get_db)):
    from sqlalchemy.orm import aliased

    # Alias pour joindre le prestataire (sinon conflit avec le client)
    PrestataireUser = aliased(Utilisateur)

    result = (
        db.query(
            DemandeService.demandeServiceID,
            DemandeService.Date,
            DemandeService.heure,
            DemandeService.etat,
            DemandeService.description,
            DemandeService.client_id,
            DemandeService.prestataireID,
            Utilisateur.nom.label("nom_client"),
            Adresse.adresse.label("adresse"),
            Utilisateur.username,
            Utilisateur.photo,
            Adresse.longitude,
            Adresse.latitude,
            PrestataireUser.nom.label("prestataire_nom"),
            PrestataireUser.prenom.label("prestataire_prenom"),
            Facture.montant,
        )
        .join(Utilisateur, DemandeService.client_id == Utilisateur.utilisateurID)
        .join(Adresse, DemandeService.adresseID == Adresse.adresseID)
        .join(Prestataire, DemandeService.prestataireID == Prestataire.prestataireID)
        .join(PrestataireUser, Prestataire.prestataireID == PrestataireUser.utilisateurID)
        .outerjoin(Facture, Facture.demandeServiceID == DemandeService.demandeServiceID)
        .filter(DemandeService.demandeServiceID == id)
        .first()
    )

    if not result:
        raise HTTPException(404, "Demande not found")

    return {
        "demandeServiceID": result.demandeServiceID,
        "Date": result.Date,
        "heure": result.heure,
        "etat": result.etat,
        "description": result.description,
        "client_id": result.client_id,
        "prestataireID": result.prestataireID,
        "nom_client": result.nom_client,
        "adresse": result.adresse,
        "username": result.username,
        "photo": result.photo,
        "prestataire_nom": result.prestataire_nom,
        "prestataire_prenom": result.prestataire_prenom,
        "montant": result.montant,
        "longitude":result.longitude,
        "latitude":result.latitude,
    }
@router.get("/demandes/all", response_model=List[DemandeServiceFull])
def get_all_demandes_by_prestataire(prestataire_id: int, db: Session = Depends(get_db)):
    demandes = (
        db.query(DemandeService)
        .filter(DemandeService.prestataireID == prestataire_id)
        .all()
    )

    
    
    result = []
    for d in demandes:
        prestataire_user = d.prestataire.utilisateur if d.prestataire else None
        photo = d.client.photo if d.client else None
        nom_client = f"{d.client.nom} {d.client.prenom}" if d.client else "Client inconnu"
        username = d.client.username if d.client else "Nom d'utilisateur inconnu"
        adresse = d.adresse.adresse if d.adresse else "Adresse inconnue"

        # Récupérer la facture associée, s'il y en a une
        facture = db.query(Facture).filter(Facture.demandeServiceID == d.demandeServiceID).first()
        montant = facture.montant if facture else None

        result.append(DemandeServiceFull(
            demandeServiceID=d.demandeServiceID,
            Date=d.Date,
            heure=d.heure,
            etat=d.etat,
            description=d.description,
            client_id=d.client_id,
            prestataireID=d.prestataireID,
            nom_client=nom_client,
            adresse=adresse,
            username=username,
            photo=photo,
            prestataire_nom=prestataire_user.nom if prestataire_user else "Inconnu",
            prestataire_prenom=prestataire_user.prenom if prestataire_user else "Inconnu",
            montant=montant  # On ajoute ici le montant récupéré
        ))

    return result

@router.get("/client/{id}")
def get_client_by_id(id: int, db: Session = Depends(get_db)):
    from app.models.models import Utilisateur

    client = db.query(Utilisateur).filter(Utilisateur.utilisateurID == id).first()

    if not client:
        raise HTTPException(status_code=404, detail="Client non trouvé")

    return {
        "nom": client.nom,
        "prenom": client.prenom,
        "username": client.username,
        "photo": client.photo
    }

# backend: add in your /home router
@router.get("/demandes/calendar")
def get_demandes_calendar(client_id: int, db: Session = Depends(get_db)):
    demandes = (
        db.query(DemandeService)
        .filter(DemandeService.client_id == client_id)
        .all()
    )

    grouped = {}
    for d in demandes:
        date_key = d.Date.isoformat()  # format "YYYY-MM-DD"
        grouped.setdefault(date_key, []).append({
            "title": d.description,
            "name": f"{d.prestataire.nom} {d.prestataire.prenom}" if d.prestataire else "Unknown",
            "status": d.etat,
            "image": d.prestataire.utilisateur.photo if d.prestataire and d.prestataire.utilisateur else None
        })

    return grouped
@router.get("/client-demandes", response_model=List[DemandeServiceFull])
def get_demandes_by_client(
    client_id: int,
    etat: Optional[str] = Query(None, description="Filtrer par état de la demande"),
    db: Session = Depends(get_db)
):
    query = db.query(DemandeService).filter(DemandeService.client_id == client_id)
    
    if etat:
        query = query.filter(DemandeService.etat == etat)  # filtre par état si fourni

    demandes = query.all()

    result = []
    for d in demandes:
        client = d.client
        prestataire = d.prestataire
        prestataire_user = prestataire.utilisateur if prestataire else None
        adresse = d.adresse.adresse if d.adresse else "Adresse inconnue"
        facture = db.query(Facture).filter(Facture.demandeServiceID == d.demandeServiceID).first()
        
        result.append(DemandeServiceFull(
            demandeServiceID=d.demandeServiceID,
            Date=d.Date,
            heure=d.heure,
            etat=d.etat,
            description=d.description,
            client_id=d.client_id,
            prestataireID=d.prestataireID,
            nom_client=f"{client.nom} {client.prenom}" if client else "Inconnu",
            adresse=adresse,
            username=prestataire_user.username if prestataire_user else "Inconnu",
            photo=prestataire_user.photo if prestataire_user else None,
            prestataire_nom=prestataire_user.nom if prestataire_user else "Inconnu",
            prestataire_prenom=prestataire_user.prenom if prestataire_user else "Inconnu",
            montant = facture.montant if facture else None
        ))

    return result

@router.get("/itineraire/{demande_id}")
def get_itineraire_coords(demande_id: int, db: Session = Depends(get_db)):
    demande = db.query(DemandeService).filter(DemandeService.demandeServiceID == demande_id).first()

    if not demande:
        raise HTTPException(status_code=404, detail="Demande non trouvée")

    client_adresse = db.query(Adresse).filter(Adresse.utilisateurID == demande.client_id).first()
    prestataire_adresse = db.query(Adresse).filter(Adresse.utilisateurID == demande.prestataireID).first()

    if not client_adresse or not prestataire_adresse:
        raise HTTPException(status_code=404, detail="Adresse introuvable")

    return {
        "client_latitude": client_adresse.latitude,
        "client_longitude": client_adresse.longitude,
        "prestataire_latitude": prestataire_adresse.latitude,
        "prestataire_longitude": prestataire_adresse.longitude,
    }