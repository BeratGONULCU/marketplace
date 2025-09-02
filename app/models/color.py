from sqlalchemy import BigInteger, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base

class Color(Base):
    __tablename__ = "colors"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    hex: Mapped[str] = mapped_column(Text, nullable=False)

    product_color_images = relationship(
        "ProductColorImage", 
        back_populates="color"
    )
