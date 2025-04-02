import jwt
from datetime import datetime, timedelta,timezone
from passlib.context import CryptContext
from app.schemas.compte_schema import CompteLogin

# Clé secrète pour signer le JWT (à garder privée et sécurisée)
SECRET_KEY = "ta_clé_secrète"  # Change cela avec une clé secrète sécurisée
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300000  # Temps d'expiration du token (en minutes)

# Pour le hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Fonction pour créer un token JWT
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Fonction pour vérifier le token
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Le token a expiré")
    except jwt.JWTError:
        raise Exception("Token invalide")
