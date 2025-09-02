from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session,joinedload
from app.db import SessionLocal, get_db
from app.models.product import Product
from app.models.category import Categories
from app.models.product_variant import ProductVariant
from app.models.user import User
from app.schemas.product import ProductCreate,ProductOut
from app.dependencies import get_current_user
from app.schemas.product_variant import VariantCreate, VariantOut

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", response_model=ProductOut)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Yetkisiz")

    # STANDARD ürünse base_price ve base_stock zorunlu
    if payload.type == "STANDARD":
        if payload.base_price is None or payload.base_stock is None:
            raise HTTPException(
                status_code=422,
                detail="STANDARD ürünler için base_price ve base_stock zorunludur"
            )

    # Varyanted ürünler için base_price/stock ignore edilebilir
    product_data = payload.model_dump(exclude={"category_ids"})
    product_data["user_id"] = current_user.id

    new_product = Product(**product_data)

    # Kategorileri ilişkilendir
    if payload.category_ids:
        categories = db.query(Categories).filter(Categories.id.in_(payload.category_ids)).all()
        if len(categories) != len(payload.category_ids):
            raise HTTPException(status_code=400, detail="Kategori ID'leri hatalı")
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
        raise HTTPException(status_code=404 ,detail="ürün bulunamadı")
    return product

#DELETE product_by_id
@router.delete("/{product_id}", response_model=ProductOut)
def delete_product_by_id(product_id:int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı " \
            " yetkisi yok"            
            )
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="silmek istediğin ürün bulunamadı.")
    
    db.delete(product)
    db.commit()
    return product

#UPDATE product


# VARIANTED ürünleri eklemek için
@router.post("/products/{product_id}/variants", response_model=List[VariantOut])
def add_variants_to_product(
    product_id: int,
    payload: List[VariantCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Yetkisiz")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    if product.type != "VARIANTED":
        raise HTTPException(status_code=400, detail="Bu ürün VARIANTED değil")

    new_variants = []
    for v in payload:
        variant = ProductVariant(
            product_id=product.id,
            color_id=v.color_id,
            size_id=v.size_id,
            price=v.price,
            stock=v.stock,
            sku=v.sku,
            barcode=v.barcode
        )
        db.add(variant)
        new_variants.append(variant)

    db.commit()
    return new_variants

#GET ID
@router.get("/products/{product_id}/variants", response_model=list[VariantOut])
def get_variants_for_product(product_id: int, db: Session = Depends(get_db)):
    variants = (
        db.query(ProductVariant)
        .options(
            joinedload(ProductVariant.color),
            joinedload(ProductVariant.size),
        )
        .filter(ProductVariant.product_id == product_id)
        .all()
    )
    return variants

#GET All
@router.get("/products/variants", response_model=list[VariantOut])
def get_all_variants(db: Session = Depends(get_db)):
    variants = (
        db.query(ProductVariant)
        .options(
            joinedload(ProductVariant.color),
            joinedload(ProductVariant.size),
        )
        .all()
    )
    return variants