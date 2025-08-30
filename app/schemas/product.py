from pydantic import BaseModel
from typing import Optional,Literal
from decimal import Decimal

from app.schemas.category import CategoryOut

class ProductCreate(BaseModel):
    title: str
    type: Literal["STANDARD", "VARIANTED"]
    description: Optional[str] = None
    base_price: Optional[Decimal] = None 
    base_stock: Optional[int] = None
    is_published: Optional[bool] = True
    category_ids: list[int] = []  # product_categories için

class ProductOut(BaseModel):
    id: int
    title: str
    type: Literal["STANDARD", "VARIANTED"]
    description: Optional[str]
    base_price: Optional[Decimal]
    base_stock: Optional[int]
    is_published: Optional[bool]
    user_id: int
    categories: list[CategoryOut]

    class Config:
        orm_mode: True