from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session
from app.db import SessionLocal,get_db

from app.dependencies import get_current_user
from app.models.product_color_image import ProductColorImage
from app.models.user import User
from app.schemas.product_color_image import ProductColorCreate,ProductColorOut,ProductColorUpdate

router = APIRouter(prefix="/productColorImage", tags=["Color Image"])

#CREATE 
@router.post("/",response_model=ProductColorOut)
def create_productColor(payload: ProductColorCreate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )  
    
    new_productColor = ProductColorImage(**payload.model_dump())
    db.add(new_productColor)
    db.commit()
    db.refresh(new_productColor)
    return new_productColor


#GET All
@router.get("/",response_model=list[ProductColorOut])
def get_all_productColor(db: Session = Depends(get_db)):
    return db.query(ProductColorImage).all()

#GET ID
@router.get("/{color_id}",response_model=ProductColorOut)
def get_productColor_by_id(color_id: int, db: Session = Depends(get_db)):
    color = db.query(ProductColorImage).filter(ProductColorImage.id == color_id).first()
    if not color:
        raise HTTPException(
            status_code=404,
            detail="aranan ürün rengi bulunamadı"
        )
    return color

#DELETE 
@router.delete("/{color_id}",response_model=ProductColorOut)
def delete_productColor(color_id: int, db: Session = Depends(get_db),current_user : User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )      
    
    color = db.query(ProductColorImage).filter(ProductColorImage.id == color_id).first()
    if not color:
        raise HTTPException(
            status_code=404,
            detail="aranan ürün rengi bulunamadı"
        )
    db.delete(color)
    db.commit()
    return color

#UPDATE
@router.put("/{color_id}",response_model=ProductColorOut)
def update_productColor(color_id: int,payload: ProductColorUpdate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )  
    
    color = db.query(ProductColorImage).filter(ProductColorImage.id == color_id).first()
    if not color: 
        raise HTTPException(
            status_code=404,
            detail="aranan ürün rengi bulunamadı"
        )
    
    color.product_id = payload.product_id
    color.color_id = payload.color_id
    color.url = payload.url
    color.sort = payload.sort
    db.commit()
    db.refresh(color)
    return color