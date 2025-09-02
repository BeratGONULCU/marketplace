from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import SessionLocal, get_db
from app.dependencies import get_current_user
from app.models.color import Color
from app.models.user import User
from app.schemas.color import ColorCreate,ColorOut,ColorUpdate

router = APIRouter(prefix="/colors", tags=["colors"])


#CREATE COLOR ( GET İŞLEMLERİ HARİÇ HER CRUD İŞLEMİ İÇİN ADMİN ŞARTI OLACAK.. )
@router.post("/", response_model=ColorOut)
def color_create(payload: ColorCreate, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )
    
    new_color = Color(**payload.model_dump())
    db.add(new_color)
    db.commit()
    db.refresh(new_color)
    return new_color

#GET COLOR
@router.get("/",response_model=list[ColorOut])
def get_all_colors(db: Session = Depends(get_db)):
    return db.query(Color).all()


#GET BY ID COLOR 
@router.get("/{color_id}",response_model=ColorOut)
def get_color_by_id(color_id: int, db: Session = Depends(get_db)):
    color = db.query(Color).filter(Color.id == color_id).first()
    if not color:
        raise HTTPException(status_code=404, detail="color not found with that id")
    return color


#DELETE COLOR
@router.delete("/{color_id}",response_model=ColorOut)
def delete_color_by_id(color_id: int,db:Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )

    color = db.query(Color).filter(Color.id == color_id).first()
    if not color: 
        raise HTTPException(status_code=404, detail="silmek istediğin renk yok")
    
    db.delete(color)
    db.commit()
    return color

#UPDATE COLOR
@router.put("/{color_id}", response_model=ColorOut)
def update_color_by_id(color_id: int, payload: ColorUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )    
    
    color = db.query(Color).filter(Color.id == color_id).first()
    if not color:
        raise HTTPException(status_code=404, detail="Size not found with that id")
    
    color.name = payload.name  # gelen veriye göre güncelleme
    color.hex = payload.hex
    db.commit()
    db.refresh(color)  # güncel halini almak için
    return color