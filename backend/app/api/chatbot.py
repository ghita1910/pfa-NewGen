import json
import re
from sqlalchemy import text
import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, APIRouter, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

from app.db.database import get_db
from app.models.models import DemandeService, Message, Notification, Prestataire, Utilisateur

load_dotenv()

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

client = InferenceClient(
    provider="nebius",
    api_key=os.getenv("HF_TOKEN")
)


# Entrée utilisateur
class ChatInput(BaseModel):
    prompt: str

# Chat classique (sans mémoire), + ENREGISTREMENT en base
@router.post("/")
def analyze_input(data: ChatInput, db: Session = Depends(get_db)):
    try:
        completion = client.chat.completions.create(
            model="meta-llama/Llama-3.1-8B-Instruct",
            messages=[{"role": "user", "content": data.prompt}],
        )

        if completion.choices and len(completion.choices) > 0:
            response = completion.choices[0].message.content

            # Sauvegarder les deux messages sans user_id
            db.add_all([
                Message(sender_id=None, receiver_id=None, contenu=data.prompt, is_read=True),
                Message(sender_id=None, receiver_id=None, contenu=response, is_read=False)
            ])
            db.commit()

            return {"result": response}
        else:
            raise HTTPException(status_code=500, detail="Aucune réponse du modèle.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur API Hugging Face : {str(e)}")

# Chat avec mémoire par user_id
@router.post("/memory/{user_id}")
def analyze_with_memory(user_id: int, data: ChatInput, db: Session = Depends(get_db)):
    try:
        messages_db = (
            db.query(Message)
            .filter(
                ((Message.sender_id == user_id) & (Message.receiver_id == None)) |
                ((Message.sender_id == None) & (Message.receiver_id == user_id))
            )
            .order_by(Message.timestamp.asc())
            .all()
        )

        formatted_messages = [
            {"role": "user" if msg.sender_id == user_id else "assistant", "content": msg.contenu}
            for msg in messages_db
        ]
        formatted_messages.append({"role": "user", "content": data.prompt})

        completion = client.chat.completions.create(
            model="meta-llama/Llama-3.1-8B-Instruct",
            messages=formatted_messages,
        )

        if completion.choices and len(completion.choices) > 0:
            response = completion.choices[0].message.content

            db.add_all([
                Message(sender_id=user_id, receiver_id=None, contenu=data.prompt, is_read=True),
                Message(sender_id=None, receiver_id=user_id, contenu=response, is_read=False)
            ])
            db.commit()

            return {"result": response}
        else:
            raise HTTPException(status_code=500, detail="Aucune réponse générée.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur avec mémoire : {str(e)}")

