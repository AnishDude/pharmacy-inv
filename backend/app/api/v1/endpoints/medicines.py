from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.auth import get_current_active_user, require_role
from app.models.user import User
from app.models.medicine import Medicine
from app.schemas.medicine import Medicine as MedicineSchema, MedicineCreate, MedicineUpdate, StockUpdate

router = APIRouter()


@router.get("/", response_model=List[MedicineSchema])
def get_medicines(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all medicines with optional filtering"""
    query = db.query(Medicine).filter(Medicine.is_active == True)
    
    if category:
        query = query.filter(Medicine.category == category)
    
    if search:
        query = query.filter(Medicine.name.ilike(f"%{search}%"))
    
    medicines = query.offset(skip).limit(limit).all()
    return medicines


@router.get("/{medicine_id}", response_model=MedicineSchema)
def get_medicine(
    medicine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific medicine by ID"""
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return medicine


@router.post("/", response_model=MedicineSchema)
def create_medicine(
    medicine: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Create a new medicine (admin only)"""
    db_medicine = Medicine(**medicine.dict())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine


@router.put("/{medicine_id}", response_model=MedicineSchema)
def update_medicine(
    medicine_id: int,
    medicine_update: MedicineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Update a medicine (admin only)"""
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    update_data = medicine_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(medicine, field, value)
    
    db.commit()
    db.refresh(medicine)
    return medicine


@router.patch("/{medicine_id}/stock", response_model=MedicineSchema)
def update_stock(
    medicine_id: int,
    stock_update: StockUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("pharmacist"))
):
    """Update medicine stock (pharmacist only)"""
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    if stock_update.operation == "add":
        medicine.stock += stock_update.quantity
    elif stock_update.operation == "subtract":
        medicine.stock = max(0, medicine.stock - stock_update.quantity)
    else:
        raise HTTPException(status_code=400, detail="Invalid operation")
    
    db.commit()
    db.refresh(medicine)
    return medicine


@router.get("/low-stock/", response_model=List[MedicineSchema])
def get_low_stock_medicines(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("pharmacist"))
):
    """Get medicines with low stock (pharmacist only)"""
    medicines = db.query(Medicine).filter(
        Medicine.stock <= Medicine.min_stock_level,
        Medicine.is_active == True
    ).all()
    return medicines


@router.delete("/{medicine_id}")
def delete_medicine(
    medicine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Soft delete a medicine (admin only)"""
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    medicine.is_active = False
    db.commit()
    return {"message": "Medicine deleted successfully"}

