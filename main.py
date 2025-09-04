from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi.routing import APIRouter  # <-- EKLENDİ
from app.routes import product, color, size, category, auth, product_color_image, product_image, combanedImage

app = FastAPI()

# CORS AYARI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ GLOBAL /api PREFIX
api_router = APIRouter(prefix="/api")
api_router.include_router(combanedImage.router)
api_router.include_router(product.router)
api_router.include_router(color.router)
api_router.include_router(size.router)
api_router.include_router(category.router)
api_router.include_router(auth.router)
api_router.include_router(product_color_image.router)
api_router.include_router(product_image.router)


app.include_router(api_router)
