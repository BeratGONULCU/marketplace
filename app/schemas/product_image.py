from pydantic import BaseModel
from typing import List, Optional,Literal
from decimal import Decimal

class ProductImageCreate(BaseModel):
    product_id: int
    url: str
    sort: str

class ProductImageUpdate(BaseModel):
    product_id: int
    url: str
    sort: str

class ProductImageOut(ProductImageCreate):
    id: int
    product_id: int
    url: str
    sort: str

    class Config:
        orm_mode:True