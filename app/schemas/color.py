from pydantic import BaseModel
from typing import Optional,Literal
from decimal import Decimal

class ColorCreate(BaseModel):
    name:str
    hex:str

class ColorUpdate(BaseModel):
    name:str
    hex:str

class ColorOut(ColorCreate):
    id:int

    class Config:
        orm_mode:True