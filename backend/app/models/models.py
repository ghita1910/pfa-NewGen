from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
from app.db.database import Base

class Utilisateur(Base):
    __tablename__ = "Utilisateur"

    utilisateurID = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100))
    prenom = Column(String(100))
    email = Column(String(255))
    tel = Column(String(20))
    adresse = Column(Text)
    role = Column(String(20), default="client")  # Rôle par défaut à 'client'
    comptes = relationship("Compte", back_populates="utilisateur")
    factures = relationship("Facture", back_populates="utilisateur")
    prestataire = relationship("Prestataire", back_populates="utilisateur", uselist=False)


class Compte(Base):
    __tablename__ = "Compte"

    compteID = Column(Integer, primary_key=True, index=True)
    email = Column(String(255))
    username = Column(String(50), unique=True)  # ← ajouté ici
    password = Column(String(255))
    tel = Column(String(20))
    utilisateurID = Column(Integer, ForeignKey("Utilisateur.utilisateurID"), nullable=True)


    utilisateur = relationship("Utilisateur", back_populates="comptes")



class DemandeService(Base):
    __tablename__ = "DemandeService"

    demandeServiceID = Column(Integer, primary_key=True, index=True)
    adresse = Column(Text)
    Date = Column(Date)
    heure = Column(Time)
    etat = Column(String(50))
    nombreUnite = Column(Integer)
    unite = Column(String(50))

    service = relationship("Service", back_populates="demande")
    prestataires = relationship("Prestataire", back_populates="demande")
    factures = relationship("Facture", back_populates="demande")


class Service(Base):
    __tablename__ = "Service"

    serviceID = Column(Integer, primary_key=True, index=True)
    categorie = Column(String(100))
    demandeServiceID = Column(Integer, ForeignKey("DemandeService.demandeServiceID"))

    demande = relationship("DemandeService", back_populates="service")
    prestataires = relationship("Prestataire", back_populates="service")


class Prestataire(Base):
    __tablename__ = "Prestataire"

    prestataireID = Column(Integer, ForeignKey("Utilisateur.utilisateurID"), primary_key=True)
    description = Column(Text)
    rating = Column(Float)
    specialite = Column(String(100))
    tarif = Column(Float)
    typeTarif = Column(String(50))
    demandeServiceID = Column(Integer, ForeignKey("DemandeService.demandeServiceID"))
    serviceID = Column(Integer, ForeignKey("Service.serviceID"))

    utilisateur = relationship("Utilisateur", back_populates="prestataire")
    demande = relationship("DemandeService", back_populates="prestataires")
    service = relationship("Service", back_populates="prestataires")


class Facture(Base):
    __tablename__ = "Facture"

    factureID = Column(Integer, primary_key=True, index=True)
    Date = Column(Date)
    montant = Column(Integer)
    utilisateurID = Column(Integer, ForeignKey("Utilisateur.utilisateurID"))
    demandeServiceID = Column(Integer, ForeignKey("DemandeService.demandeServiceID"))

    utilisateur = relationship("Utilisateur", back_populates="factures")
    demande = relationship("DemandeService", back_populates="factures")

