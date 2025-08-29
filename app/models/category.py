from sqlalchemy import Column, BigInteger, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base

from app.models.product_categories import product_categories

class Categories(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(BigInteger,primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    slug: Mapped[str] = mapped_column(Text, nullable=False, unique=True)

    #product_categories ilişki tablosu için
    products = relationship(
        "Product", 
        secondary=product_categories, 
        back_populates="categories"
    )
