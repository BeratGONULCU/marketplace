from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate,UserOut

router = APIRouter(prefix="/users", tags=["users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.push("/", response_model=UserOut)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    #burada admin kontrolü olacak eğer is_admin == 1 ise oluşturmasına izin verecek.
    return 1





#CREATE user (if user.is_admin == True)