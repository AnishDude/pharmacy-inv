from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.core.auth import get_current_active_user
from app.models.user import User
from app.models.sale import Sale, SaleItem
from app.models.medicine import Medicine
from app.schemas.sale import SaleCreate, SaleResponse, SaleItemResponse

router = APIRouter()


@router.post("/", response_model=SaleResponse)
def create_sale(
    sale_data: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new sale and decrease medicine stock"""
    
    # Validate all items have sufficient stock
    for item in sale_data.items:
        medicine = db.query(Medicine).filter(Medicine.id == item.medicine_id).first()
        if not medicine:
            raise HTTPException(
                status_code=404,
                detail=f"Medicine with ID {item.medicine_id} not found"
            )
        
        if medicine.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {medicine.name}. Available: {medicine.stock}, Requested: {item.quantity}"
            )
    
    # Generate sale number
    sale_number = f"SALE-{datetime.now().strftime('%Y%m%d%H%M%S')}-{current_user.id}"
    
    # Calculate total amount
    total_amount = 0
    for item in sale_data.items:
        item_total = (item.unit_price * item.quantity) - item.discount
        total_amount += item_total
    
    # Create sale
    sale = Sale(
        sale_number=sale_number,
        user_id=current_user.id,
        customer_name=sale_data.customer_name,
        total_amount=total_amount,
        payment_method=sale_data.payment_method,
        notes=sale_data.notes
    )
    
    db.add(sale)
    db.flush()  # Get the sale ID without committing
    
    # Create sale items and update stock
    for item in sale_data.items:
        medicine = db.query(Medicine).filter(Medicine.id == item.medicine_id).first()
        
        sale_item = SaleItem(
            sale_id=sale.id,
            medicine_id=item.medicine_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=(item.unit_price * item.quantity) - item.discount,
            discount=item.discount
        )
        
        db.add(sale_item)
        
        # Decrease stock
        medicine.stock -= item.quantity
    
    db.commit()
    db.refresh(sale)
    
    # Format response
    items_response = []
    for sale_item in sale.sale_items:
        items_response.append(SaleItemResponse(
            id=sale_item.id,
            medicine_id=sale_item.medicine_id,
            medicine_name=sale_item.medicine.name,
            quantity=sale_item.quantity,
            unit_price=sale_item.unit_price,
            total_price=sale_item.total_price,
            discount=sale_item.discount
        ))
    
    return SaleResponse(
        id=sale.id,
        sale_number=sale.sale_number,
        customer_name=sale.customer_name,
        total_amount=sale.total_amount,
        payment_method=sale.payment_method,
        notes=sale.notes,
        created_at=sale.created_at,
        items=items_response
    )


@router.get("/", response_model=List[SaleResponse])
def get_sales(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all sales"""
    sales = db.query(Sale).order_by(Sale.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for sale in sales:
        items_response = []
        for sale_item in sale.sale_items:
            items_response.append(SaleItemResponse(
                id=sale_item.id,
                medicine_id=sale_item.medicine_id,
                medicine_name=sale_item.medicine.name,
                quantity=sale_item.quantity,
                unit_price=sale_item.unit_price,
                total_price=sale_item.total_price,
                discount=sale_item.discount
            ))
        
        result.append(SaleResponse(
            id=sale.id,
            sale_number=sale.sale_number,
            customer_name=sale.customer_name,
            total_amount=sale.total_amount,
            payment_method=sale.payment_method,
            notes=sale.notes,
            created_at=sale.created_at,
            items=items_response
        ))
    
    return result


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific sale by ID"""
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    
    items_response = []
    for sale_item in sale.sale_items:
        items_response.append(SaleItemResponse(
            id=sale_item.id,
            medicine_id=sale_item.medicine_id,
            medicine_name=sale_item.medicine.name,
            quantity=sale_item.quantity,
            unit_price=sale_item.unit_price,
            total_price=sale_item.total_price,
            discount=sale_item.discount
        ))
    
    return SaleResponse(
        id=sale.id,
        sale_number=sale.sale_number,
        customer_name=sale.customer_name,
        total_amount=sale.total_amount,
        payment_method=sale.payment_method,
        notes=sale.notes,
        created_at=sale.created_at,
        items=items_response
    )

