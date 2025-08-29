from sqlalchemy import Column, BigInteger, ForeignKey, Text, Enum, Numeric, Integer, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base
import enum
from datetime import datetime

from app.models.product_categories import product_categories
from app.models.user import User

class ProductType(str, enum.Enum):
    STANDARD = "STANDARD"
    VARIANTED = "VARIANTED"

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    type: Mapped[ProductType] = mapped_column(Enum(ProductType, name="product_type"), nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    base_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=True)
    base_stock: Mapped[int] = mapped_column(Integer, nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    
    user = relationship(
        "User",
        back_populates="products"
    )


    categories = relationship(
        "Categories", 
        secondary=product_categories, 
        back_populates="products"
    )