from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import SessionLocal,get_db
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext

from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserCreate,UserOut,LoginSchema,Token
from app.auth import create_access_token

router = APIRouter(prefix="/users", tags=["users"])

# şifreleri karşılaştırmak için hash context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create API
@router.post("/register", response_model=UserOut)
def create_user(payload: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
        
    if existing_user:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı.")
  
    # Admin Check
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="you " \
            "have to be admin to create a user"
        )
    hashed_pw = pwd_context.hash(payload.hashed_password)  # hash password 

    db_user = User( # --> datas
        email= payload.email,
        hashed_password= hashed_pw,
        role= payload.role,
        is_active= payload.is_active,
        is_admin= payload.is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Login API
@router.post("/login",response_model=Token)
def login(form_data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.email).first()

    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="geçersiz e-posta ya da parola"
        )
    
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type":"bearer"}

# Get API
@router.get("/me", response_model=UserOut)
def read_logged_in_user(current_user: User = Depends(get_current_user)):
    return current_user




