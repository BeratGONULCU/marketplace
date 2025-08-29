from fastapi import FastAPI
from app.routes import product
from app.routes import color
from app.routes import size
from app.routes import category

app = FastAPI()

app.include_router(product.router)
app.include_router(color.router)
app.include_router(size.router)
app.include_router(category.router)
