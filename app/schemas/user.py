from pydantic import BaseModel
from typing import Optional,Literal
from decimal import Decimal

class UserCreate(BaseModel):
    email: str
    hashed_password: str
    is_active: bool
    is_admin: bool


class UserOut(UserCreate):
    id:int

    class Config:
        orm_mode:True
