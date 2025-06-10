from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Notification
from typing import List
from datetime import datetime, timezone

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.post("/send")
def send_notification(user_id: int, titre: str, message: str, role: str, db: Session = Depends(get_db)):
    notification = Notification(
        user_id=user_id,
        titre=titre,
        message=message,
        timestamp=datetime.now(timezone.utc),
        is_read=False,
        role=role  # 'client' ou 'prestataire'
    )
    db.add(notification)
    db.commit()
    return {"message": "Notification envoyée."}


@router.get("/client", response_model=List[dict])
def get_client_notifications(client_id: int, db: Session = Depends(get_db)):
    notifs = db.query(Notification)\
        .filter_by(user_id=client_id, role="client", is_read=False)\
        .order_by(Notification.timestamp.desc())\
        .all()
    return [{"id": n.id, "titre": n.titre, "message": n.message, "timestamp": n.timestamp} for n in notifs]


@router.get("/prestataire", response_model=List[dict])
def get_prestataire_notifications(prestataire_id: int, db: Session = Depends(get_db)):
    notifs = db.query(Notification)\
        .filter_by(user_id=prestataire_id, role="prestataire", is_read=False)\
        .order_by(Notification.timestamp.desc())\
        .all()
    return [{"id": n.id, "titre": n.titre, "message": n.message, "timestamp": n.timestamp} for n in notifs]

@router.delete("/{notif_id}")
def delete_notification(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter_by(id=notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification introuvable.")
    db.delete(notif)
    db.commit()
    return {"message": "Notification supprimée."}


@router.put("/{notif_id}/read")
def mark_as_read(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter_by(id=notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification introuvable.")
    notif.is_read = True
    db.commit()
    return {"message": "Notification marquée comme lue."}

@router.get("/unread-count/{user_id}")
def get_unread_notification_count(user_id: int, db: Session = Depends(get_db)):
    count = db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).count()
    return {"count": count}

