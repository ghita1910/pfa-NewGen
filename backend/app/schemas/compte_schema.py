from pydantic import BaseModel, EmailStr, field_validator
import re
from typing import Optional

class CompteCreate(BaseModel):
    email: Optional[EmailStr] = None
    tel: Optional[str] = None
    password: str
    nom: str
    prenom: str
    adresse: str
    username: str
    role: str

    # ✅ Vérifier que le téléphone est bien formaté
    @field_validator("tel")
    @classmethod
    def validate_phone(cls, v):
        if v is None:
            return v
        if not re.fullmatch(r"0[67]\d{8}", v):
            raise ValueError("Numéro de téléphone marocain invalide")
        return v



class CompteOut(BaseModel):
    email: Optional[EmailStr] = None
    tel: Optional[str] = None
    username: str
    isAdmin: bool  

    model_config = {
        "from_attributes": True
    }



class CompteLogin(BaseModel):
    email: Optional[EmailStr] = None
    tel: Optional[str] = None
    password: str

