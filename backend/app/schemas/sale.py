from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class SaleItemCreate(BaseModel):
    medicine_id: int
    quantity: int
    unit_price: float
    discount: float = 0.0


class SaleItemResponse(BaseModel):
    id: int
    medicine_id: int
    medicine_name: str
    quantity: int
    unit_price: float
    total_price: float
    discount: float

    class Config:
        from_attributes = True


class SaleCreate(BaseModel):
    customer_name: Optional[str] = None
    payment_method: str
    items: List[SaleItemCreate]
    notes: Optional[str] = None


class SaleResponse(BaseModel):
    id: int
    sale_number: str
    customer_name: Optional[str]
    total_amount: float
    payment_method: str
    notes: Optional[str]
    created_at: datetime
    items: List[SaleItemResponse]

    class Config:
        from_attributes = True

