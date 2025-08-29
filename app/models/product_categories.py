from sqlalchemy import Table, Column, ForeignKey, BigInteger
from app.db import Base

product_categories = Table(
    "product_categories",
    Base.metadata,
    Column("product_id", BigInteger, ForeignKey("products.id", ondelete="CASCADE"), primary_key=True),
    Column("category_id", BigInteger, ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
)
