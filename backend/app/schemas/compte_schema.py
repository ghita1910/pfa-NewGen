from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import re

# ✅ Schéma principal utilisé pour l'inscription (côté compte uniquement)
class CompteCreate(BaseModel):
    email: Optional[EmailStr] = None
    tel: Optional[str] = None
    password: str

    @field_validator("tel")
    @classmethod
    def validate_phone(cls, v):
        if not v:  # accepte None ou ""
            return None
        if not re.fullmatch(r"0[67]\d{8}", v):
            raise ValueError("Numéro de téléphone marocain invalide")
        return v

# ✅ Schéma pour les infos utilisateur (client ou prestataire)
class UtilisateurCreate(BaseModel):
    nom: str
    prenom: str
    age: Optional[int]
    gender: Optional[str]
    role: str  # "client" ou "prestataire"
    username: str
    photo: Optional[str]  # chemin de la photo

# ✅ Schéma spécifique pour les prestataires
class PrestataireCreate(BaseModel):
    description: Optional[str]
    specialite: Optional[str]
    tarif: Optional[float]
    typeTarif: Optional[str]
    cin_photo: Optional[str]
    cv: Optional[str]
    experience: Optional[str]

# ✅ Schéma de connexion
class CompteLogin(BaseModel):
    email: Optional[EmailStr] = None
    tel: Optional[str] = None
    password: str

class CompteCheck(BaseModel):
    email: Optional[EmailStr] = None
    tel: Optional[str] = None
class PrestataireOut(BaseModel):
    prestataireID: int
    description: Optional[str]
    specialite: Optional[str]
    tarif: Optional[float]
    typeTarif: Optional[str]
    experience: Optional[str]
    rating: Optional[float]
    isApproved: Optional[bool]

    nom: str
    prenom: str
    username: str
    adresse: str
    telephone: Optional[str]
    photo: Optional[str]

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    model_config = {
        "from_attributes": True
    }

from datetime import date

class DemandeServiceCreate(BaseModel):
    adresseID: int
    Date: date
    heure: str
    etat: str = "en attente"
    description: str
    client_id: int
    prestataireID: int  

class DemandeServiceOut(BaseModel):
    demandeServiceID: int
    adresseID: int
    Date: date
    heure: str
    etat: str
    description: str
    client_id: int
    prestataireID: int

    model_config = {
        "from_attributes": True
    }

class DemandeServiceEtatUpdate(BaseModel):
    etat: str  


class DemandeServiceFull(BaseModel):
    demandeServiceID: int
    Date: date
    heure: str
    etat: str
    description: str
    client_id: int
    prestataireID: int

    nom_client: str
    adresse: str
    username: str
    photo: Optional[str]

    prestataire_nom: Optional[str]
    prestataire_prenom: Optional[str]

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    montant:Optional[float]=None

    model_config = {
        "from_attributes": True
    }

class PrestataireOut2(BaseModel):
    cin_photo: Optional[str]
    cv: Optional[str]
    email: Optional[EmailStr]
    prestataireID: int
    description: Optional[str]
    specialite: Optional[str]
    tarif: Optional[float]
    typeTarif: Optional[str]
    experience: Optional[str]
    rating: Optional[float]
    isApproved: Optional[bool]
    nom: str
    prenom: str
    username: str
    adresse: str
    telephone: Optional[str]
    photo: Optional[str]

    model_config = {
        "from_attributes": True
    }

class PaymentMethodBase(BaseModel):
    utilisateurID: int
    type: str
    details: str | None = None  # Changed from email to details

class PaymentMethodCreate(PaymentMethodBase):
    pass

class PaymentMethodOut(PaymentMethodBase):
    paymentMethodID: int

    class Config:
        orm_mode = True