# LIPMS Backend API

Live Pharmacy Inventory Management System - Backend API built with FastAPI and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Support for admin, pharmacist, staff, and customer roles
- **Medicine Inventory**: Complete CRUD operations for medicine management
- **Order Management**: Order creation, tracking, and status updates
- **Stock Management**: Real-time stock updates and low-stock alerts
- **Activity Logging**: Track all system activities and changes

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **PostgreSQL**: Robust relational database with pgAdmin for management
- **SQLAlchemy**: Python SQL toolkit and ORM
- **Alembic**: Database migration tool
- **JWT**: JSON Web Tokens for authentication
- **Pydantic**: Data validation using Python type annotations
- **Docker**: Containerization for easy deployment

## Quick Start (Docker - Recommended)

The fastest way to get started is using Docker:

```bash
# Run the quick start script
./quick-start.sh
```

Or manually:

```bash
# Start all services (PostgreSQL, pgAdmin, Backend)
docker-compose up -d

# Initialize database with sample data
docker-compose exec backend python init_db.py

# View logs
docker-compose logs -f
```

**Services will be available at:**
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- pgAdmin: http://localhost:5050
- PostgreSQL: localhost:5432

**Database Credentials:**
- Database: curtin
- Username: curtin
- Password: curtin

**Default Admin User:**
- Email: admin@pharmacy.com
- Password: admin123

**pgAdmin Access:**
- Email: admin@curtin.com
- Password: curtin

## Manual Setup (Without Docker)

### Prerequisites

- Python 3.9+
- PostgreSQL 12+
- pip (Python package manager)

### Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Set up PostgreSQL database**:
   ```sql
   CREATE DATABASE curtin;
   CREATE USER curtin WITH PASSWORD 'curtin';
   GRANT ALL PRIVILEGES ON DATABASE curtin TO curtin;
   ```

6. **Run database migrations**:
   ```bash
   alembic upgrade head
   ```

7. **Initialize database with sample data**:
   ```bash
   python init_db.py
   ```

8. **Start the development server**:
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- **Interactive API docs**: `http://localhost:8000/docs`
- **ReDoc documentation**: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/login-json` - Login with JSON payload

### Users
- `GET /api/v1/users/me` - Get current user info
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users/` - Get all users (admin only)
- `GET /api/v1/users/{user_id}` - Get user by ID (admin only)

### Medicines
- `GET /api/v1/medicines/` - Get all medicines
- `GET /api/v1/medicines/{medicine_id}` - Get medicine by ID
- `POST /api/v1/medicines/` - Create medicine (admin only)
- `PUT /api/v1/medicines/{medicine_id}` - Update medicine (admin only)
- `PATCH /api/v1/medicines/{medicine_id}/stock` - Update stock (pharmacist only)
- `GET /api/v1/medicines/low-stock/` - Get low stock medicines (pharmacist only)

### Orders
- `GET /api/v1/orders/` - Get orders
- `GET /api/v1/orders/{order_id}` - Get order by ID
- `POST /api/v1/orders/` - Create new order
- `PATCH /api/v1/orders/{order_id}/status` - Update order status (pharmacist only)

## Database Schema

### Users Table
- id, email, name, hashed_password, role, is_active, avatar_url, created_at, updated_at

### Medicines Table
- id, name, description, price, stock, category, manufacturer, dosage, prescription_required, min_stock_level, max_stock_level, is_active, created_at, updated_at

### Orders Table
- id, customer_id, order_number, status, total_amount, shipping_address, notes, created_at, updated_at

### Order Items Table
- id, order_id, medicine_id, quantity, unit_price, total_price

### Activities Table
- id, user_id, medicine_id, activity_type, message, metadata, created_at

## Development

### Running Tests
```bash
pytest
```

### Database Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Code Formatting
```bash
black .
isort .
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://curtin:curtin@localhost:5432/curtin
DATABASE_URL_TEST=postgresql://curtin:curtin@localhost:5432/curtin_test

# JWT
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
DEBUG=True
HOST=0.0.0.0
PORT=8000

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
```

## Docker Support

The application includes a complete Docker setup with:
- PostgreSQL database (port 5432)
- pgAdmin for database management (port 5050)
- FastAPI backend (port 8000)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Access shell in backend container
docker-compose exec backend bash

# Run database initialization
docker-compose exec backend python init_db.py
```

### pgAdmin Setup

1. Access pgAdmin at http://localhost:5050
2. Login with admin@curtin.com / curtin
3. Add a new server:
   - Name: Pharmacy DB
   - Host: db (or localhost from outside Docker)
   - Port: 5432
   - Database: curtin
   - Username: curtin
   - Password: curtin

## Production Deployment

For production deployment:

1. Generate a secure SECRET_KEY:
   ```bash
   openssl rand -hex 32
   ```

2. Set DEBUG=False

3. Update ALLOWED_ORIGINS with your production domain

4. Use a production-grade PostgreSQL instance

5. Set up HTTPS/SSL

6. Configure proper logging and monitoring

7. Set up database backups

8. Use environment-specific configuration files

