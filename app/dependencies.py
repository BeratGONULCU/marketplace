from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.auth import verify_token
from app.db import get_db
from app.models.user import User
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials

#oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
oauth2_scheme = HTTPBearer()

SECRET_KEY = "supersecret"  # aynı olmalı
ALGORITHM = "HS256"

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token geçersiz")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token doğrulanamadı")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    return user