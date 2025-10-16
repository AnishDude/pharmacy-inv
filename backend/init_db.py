#!/usr/bin/env python3
"""
Database initialization script for Pharmacy Inventory Management System
This script creates initial admin user and sample data
"""

import sys
import os
from pathlib import Path

# Add the backend directory to the path
sys.path.append(str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.core.database import engine, SessionLocal, Base
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.medicine import Medicine
from app.models.order import Order, OrderItem, OrderStatus
from app.models.activity import Activity
from decimal import Decimal
from datetime import datetime, timedelta
import random


def init_db():
    """Initialize the database with tables and initial data"""
    
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")
    
    db: Session = SessionLocal()
    
    try:
        # Check if admin user already exists
        existing_admin = db.query(User).filter(User.email == "admin@pharmacy.com").first()
        
        if not existing_admin:
            print("\nCreating admin user...")
            admin_user = User(
                email="admin@pharmacy.com",
                name="Admin User",
                hashed_password=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("✓ Admin user created")
            print("  Email: admin@pharmacy.com")
            print("  Password: admin123")
        else:
            print("\n✓ Admin user already exists")
        
        # Create additional sample users
        sample_users = [
            {
                "email": "pharmacist@pharmacy.com",
                "name": "Dr. Sarah Johnson",
                "password": "pharma123",
                "role": UserRole.PHARMACIST
            },
            {
                "email": "staff@pharmacy.com",
                "name": "John Smith",
                "password": "staff123",
                "role": UserRole.STAFF
            },
            {
                "email": "customer1@example.com",
                "name": "Alice Williams",
                "password": "customer123",
                "role": UserRole.CUSTOMER
            },
            {
                "email": "customer2@example.com",
                "name": "Bob Martinez",
                "password": "customer123",
                "role": UserRole.CUSTOMER
            }
        ]
        
        for user_data in sample_users:
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing_user:
                user = User(
                    email=user_data["email"],
                    name=user_data["name"],
                    hashed_password=get_password_hash(user_data["password"]),
                    role=user_data["role"],
                    is_active=True
                )
                db.add(user)
                print(f"✓ Created user: {user_data['email']} ({user_data['role'].value})")
        
        db.commit()
        
        # Check if medicines already exist
        existing_medicines = db.query(Medicine).count()
        
        if existing_medicines == 0:
            print("\nCreating sample medicines...")
            
            sample_medicines = [
                {
                    "name": "Paracetamol 500mg",
                    "description": "Pain relief and fever reducer",
                    "price": 5.99,
                    "stock": 100,
                    "category": "Pain Relief",
                    "manufacturer": "MedPharm Ltd",
                    "dosage": "500mg",
                    "prescription_required": False,
                    "min_stock_level": 10,
                    "max_stock_level": 200,
                    "is_active": True
                },
                {
                    "name": "Amoxicillin 250mg",
                    "description": "Antibiotic for bacterial infections",
                    "price": 12.50,
                    "stock": 50,
                    "category": "Antibiotic",
                    "manufacturer": "HealthCorp",
                    "dosage": "250mg",
                    "prescription_required": True,
                    "min_stock_level": 5,
                    "max_stock_level": 100,
                    "is_active": True
                },
                {
                    "name": "Ibuprofen 400mg",
                    "description": "Anti-inflammatory pain reliever",
                    "price": 8.75,
                    "stock": 75,
                    "category": "Pain Relief",
                    "manufacturer": "MedPharm Ltd",
                    "dosage": "400mg",
                    "prescription_required": False,
                    "min_stock_level": 10,
                    "max_stock_level": 150,
                    "is_active": True
                },
                {
                    "name": "Vitamin D3 1000IU",
                    "description": "Vitamin D supplement",
                    "price": 15.99,
                    "stock": 200,
                    "category": "Vitamin",
                    "manufacturer": "VitCorp",
                    "dosage": "1000IU",
                    "prescription_required": False,
                    "min_stock_level": 20,
                    "max_stock_level": 300,
                    "is_active": True
                },
                {
                    "name": "Aspirin 100mg",
                    "description": "Blood thinner and pain relief",
                    "price": 6.50,
                    "stock": 150,
                    "category": "Pain Relief",
                    "manufacturer": "MedPharm Ltd",
                    "dosage": "100mg",
                    "prescription_required": False,
                    "min_stock_level": 15,
                    "max_stock_level": 200,
                    "is_active": True
                },
                {
                    "name": "Omeprazole 20mg",
                    "description": "Proton pump inhibitor for acid reflux",
                    "price": 18.99,
                    "stock": 60,
                    "category": "Gastrointestinal",
                    "manufacturer": "PharmaCare",
                    "dosage": "20mg",
                    "prescription_required": True,
                    "min_stock_level": 10,
                    "max_stock_level": 100,
                    "is_active": True
                },
                {
                    "name": "Metformin 500mg",
                    "description": "Diabetes medication",
                    "price": 10.99,
                    "stock": 80,
                    "category": "Diabetes",
                    "manufacturer": "DiabetCare",
                    "dosage": "500mg",
                    "prescription_required": True,
                    "min_stock_level": 15,
                    "max_stock_level": 150,
                    "is_active": True
                },
                {
                    "name": "Lisinopril 10mg",
                    "description": "Blood pressure medication",
                    "price": 14.50,
                    "stock": 65,
                    "category": "Cardiovascular",
                    "manufacturer": "CardioPharm",
                    "dosage": "10mg",
                    "prescription_required": True,
                    "min_stock_level": 10,
                    "max_stock_level": 120,
                    "is_active": True
                },
                {
                    "name": "Cetirizine 10mg",
                    "description": "Antihistamine for allergies",
                    "price": 7.99,
                    "stock": 120,
                    "category": "Allergy",
                    "manufacturer": "AllergyRelief Inc",
                    "dosage": "10mg",
                    "prescription_required": False,
                    "min_stock_level": 20,
                    "max_stock_level": 180,
                    "is_active": True
                },
                {
                    "name": "Simvastatin 20mg",
                    "description": "Cholesterol-lowering medication",
                    "price": 16.75,
                    "stock": 45,
                    "category": "Cardiovascular",
                    "manufacturer": "CardioPharm",
                    "dosage": "20mg",
                    "prescription_required": True,
                    "min_stock_level": 8,
                    "max_stock_level": 100,
                    "is_active": True
                },
                {
                    "name": "Cough Syrup 100ml",
                    "description": "Relief from cough and cold symptoms",
                    "price": 9.99,
                    "stock": 90,
                    "category": "Cough & Cold",
                    "manufacturer": "ColdCare Ltd",
                    "dosage": "100ml",
                    "prescription_required": False,
                    "min_stock_level": 15,
                    "max_stock_level": 150,
                    "is_active": True
                },
                {
                    "name": "Omega-3 Fish Oil",
                    "description": "Omega-3 fatty acids supplement",
                    "price": 22.50,
                    "stock": 180,
                    "category": "Supplement",
                    "manufacturer": "NutriHealth",
                    "dosage": "1000mg",
                    "prescription_required": False,
                    "min_stock_level": 25,
                    "max_stock_level": 250,
                    "is_active": True
                }
            ]
            
            for med_data in sample_medicines:
                medicine = Medicine(**med_data)
                db.add(medicine)
                print(f"✓ Added medicine: {med_data['name']}")
            
            db.commit()
            db.refresh(medicine)  # Refresh to get IDs
            print(f"✓ Created {len(sample_medicines)} sample medicines")
        else:
            print(f"\n✓ Database already has {existing_medicines} medicines")
        
        # Create sample orders
        existing_orders = db.query(Order).count()
        
        if existing_orders == 0:
            print("\nCreating sample orders...")
            
            # Get customer users and medicines
            customers = db.query(User).filter(User.role == UserRole.CUSTOMER).all()
            medicines = db.query(Medicine).all()
            
            if customers and medicines:
                order_statuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, 
                                OrderStatus.SHIPPED, OrderStatus.DELIVERED]
                
                for i in range(10):  # Create 10 sample orders
                    customer = random.choice(customers)
                    status = random.choice(order_statuses)
                    
                    # Generate order number
                    order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{1000 + i}"
                    
                    # Create order
                    order = Order(
                        customer_id=customer.id,
                        order_number=order_number,
                        status=status,
                        total_amount=0,  # Will be calculated
                        shipping_address=f"{random.randint(100, 999)} Main St, City, State {random.randint(10000, 99999)}",
                        notes="Sample order" if i % 2 == 0 else None,
                        created_at=datetime.now() - timedelta(days=random.randint(0, 30))
                    )
                    db.add(order)
                    db.flush()  # Get order ID
                    
                    # Add 1-4 random items to order
                    num_items = random.randint(1, 4)
                    total_amount = 0
                    
                    selected_medicines = random.sample(medicines, min(num_items, len(medicines)))
                    for medicine in selected_medicines:
                        quantity = random.randint(1, 5)
                        unit_price = medicine.price
                        total_price = unit_price * quantity
                        total_amount += total_price
                        
                        order_item = OrderItem(
                            order_id=order.id,
                            medicine_id=medicine.id,
                            quantity=quantity,
                            unit_price=unit_price,
                            total_price=total_price
                        )
                        db.add(order_item)
                    
                    # Update order total
                    order.total_amount = total_amount
                    print(f"✓ Created order: {order_number} (${total_amount:.2f})")
                
                db.commit()
                print(f"✓ Created 10 sample orders")
            else:
                print("⚠ Skipping orders - no customers or medicines found")
        else:
            print(f"\n✓ Database already has {existing_orders} orders")
        
        print("\n" + "="*60)
        print("Database initialization completed successfully!")
        print("="*60)
        print("\n📊 Database Summary:")
        print(f"  • Users: {db.query(User).count()}")
        print(f"  • Medicines: {db.query(Medicine).count()}")
        print(f"  • Orders: {db.query(Order).count()}")
        print(f"  • Order Items: {db.query(OrderItem).count()}")
        print("\n🔑 Login Credentials:")
        print("  Admin:")
        print("    - Email: admin@pharmacy.com")
        print("    - Password: admin123")
        print("  Pharmacist:")
        print("    - Email: pharmacist@pharmacy.com")
        print("    - Password: pharma123")
        print("  Staff:")
        print("    - Email: staff@pharmacy.com")
        print("    - Password: staff123")
        print("  Customer:")
        print("    - Email: customer1@example.com")
        print("    - Password: customer123")
        print("\n🚀 Next Steps:")
        print("  1. Start the backend server: python run.py")
        print("  2. Access API docs at: http://localhost:8000/docs")
        print("  3. Start the frontend and login with the credentials above")
        print("="*60)
        
    except Exception as e:
        print(f"\n✗ Error during initialization: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_db()

