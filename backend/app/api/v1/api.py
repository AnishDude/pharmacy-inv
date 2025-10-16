from fastapi import APIRouter
from app.api.v1.endpoints import auth, medicines, orders, users, sales

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(medicines.router, prefix="/medicines", tags=["medicines"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(sales.router, prefix="/sales", tags=["sales"])

