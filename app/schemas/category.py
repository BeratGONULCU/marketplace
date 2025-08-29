from pydantic import BaseModel
from typing import Optional,Literal
from decimal import Decimal

class CategoryCreate(BaseModel):
    name:str
    slug:str

class CategoryUpdate(BaseModel):
    name:str
    slug:str
    
class CategoryOut(CategoryCreate):
    id:int

    class Config:
        orm_mode:True