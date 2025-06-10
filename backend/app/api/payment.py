from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.models import Notification, PaymentMethod, Utilisateur, DemandeService  # Ensure DemandeService is imported
from app.schemas.compte_schema import PaymentMethodCreate, PaymentMethodOut
import requests
import os
import json
import stripe

router = APIRouter(prefix="/payment-methods", tags=["payment-methods"])

# ------------------------------ 
# Stripe API Configuration
stripe.api_key = "sk_test_51RWQmBQMoAMgO2I9kHr37erVpSSmUMavxaXgen34tyNx5a1TfeqVvOFxUchCAKkGETywpLVgnBnaOsVe2zgvDwv500ep7kqOac"

# Routes for managing classic payment methods
@router.post("/", response_model=PaymentMethodOut, status_code=status.HTTP_201_CREATED)
def create_payment_method(payment: PaymentMethodCreate, db: Session = Depends(get_db)):
    utilisateur = db.query(Utilisateur).filter(Utilisateur.utilisateurID == payment.utilisateurID).first()
    if not utilisateur:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    new_payment = PaymentMethod(
        utilisateurID=payment.utilisateurID,
        type=payment.type,
        details=payment.details,
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment

@router.get("/user/{utilisateur_id}", response_model=List[PaymentMethodOut])
def get_payment_methods_for_user(utilisateur_id: int, db: Session = Depends(get_db)):
    payments = db.query(PaymentMethod).filter(PaymentMethod.utilisateurID == utilisateur_id).all()
    return payments

@router.get("/{id}", response_model=PaymentMethodOut)
def get_payment_method(id: int, db: Session = Depends(get_db)):
    payment = db.query(PaymentMethod).filter(PaymentMethod.paymentMethodID == id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Mode de paiement non trouvé")
    return payment

@router.put("/{id}", response_model=PaymentMethodOut)
def update_payment_method(id: int, payment_update: PaymentMethodCreate, db: Session = Depends(get_db)):
    payment = db.query(PaymentMethod).filter(PaymentMethod.paymentMethodID == id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Mode de paiement non trouvé")
    payment.type = payment_update.type
    payment.details = payment_update.details
    db.commit()
    db.refresh(payment)
    return payment

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payment_method(id: int, db: Session = Depends(get_db)):
    payment = db.query(PaymentMethod).filter(PaymentMethod.paymentMethodID == id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Mode de paiement non trouvé")
    db.delete(payment)
    db.commit()
    return None

# ------------------------------
# PayPal Routes (order creation and capture)
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")
PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com"  # Sandbox or production

def get_paypal_access_token():
    auth_response = requests.post(
        f"{PAYPAL_API_BASE}/v1/oauth2/token",
        auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET),
        headers={"Accept": "application/json", "Accept-Language": "en_US"},
        data={"grant_type": "client_credentials"},
    )
    if auth_response.status_code != 200:
        raise HTTPException(status_code=500, detail="Impossible d'obtenir le token PayPal")
    return auth_response.json()["access_token"]

@router.post("/paypal/create-order")
def create_paypal_order(
    amount: float = Query(..., gt=0),
    utilisateur_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    access_token = get_paypal_access_token()

    order_data = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": f"{amount:.2f}"
                }
            }
        ],
        "application_context": {
            "return_url": "http://localhost:3000/payment-success",  # Replace with the actual return URL
            "cancel_url": "http://localhost:3000/payment-cancel",  # Replace with the actual cancel URL
        }
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }

    response = requests.post(f"{PAYPAL_API_BASE}/v2/checkout/orders", json=order_data, headers=headers)
    if response.status_code != 201:
        error_detail = response.json().get("message", "Erreur création commande PayPal")
        raise HTTPException(status_code=500, detail=error_detail)

    order = response.json()

    # Extracting the approval URL from PayPal's response
    approval_url = next(
        (link["href"] for link in order["links"] if link["rel"] == "approve"),
        None
    )

    if utilisateur_id:
        payment_db = PaymentMethod(
            utilisateurID=utilisateur_id,
            paypal_order_id=order["id"],
            amount=amount,
            status=order["status"],
            details=json.dumps(order),
        )
        db.add(payment_db)
        db.commit()
        db.refresh(payment_db)

    return {"approval_url": approval_url}  # Returning approval URL to frontend


@router.post("/paypal/capture-order/{order_id}")
def capture_paypal_order(
    order_id: str,
    utilisateur_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    access_token = get_paypal_access_token()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }

    response = requests.post(f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture", headers=headers)
    if response.status_code != 201:
        error_detail = response.json().get("message", "Erreur capture paiement PayPal")
        raise HTTPException(status_code=500, detail=error_detail)

    capture_data = response.json()

    if utilisateur_id:
        payment = db.query(PaymentMethod).filter(PaymentMethod.paypal_order_id == order_id).first()
        if payment:
            payment.status = capture_data["status"]
            payment.details = json.dumps(capture_data)
            db.commit()
            db.refresh(payment)
        else:
            payment = PaymentMethod(
                utilisateurID=utilisateur_id,
                paypal_order_id=order_id,
                amount=float(capture_data["purchase_units"][0]["payments"]["captures"][0]["amount"]["value"]),
                status=capture_data["status"],
                details=json.dumps(capture_data),
            )
            db.add(payment)
            db.commit()
            db.refresh(payment)

    return capture_data

# ------------------------------------------------------
# New route to simulate card payment and update the DemandeService
from pydantic import BaseModel

class PayCardRequest(BaseModel):
    paymentMethodID: int
    amount: float
    demandeID: int
@router.post("/pay-card")
def pay_with_card(payment: PayCardRequest, db: Session = Depends(get_db)):
    payment_method = db.query(PaymentMethod).filter(PaymentMethod.paymentMethodID == payment.paymentMethodID).first()
    if not payment_method:
        raise HTTPException(status_code=404, detail="Payment method not found")

    demande = db.query(DemandeService).filter(DemandeService.demandeServiceID == payment.demandeID).first()
    if not demande:
        raise HTTPException(status_code=404, detail="Service request not found")

    # Simulate successful payment
    payment_successful = True
    if not payment_successful:
        raise HTTPException(status_code=400, detail="Payment failed")

    # Marquer la demande comme complétée
    demande.etat = "completed"
    db.commit()

    # Récupérer client et prestataire
    client = db.query(Utilisateur).filter(Utilisateur.utilisateurID == demande.client_id).first()
    prestataire = db.query(Utilisateur).filter(Utilisateur.utilisateurID == demande.prestataireID).first()

    # 🔔 Créer une notification pour le prestataire
    notif = Notification(
        user_id=demande.prestataireID,
        titre="Paiement reçu",
        message=f"{client.nom} {client.prenom} a payé pour la demande #{demande.demandeServiceID}.",
        timestamp=datetime.now(),
        is_read=False,
        role="prestataire"
    )
    db.add(notif)
    db.commit()

    return {
        "success": True,
        "message": "Payment completed, service marked as completed, notification sent."
    }
