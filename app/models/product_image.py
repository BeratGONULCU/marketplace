from sqlalchemy import BigInteger, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base

class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(BigInteger,primary_key=True)
    product_id: Mapped[int] = mapped_column(BigInteger,ForeignKey("products.id", ondelete="CASCADE"))
    url: Mapped[str] = mapped_column(Text,nullable=False)
    sort: Mapped[int] = mapped_column(BigInteger,nullable=False)

    product = relationship(
        "Product",
        back_populates="product_images"
    )