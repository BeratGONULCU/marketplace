from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import SessionLocal, get_db
from app.models.product import Product
from app.models.category import Categories
from app.models.user import User
from app.schemas.product import ProductCreate,ProductOut
from app.dependencies import get_current_user

router = APIRouter(prefix="/products", tags=["products"])

#CREATE product ( GET İŞLEMLERİ HARİÇ HER CRUD İŞLEMİ İÇİN ADMİN ŞARTI OLACAK.. )
@router.post("/", response_model=ProductOut)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="you have to be admin to create a new product"
        )

    # user_id'yi elle ekle
    product_data = payload.model_dump(exclude={"category_ids"})
    product_data["user_id"] = current_user.id

    new_product = Product(**product_data)

    # Kategorileri ilişkilendir
    if payload.category_ids:
        categories = db.query(Categories).filter(Categories.id.in_(payload.category_ids)).all()
        if len(categories) != len(payload.category_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more category IDs are invalid."
            )
        new_product.categories = categories

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
def delete_product_by_id(product_id:int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="you " \
            "have to be admin to create a new product"            
            )
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product Not Found To Delete")
    
    db.delete(product)
    db.commit()
    return product

#UPDATE product
