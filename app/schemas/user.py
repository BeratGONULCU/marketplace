from pydantic import BaseModel
from typing import Optional,Literal
from decimal import Decimal

class UserCreate(BaseModel):
    email: str
    hashed_password: str
    is_active: bool
    is_admin: bool
    role: str


class UserOut(UserCreate):
    id:int

    class Config:
        orm_mode:True

# Login için kullanılan form
class LoginSchema(BaseModel):
    email: str
    password: str

# JWT token response modeli
class Token(BaseModel):
    access_token: str
    token_type: str
