from pydantic import BaseModel
from typing import List, Optional,Literal
from decimal import Decimal

class ProductColorCreate(BaseModel):
    product_id: int
    color_id: int
    url: str
    sort: int

class ProductColorUpdate(BaseModel):
    product_id: int
    color_id: int
    url: str
    sort: int

class ProductColorOut(ProductColorCreate):
    id: int
    product_id: int
    color_id: int
    url: str
    sort: int

    class Config:
        orm_mode:True