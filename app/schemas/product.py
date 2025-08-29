from pydantic import BaseModel
from typing import Optional,Literal
from decimal import Decimal

class ProductCreate(BaseModel):
    title: str
    type: Literal["STANDARD", "VARIANTED"]
    description: Optional[str] = None
    base_price: Optional[Decimal] = None 
    base_stock: Optional[int] = None
    is_published: Optional[bool] = True

class ProductOut(ProductCreate):
    id:int

    class Config:
        orm_mode: True