from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.product import Product
from app.schemas.product import ProductCreate,ProductOut

router = APIRouter(prefix="/products", tags=["products"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#CREATE product ( GET İŞLEMLERİ HARİÇ HER CRUD İŞLEMİ İÇİN ADMİN ŞARTI OLACAK.. )
@router.post("/", response_model=ProductOut)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(**payload.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

#GET all
@router.get("/",response_model=list[ProductOut])
def get_all_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

#GET by_id
@router.get("/{product_id}", response_model=ProductOut)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product: 
        raise HTTPException(status_code=404 ,detail="Product Not Found")
    return product

#DELETE product_by_id
@router.delete("/{product_id}", response_model=ProductOut)
def delete_product_by_id(product_id:int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product Not Found To Delete")
    
    db.delete(product)
    db.commit()
    return product

#UPDATE product
