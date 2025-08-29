from sqlalchemy import BigInteger, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db import Base

class Product_color_image(Base):
    __tablename__ = "product_color_images"

    id: Mapped[int] = mapped_column(BigInteger,primary_key=True)
    product_id: Mapped[int] = mapped_column(BigInteger,ForeignKey("products.id", ondelete="CASCADE"))
    color_id: Mapped[int] = mapped_column(BigInteger,ForeignKey("colors.id"))
    url: Mapped[str] = mapped_column(Text,nullable=False)
    sort: Mapped[int] = mapped_column(BigInteger,nullable=False)