# Récupérer l'historique utilisateur (avec user2 optionnel)
@router.get("/messages/history")
def get_chat_history(
    user1: int,
    user2: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        messages = db.query(Message).filter(
            ((Message.sender_id == user1) & (Message.receiver_id == user2)) |
            ((Message.sender_id == user2) & (Message.receiver_id == user1))
        ).order_by(Message.timestamp.asc()).all()

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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur historique : {str(e)}")

# Récupérer l'historique utilisateur avec chatbot (mémoire)
@router.get("/messages/{user_id}")
def get_chatbot_messages(user_id: int, db: Session = Depends(get_db)):
    messages = (
        db.query(Message)
        .filter(
            ((Message.sender_id == user_id) & (Message.receiver_id == None)) |
            ((Message.sender_id == None) & (Message.receiver_id == user_id))
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

@router.get("/memory/history/{user_id}")
def get_memory_formatted_history(user_id: int, db: Session = Depends(get_db)):
    messages = (
        db.query(Message)
        .filter(
            ((Message.sender_id == user_id) & (Message.receiver_id == None)) |
            ((Message.sender_id == None) & (Message.receiver_id == user_id))
        )
        .order_by(Message.timestamp.asc())
        .all()
    )

    return [
        {
            "from": msg.sender_id,
            "text": msg.contenu
        }
        for msg in messages
    ]


class IntentInput(BaseModel):
    prompt: str
    

# 🌍 Fonction universelle de normalisation des dates/heures
def normalize_date_and_time(prompt: str) -> str:
    prompt = prompt.lower()
    today = datetime.today().date()
    tomorrow = today + timedelta(days=1)

    replacements = {
        # 🇫🇷 Français
        "aujourd'hui": today.strftime("%d/%m/%Y"),
        "demain": tomorrow.strftime("%d/%m/%Y"),
        "maintenant": datetime.now().strftime("%Hh"),

        # 🇬🇧 Anglais
        "today": today.strftime("%d/%m/%Y"),
        "tomorrow": tomorrow.strftime("%d/%m/%Y"),
        "now": datetime.now().strftime("%Hh"),

        # 🇴🇲 Arabe (translittération)
        "lyom": today.strftime("%d/%m/%Y"),
        "ghda": tomorrow.strftime("%d/%m/%Y"),
        "daba": datetime.now().strftime("%Hh"),

        # fautes fréquentes
        "2day": today.strftime("%d/%m/%Y"),
        "tooday": today.strftime("%d/%m/%Y"),
        "todai": today.strftime("%d/%m/%Y"),
        "toodaaay": today.strftime("%d/%m/%Y"),
        "2morrow": tomorrow.strftime("%d/%m/%Y"),
        "tmr": tomorrow.strftime("%d/%m/%Y"),
        "rn": datetime.now().strftime("%Hh"),
        "right now": datetime.now().strftime("%Hh"),
    }

    for key, val in replacements.items():
        prompt = re.sub(rf"\b{re.escape(key)}\b", val, prompt)
    return prompt

# 🤖 Extraction intelligente via LLM
def extract_info(prompt: str) -> Optional[dict]:
    allowed_services = [
        "cleaning", "repairing", "painting", "laundry", "appliance",
        "plumbing", "shifting", "beauty", "ac repair", "vehicle",
        "electronics", "massage", "men’s salon"
    ]

    system_prompt = f"""Tu es un assistant intelligent.
Tu dois extraire des informations à partir d'une phrase utilisateur.
Tu retourneras uniquement un JSON avec les champs :
- "service" (en anglais, et seulement parmi cette liste : {allowed_services})
- "date" (au format jj/mm/aaaa)
- "heure" (format 24h)

Si une information est absente ou floue, tu mets "null".

Exemples :
"Je veux un cleaner à 10h le 30/06/2025" => {{"service": "cleaning", "date": "30/06/2025", "heure": "10:00"}}
"Je cherche un massage demain à 17h" => {{"service": "massage", "date": "07/06/2025", "heure": "17:00"}}

Ne réponds que par du JSON propre, sans texte autour."""

    try:
        completion = client.chat.completions.create(
            model="meta-llama/Llama-3.1-8B-Instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
        )
        return json.loads(completion.choices[0].message.content.strip())
    except:
        return None

# 📩 Route avec intention intelligente
@router.post("/intent/{user_id}")
def handle_intent(user_id: int, data: IntentInput, db: Session = Depends(get_db)):
    prompt = normalize_date_and_time(data.prompt)
    parsed = extract_info(prompt)

    if not parsed:
        raise HTTPException(status_code=400, detail="Impossible d'analyser la phrase. Veuillez reformuler.")

    missing_fields1 = []
    missing_fields2 = []
    missing_fields3 = []
    if parsed["service"] in [None, "null"]:
        missing_fields1.append("service")
    if parsed["date"] in [None, "null"]:
        missing_fields2.append("date")
    if parsed["heure"] in [None, "null"]:
        missing_fields3.append("heure")

    if missing_fields1:
        raise HTTPException(
            status_code=400,
            detail=f"Informations manquantes : {', '.join(missing_fields1)}. Service attendu parmi : {', '.join(['cleaning', 'repairing', 'painting', 'laundry', 'appliance', 'plumbing', 'shifting', 'beauty', 'ac repair', 'vehicle', 'electronics', 'massage', 'men’s salon'])}"
        )
    if missing_fields2:
        raise HTTPException(
            status_code=400,
            detail=f"Informations manquantes : {', '.join(missing_fields2)}. date attendue au format jj/mm/aaaa.'"
        )
    if missing_fields3:
        raise HTTPException(
            status_code=400,
            detail=f"Informations manquantes : {', '.join(missing_fields3)}. heure attendue au format 24h (HH:MM).'"
        )

    service = parsed["service"]
    date_str = parsed["date"]
    heure = parsed["heure"]

    try:
        date_obj = datetime.strptime(date_str, "%d/%m/%Y").date()
    except:
        raise HTTPException(status_code=400, detail="Format de date invalide. Utilisez jj/mm/aaaa.")

    prestataire = (
        db.query(Prestataire)
        .join(Utilisateur)
        .filter(Prestataire.specialite.ilike(f"%{service}%"))
        .filter(Prestataire.isApproved == True)
        .first()
    )

    if not prestataire:
        raise HTTPException(status_code=404, detail=f"Aucun prestataire trouvé pour le service '{service}'.")
    
        # Chercher la première adresse du client
    adresse_row = db.execute(
        text('SELECT "adresseID" FROM "Adresse" WHERE "utilisateurID" = :uid ORDER BY "adresseID" ASC LIMIT 1'),
        {"uid": user_id}
    ).first()   


    if not adresse_row:
        raise HTTPException(status_code=404, detail="Aucune adresse trouvée pour ce client.")

    adresse_id = adresse_row[0]


    demande = DemandeService(
        adresseID=adresse_id,
        Date=date_obj,
        heure=heure,
        etat="en attente",
        description=f"Réservation automatique par chatbot pour {service}.",
        client_id=user_id,
        prestataireID=prestataire.prestataireID
    )
    db.add(demande)
    db.commit()
    db.refresh(demande)

    client = db.query(Utilisateur).filter(Utilisateur.utilisateurID == user_id).first()
    # Récupération de l'adresse réelle
    adresse_obj = db.execute(
        text('SELECT "adresse" FROM "Adresse" WHERE "adresseID" = :aid'),
        {"aid": adresse_id}
    ).first()
    adresse_text = adresse_obj[0] if adresse_obj else "adresse inconnue"

    notif = Notification(
        user_id=prestataire.prestataireID,
        titre="Nouvelle demande automatique",
        message=(
            f"{client.nom} {client.prenom} vous a envoyé une demande pour le service '{service}' "
            f"le {date_str} à {heure}, à l’adresse suivante : {adresse_text}."
        ),
        timestamp=datetime.now(),
        is_read=False,
        role="prestataire"
    )

    db.add(notif)
    db.commit()
    # 🔔 Notification pour le client (lui-même)
    notif_client = Notification(
        user_id=user_id,
        titre="Demande envoyée",
        message=(
            f"Votre demande pour le service '{service}' a été envoyée à {prestataire.utilisateur.nom} {prestataire.utilisateur.prenom} "
            f"le {date_str} à {heure}. L’adresse utilisée est : {adresse_text}."
        ),
        timestamp=datetime.now(),
        is_read=False,
        role="client"
    )
    db.add(notif_client)
    db.commit()

    # Enregistrer le message de l’utilisateur et la réponse générée dans la table Message
    db.add_all([
        Message(sender_id=user_id, receiver_id=None, contenu=data.prompt, is_read=True),
        Message(sender_id=None, receiver_id=user_id, contenu=f"✅ Votre demande pour le service {service} le {date_str} à {heure} a été envoyée. Veuillez attendre la confirmation du prestataire. Consultez votre calendrier pour plus de détails.", is_read=False)
    ])
    db.commit()

    return {
       "message": f"✅ Votre demande pour le service {service} le {date_str} à {heure} a été envoyée. Veuillez attendre la confirmation du prestataire. Consultez votre calendrier pour plus de détails.",
        "prestataire": {
            "nom": prestataire.utilisateur.nom,
            "prenom": prestataire.utilisateur.prenom,
            "specialite": prestataire.specialite
        },
        "demande_id": demande.demandeServiceID
    }

