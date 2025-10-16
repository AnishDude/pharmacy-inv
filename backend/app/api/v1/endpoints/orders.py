from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.core.auth import get_current_active_user, require_role
from app.models.user import User
from app.models.order import Order, OrderItem, OrderStatus
from app.models.medicine import Medicine

router = APIRouter()


@router.get("/", response_model=List[dict])
def get_orders(
    skip: int = 0,
    limit: int = 100,
    status: OrderStatus = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get orders for current user or all orders (admin/pharmacist)"""
    if current_user.role.value in ["admin", "pharmacist"]:
        query = db.query(Order)
    else:
        query = db.query(Order).filter(Order.customer_id == current_user.id)
    
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.offset(skip).limit(limit).all()
    
    # Format orders with items
    result = []
    for order in orders:
        order_data = {
            "id": order.id,
            "order_number": order.order_number,
            "status": order.status,
            "total_amount": order.total_amount,
            "shipping_address": order.shipping_address,
            "notes": order.notes,
            "created_at": order.created_at,
            "updated_at": order.updated_at,
            "items": []
        }
        
        for item in order.order_items:
            order_data["items"].append({
                "medicine_id": item.medicine_id,
                "medicine_name": item.medicine.name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "total_price": item.total_price
            })
        
        result.append(order_data)
    
    return result


@router.get("/{order_id}", response_model=dict)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific order"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if user can access this order
    if current_user.role.value not in ["admin", "pharmacist"] and order.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    order_data = {
        "id": order.id,
        "order_number": order.order_number,
        "status": order.status,
        "total_amount": order.total_amount,
        "shipping_address": order.shipping_address,
        "notes": order.notes,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
        "items": []
    }
    
    for item in order.order_items:
        order_data["items"].append({
            "medicine_id": item.medicine_id,
            "medicine_name": item.medicine.name,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "total_price": item.total_price
        })
    
    return order_data


@router.post("/", response_model=dict)
def create_order(
    order_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new order"""
    # Generate order number
    order_number = f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}-{current_user.id}"
    
    # Calculate total amount
    total_amount = 0
    items = order_data.get("items", [])
    
    for item in items:
        medicine = db.query(Medicine).filter(Medicine.id == item["medicine_id"]).first()
        if not medicine:
            raise HTTPException(status_code=404, detail=f"Medicine {item['medicine_id']} not found")
        
        if medicine.stock < item["quantity"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient stock for {medicine.name}. Available: {medicine.stock}"
            )
        
        item_total = medicine.price * item["quantity"]
        total_amount += item_total
    
    # Create order
    order = Order(
        customer_id=current_user.id,
        order_number=order_number,
        status=OrderStatus.PENDING,
        total_amount=total_amount,
        shipping_address=order_data["shipping_address"],
        notes=order_data.get("notes")
    )
    
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Create order items and update stock
    for item in items:
        medicine = db.query(Medicine).filter(Medicine.id == item["medicine_id"]).first()
        
        order_item = OrderItem(
            order_id=order.id,
            medicine_id=item["medicine_id"],
            quantity=item["quantity"],
            unit_price=medicine.price,
            total_price=medicine.price * item["quantity"]
        )
        
        db.add(order_item)
        
        # Update stock
        medicine.stock -= item["quantity"]
    
    db.commit()
    
    return {
        "id": order.id,
        "order_number": order.order_number,
        "status": order.status,
        "total_amount": order.total_amount,
        "message": "Order created successfully"
    }


@router.patch("/{order_id}/status", response_model=dict)
def update_order_status(
    order_id: int,
    status_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("pharmacist"))
):
    """Update order status (pharmacist only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    new_status = status_data.get("status")
    if new_status not in [status.value for status in OrderStatus]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    order.status = new_status
    db.commit()
    
    return {"message": f"Order status updated to {new_status}"}

