from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, Text, Float, ForeignKey, Date, Time,Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base
from sqlalchemy.sql import func

class Utilisateur(Base):
    __tablename__ = "Utilisateur"

    utilisateurID = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100))
    prenom = Column(String(100))
    email = Column(String(255))
    tel = Column(String(20))
    role = Column(String(20), default="client")
    age = Column(Integer)
    gender = Column(String(10))
    username = Column(String(50), unique=True)
    photo = Column(String, nullable=True)

    adresses = relationship("Adresse", back_populates="utilisateur")
    comptes = relationship("Compte", back_populates="utilisateur")
    factures = relationship("Facture", back_populates="utilisateur")
    prestataire = relationship("Prestataire", back_populates="utilisateur", uselist=False)
    demandes_client = relationship("DemandeService", back_populates="client")
    payment_methods = relationship("PaymentMethod", back_populates="utilisateur")


    # ✅ Use distinct names and back_populates (not backref)
    favorites_as_client = relationship("Favorite", foreign_keys="[Favorite.client_id]", back_populates="client")
    favorites_as_prestataire = relationship("Favorite", foreign_keys="[Favorite.prestataire_id]", back_populates="prestataire")

from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.models import Utilisateur  # ensure this is imported correctly if used directly

class Favorite(Base):
    __tablename__ = "Favorite"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("Utilisateur.utilisateurID"), nullable=False)
    prestataire_id = Column(Integer, ForeignKey("Utilisateur.utilisateurID"), nullable=False)

    client = relationship("Utilisateur", foreign_keys=[client_id], backref="favorites_sent")
    prestataire = relationship("Utilisateur", foreign_keys=[prestataire_id], backref="favorites_received")


class Compte(Base):
    __tablename__ = "Compte"

    compteID = Column(Integer, primary_key=True, index=True)
    email = Column(String(255))
    password = Column(String(255))
    tel = Column(String(20))
    utilisateurID = Column(Integer, ForeignKey("Utilisateur.utilisateurID"), nullable=True)

    utilisateur = relationship("Utilisateur", back_populates="comptes")

class DemandeService(Base):
    __tablename__ = "DemandeService"

    demandeServiceID = Column(Integer, primary_key=True, index=True)
    adresseID = Column(Integer, ForeignKey("Adresse.adresseID"))

    Date = Column(Date, nullable=False)
    heure = Column(String, nullable=False)
    etat = Column(String(50), default="en attente")
    description = Column(Text, nullable=False)

    client_id = Column(Integer, ForeignKey("Utilisateur.utilisateurID"), nullable=False)
    prestataireID = Column(Integer, ForeignKey("Prestataire.prestataireID"), nullable=False)

    adresse = relationship("Adresse", back_populates="demandes")
    client = relationship("Utilisateur", back_populates="demandes_client")
    prestataire = relationship("Prestataire", back_populates="demandes_prestataire")
    factures = relationship("Facture", back_populates="demande")  # ❌ manquant






class Prestataire(Base):
    __tablename__ = "Prestataire"

    prestataireID = Column(Integer, ForeignKey("Utilisateur.utilisateurID"), primary_key=True)
    description = Column(Text)
    rating = Column(Float)
    specialite = Column(String(100))
    tarif = Column(Float)
    typeTarif = Column(String(50))
   
    cin_photo = Column(Text)
    cv = Column(Text)
    experience = Column(Text)
    isApproved = Column(Boolean, default=False)

    utilisateur = relationship("Utilisateur", back_populates="prestataire")

    demandes_prestataire = relationship("DemandeService", back_populates="prestataire")





class Facture(Base):
    __tablename__ = "Facture"

    factureID = Column(Integer, primary_key=True, index=True)
    Date = Column(Date)
    montant = Column(Float)
    utilisateurID = Column(Integer, ForeignKey("Utilisateur.utilisateurID"))
    demandeServiceID = Column(Integer, ForeignKey("DemandeService.demandeServiceID"))

    utilisateur = relationship("Utilisateur", back_populates="factures")
    demande = relationship("DemandeService", back_populates="factures")
    

class Adresse(Base):
    __tablename__ = "Adresse"

    adresseID = Column(Integer, primary_key=True, index=True)
    adresse = Column(Text, nullable=False)  # Existing address text
    latitude = Column(Float, nullable=True)  # New: latitude coordinate
    longitude = Column(Float, nullable=True)  # New: longitude coordinate
    utilisateurID = Column(Integer, ForeignKey("Utilisateur.utilisateurID"))
    demandes = relationship("DemandeService", back_populates="adresse")
    utilisateur = relationship("Utilisateur", back_populates="adresses")

class PaymentMethod(Base):
    __tablename__ = "PaymentMethod"

    paymentMethodID = Column(Integer, primary_key=True, index=True)
    utilisateurID = Column(Integer, ForeignKey("Utilisateur.utilisateurID"), nullable=False)
    type = Column(String(50), nullable=False)  # e.g., 'paypal', 'stripe', etc.
    details = Column(Text, nullable=True)       # JSON or text details about payment method
    createdAt = Column(DateTime(timezone=True), server_default=func.now())

    utilisateur = relationship("Utilisateur", back_populates="payment_methods")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    role = Column(String(20), nullable=False)  # "client" ou "prestataire"
    titre = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("Utilisateur.utilisateurID"), nullable=True)
    receiver_id = Column(Integer, ForeignKey("Utilisateur.utilisateurID"), nullable=True)
    contenu = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)

    sender = relationship("Utilisateur", foreign_keys=[sender_id])
    receiver = relationship("Utilisateur", foreign_keys=[receiver_id])
