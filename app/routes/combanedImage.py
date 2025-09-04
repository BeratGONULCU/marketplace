from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.combanedImage import ProductCombinedImage
from app.schemas.combanedImage import ProductCombinedImageSchema
from typing import List

router = APIRouter()

@router.get("/products/combined-images", response_model=List[ProductCombinedImageSchema])
def get_combined_images(db: Session = Depends(get_db)):
    images = db.query(ProductCombinedImage).order_by(ProductCombinedImage.sort).all()
    return images
