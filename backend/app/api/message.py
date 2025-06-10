from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import Message, Utilisateur
from datetime import datetime

router = APIRouter(prefix="/messages", tags=["messages"])

@router.get("/conversations/client/{client_id}")
def get_client_conversations(client_id: int, db: Session = Depends(get_db)):
    subquery = db.query(
        Message.receiver_id.label("receiver_id"),
        Message.timestamp.label("last_time")
    ).filter(Message.sender_id == client_id).order_by(Message.timestamp.desc()).subquery()

    results = db.query(
        Utilisateur.utilisateurID,
        Utilisateur.nom,
        Utilisateur.prenom,
        Utilisateur.photo,
        Message.contenu,
        Message.timestamp
    ).join(Message, Message.receiver_id == Utilisateur.utilisateurID)\
     .filter(Message.sender_id == client_id)\
     .order_by(Message.timestamp.desc()).all()

    seen_ids = set()
    conversations = []

    for uid, nom, prenom, photo, contenu, timestamp in results:
        if uid not in seen_ids:
            conversations.append({
                "prestataireID": uid,
                "nom": nom,
                "prenom": prenom,
                "photo": photo,
                "lastMessage": contenu,
                "timestamp": timestamp
            })
            seen_ids.add(uid)

    return conversations


@router.get("/conversations/prestataire/{prestataire_id}")
def get_prestataire_conversations(prestataire_id: int, db: Session = Depends(get_db)):
    results = db.query(
        Utilisateur.utilisateurID,
        Utilisateur.nom,
        Utilisateur.prenom,
        Utilisateur.photo,
        Message.contenu,
        Message.timestamp
    ).join(Message, Message.sender_id == Utilisateur.utilisateurID)\
     .filter(Message.receiver_id == prestataire_id)\
     .order_by(Message.timestamp.desc()).all()

    seen_ids = set()
    conversations = []

    for uid, nom, prenom, photo, contenu, timestamp in results:
        if uid not in seen_ids:
            conversations.append({
                "clientID": uid,
                "nom": nom,
                "prenom": prenom,
                "photo": photo,
                "lastMessage": contenu,
                "timestamp": timestamp
            })
            seen_ids.add(uid)

    return conversations
@router.get("/history")
def get_message_history(
    user1: int = Query(...),
    user2: int = Query(...),
    db: Session = Depends(get_db),
):
    messages = (
        db.query(Message)
        .filter(
            ((Message.sender_id == user1) & (Message.receiver_id == user2)) |
            ((Message.sender_id == user2) & (Message.receiver_id == user1))
        )
        .order_by(Message.timestamp.asc())
        .all()
    )

    return [
        {
            "from": msg.sender_id,
            "to": msg.receiver_id,
            "text": msg.contenu,
            "timestamp": msg.timestamp.isoformat(),
            "is_read": msg.is_read,
        }
        for msg in messages
    ]