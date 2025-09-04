from sqlalchemy import Column, Integer, String
from app.db import Base  # SQLAlchemy Base import

class ProductCombinedImage(Base):
    __tablename__ = "product_combined_images"

    id = Column(Integer, primary_key=True, index=True)  # tablon varsa bu id olabilir
    product_id = Column(Integer, nullable=False)
    product_title = Column(String, nullable=False)
    color_id = Column(Integer, nullable=True)
    image_url = Column(String, nullable=True)
    sort = Column(Integer, nullable=True)
