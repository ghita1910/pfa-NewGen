from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Favorite
from typing import List

router = APIRouter(prefix="/favorites", tags=["favorites"])

@router.post("/add")
def add_favorite(client_id: int, prestataire_id: int, db: Session = Depends(get_db)):
    existing = db.query(Favorite).filter_by(client_id=client_id, prestataire_id=prestataire_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Favorite already exists.")

    favorite = Favorite(client_id=client_id, prestataire_id=prestataire_id)
    db.add(favorite)
    db.commit()
    return {"message": "Favorite added."}




@router.delete("/remove")
def remove_favorite(client_id: int, prestataire_id: int, db: Session = Depends(get_db)):
    favorite = db.query(Favorite).filter_by(client_id=client_id, prestataire_id=prestataire_id).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found.")

    db.delete(favorite)
    db.commit()
    return {"message": "Favorite removed."}



@router.get("/", response_model=List[int])
def get_favorites(client_id: int, db: Session = Depends(get_db)):
    favorites = db.query(Favorite).filter_by(client_id=client_id).all()
    return [fav.prestataire_id for fav in favorites]




@router.get("/is-favorite")
def is_favorite(client_id: int, prestataire_id: int, db: Session = Depends(get_db)):
    favorite = db.query(Favorite).filter_by(client_id=client_id, prestataire_id=prestataire_id).first()
    return {"is_favorite": favorite is not None}
