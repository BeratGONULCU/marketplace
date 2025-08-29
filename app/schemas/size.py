from pydantic import BaseModel
from typing import Optional,Literal
from decimal import Decimal

class SizeCreate(BaseModel):
    code:str

class SizeUpdate(BaseModel):
    code:str

class SizeOut(SizeCreate):
    id:int

    class Config:
        orm_mode:True