from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal,get_db

from app.models.category import Categories
from app.schemas.category import CategoryCreate,CategoryOut,CategoryUpdate

router = APIRouter(prefix="/categories", tags=["categories"])

# ADMİN KONTROLÜ GEREKİYOR. EKLENECEK.
@router.post("/" ,response_model=CategoryOut)
def category_create(payload: CategoryCreate,db: Session = Depends(get_db)):
    new_category = Categories(**payload.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


@router.get("/",response_model=list[CategoryOut])
def get_all_categories(db: Session = Depends(get_db)):
    return db.query(Categories).all()


@router.get("/{category_id}", response_model=CategoryOut)
def get_category_id(category_id:int , db: Session = Depends(get_db)):
    category = db.query(Categories).filter(Categories.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404,detail="not found the category with that id")
    return category

@router.delete("/{category_id}", response_model=CategoryOut)
def delete_category_by_id(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Categories).filter(Categories.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404,detail="category not found to delete")
    db.delete(category)
    db.commit()
    return category

#UPDATE
@router.put("/{category_id}", response_model=CategoryOut)
def update_category_by_id(category_id: int, payload: CategoryUpdate, db: Session = Depends(get_db)):
    category = db.query(Categories).filter(Categories.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Size not found with that id")
    
    category.name = payload.name  # gelen veriye göre güncelleme
    category.slug = payload.slug
    db.commit()
    db.refresh(category)  # güncel halini almak için
    return category