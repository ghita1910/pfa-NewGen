from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Message
from datetime import datetime
from fastapi import Depends

router = APIRouter(prefix="/ws", tags=["websocket"])
active_connections: Dict[int, WebSocket] = {}

@router.websocket("/chat/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
    await websocket.accept()
    active_connections[user_id] = websocket
    print(f"✅ Utilisateur {user_id} connecté au WebSocket.")

    try:
        while True:
            try:
                data = await websocket.receive_text()
                print(f"📩 Reçu : {data}")

                if "|" not in data:
                    await websocket.send_text("⛔ Format incorrect : utilise recipient_id|message")
                    continue

                recipient_id_str, message = data.split("|", 1)
                recipient_id = int(recipient_id_str)

                # Enregistre le message
                new_message = Message(
                    sender_id=user_id,
                    receiver_id=recipient_id,
                    contenu=message,  # ✅ Champ correct
                    timestamp=datetime.now()
                )
                db.add(new_message)
                db.commit()

                # Envoie au destinataire s’il est connecté
                if recipient_id in active_connections:
                    await active_connections[recipient_id].send_text(f"{user_id}|{message}")
                else:
                    await websocket.send_text("💾 Message sauvegardé (destinataire non connecté)")

            except Exception as e:
                print(f"❌ Erreur de réception : {e}")
                break

    except WebSocketDisconnect:
        print(f"🔌 Déconnexion de l'utilisateur {user_id}")
        if user_id in active_connections:
            del active_connections[user_id]
