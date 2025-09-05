from pydantic import BaseModel
from typing import List, Optional,Literal
from decimal import Decimal

from app.schemas.category import CategoryOut
from app.schemas.product_variant import VariantCreate,VariantOut

class ProductCreate(BaseModel):
    title: str
    type: Literal["STANDARD", "VARIANTED"]
    description: Optional[str]
    base_price: Optional[Decimal] = None
    base_stock: Optional[int] = None
    is_published: Optional[bool] = True
    category_ids: Optional[List[int]] = []

class ProductOut(BaseModel):
    id: int
    title: str
    type: Literal["STANDARD", "VARIANTED"]
    description: Optional[str]
    base_price: Optional[Decimal]
    base_stock: Optional[int]
    is_published: Optional[bool]
    user_id: int
    categories: List[CategoryOut]
    variants: Optional[List["VariantOut"]] = []


class ProductUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    type: Optional[str]  # "STANDARD" veya "VARIANTED"
    base_price: Optional[float]
    base_stock: Optional[int]
    is_published: Optional[bool]

    
    class Config:
        orm_mode: True