from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session
from app.db import SessionLocal,get_db

from app.dependencies import get_current_user
from app.models.product_image import ProductImage
from app.models.user import User
from app.schemas.product_image import ProductImageCreate,ProductImageOut,ProductImageUpdate

router = APIRouter(prefix="/productImage", tags=["Product Image"])

#CREATE 
@router.post("/",response_model=ProductImageOut)
def ProductImage_create(payload: ProductImageCreate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )
    
    new_Image = ProductImage(**payload.model_dump())
    db.add(new_Image)
    db.commit()
    db.refresh(new_Image)
    return new_Image

#DELETE
@router.delete("/{image_id}",response_model=ProductImageOut)
def ProductImage_delete(image_id: int, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )
    
    image = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not image:
        raise(
            HTTPException(status_code=404,detail="silinmek istenen ürün resmi bulunamadı.")
        )
    db.delete(image)
    db.commit()
    return image

#GET All
@router.get("/",response_model=list[ProductImageOut])
def get_all_productImage(db: Session = Depends(get_db)):
    return db.query(ProductImage).all()

#GET ID
@router.get("/{image_id}",response_model=ProductImageOut)
def get_productImage_by_id(image_id: int,db: Session = Depends(get_db)):
    image = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not image:
        raise HTTPException(
            status_code=404,
            detail="istenen ürün bulunamadı"
        )
    return image

#UPDATE
@router.put("/{image_id}",response_model=ProductImageOut)
def update_productImage(image_id: int,payload: ProductImageUpdate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )     
        
    image = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not image: 
        raise HTTPException(
            status_code=404,
            detail="aranan ürün resmi bulunamadı "
        )
    
    image.product_id = payload.product_id
    image.url = payload.url
    image.sort = payload.sort
    db.commit()
    db.refresh()
    return image