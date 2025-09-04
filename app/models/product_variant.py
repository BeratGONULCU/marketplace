from sqlalchemy import BigInteger, ForeignKey, Integer, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column,relationship
from app.db import Base

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[int] = mapped_column(BigInteger,primary_key=True)
    product_id: Mapped[int] = mapped_column(BigInteger,ForeignKey("products.id", ondelete="CASCADE"))
    color_id: Mapped[int] = mapped_column(BigInteger,ForeignKey("colors.id"))
    size_id: Mapped[int] = mapped_column(BigInteger,ForeignKey("sizes.id"))
    price: Mapped[float] = mapped_column(Numeric(12, 2),nullable=False)
    stock: Mapped[int] = mapped_column(Integer,nullable=False, default=0)
    barcode: Mapped[str] = mapped_column(Text,nullable=False,unique=True)
    sku: Mapped[str] = mapped_column(Text,nullable=False,unique=False)  # stok takip kodu -- sku kolonu unique = false olarak değiştirildi

    color = relationship("Color")
    size = relationship("Size")
    product = relationship("Product", back_populates="variants")
