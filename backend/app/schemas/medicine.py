from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MedicineBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    category: str
    manufacturer: str
    dosage: Optional[str] = None
    prescription_required: bool = False
    min_stock_level: int = 0
    max_stock_level: int = 1000


class MedicineCreate(MedicineBase):
    pass


class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    dosage: Optional[str] = None
    prescription_required: Optional[bool] = None
    min_stock_level: Optional[int] = None
    max_stock_level: Optional[int] = None
    is_active: Optional[bool] = None


class MedicineInDB(MedicineBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class Medicine(MedicineInDB):
    pass


class StockUpdate(BaseModel):
    medicine_id: int
    quantity: int
    operation: str  # 'add' or 'subtract'

