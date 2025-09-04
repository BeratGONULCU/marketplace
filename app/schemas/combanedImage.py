from pydantic import BaseModel
from typing import Optional

class ProductCombinedImageSchema(BaseModel):
    id: int
    product_id: int
    product_title: str
    color_id: Optional[int]
    image_url: Optional[str]
    sort: Optional[int]

    class Config:
        from_attributes = True  
