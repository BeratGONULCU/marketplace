from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

from app.schemas.color import ColorCreate,ColorOut,ColorUpdate
from app.schemas.size import SizeCreate,SizeOut,SizeUpdate

class VariantCreate(BaseModel):
    color_id: int
    size_id: int
    price: Decimal
    stock: int
    sku: str
    barcode: str

class VariantUpdate(BaseModel):
    color_id: int
    size_id: int
    price: Decimal
    stock: int
    sku: str
    barcode: str


class VariantOut(BaseModel):
    id: int
    product_id: int
    price: Decimal
    stock: int
    sku: str
    barcode: str
    color: ColorOut
    size: SizeOut

    class Config:
        orm_mode = True
