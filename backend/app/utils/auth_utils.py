from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.utils.jwt_utils import verify_token  # Import de la fonction pour vérifier le token

# On définit l'URL pour la récupération du token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/signin")

# Fonction pour extraire et vérifier le token
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = verify_token(token)  # Vérifie le token et renvoie les données
        return payload  # Renvoie les informations extraites du token (par exemple: email, rôle)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},  # Détails pour l'authentification Bearer
        )
