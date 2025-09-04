from pydantic import BaseModel
from typing import List, Optional,Literal
from decimal import Decimal

class ProductImageCreate(BaseModel):
    product_id: int
    url: str
    sort: int

class ProductImageUpdate(BaseModel):
    product_id: int
    url: str
    sort: int

class ProductImageOut(ProductImageCreate):
    id: int
    product_id: int
    url: str
    sort: int

    class Config:
        orm_mode:True