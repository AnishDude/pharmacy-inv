#!/bin/bash

# Quick Start Script for Pharmacy Inventory Management System Backend
# This script helps you get the backend up and running quickly

echo "=========================================="
echo "Pharmacy Inventory Management System"
echo "Backend Quick Start"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✓ Docker and Docker Compose are installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://curtin:curtin@localhost:5432/curtin
DATABASE_URL_TEST=postgresql://curtin:curtin@localhost:5432/curtin_test

# JWT Configuration
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Settings
DEBUG=True
HOST=0.0.0.0
PORT=8000

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
EOF
    echo "✓ .env file created with secure random SECRET_KEY"
else
    echo "✓ .env file already exists"
fi
echo ""

# Start Docker services
echo "Starting Docker services..."
echo "This will start PostgreSQL, pgAdmin, and the Backend API"
echo ""

docker-compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "=========================================="
    echo "✓ All services are running!"
    echo "=========================================="
    echo ""
    echo "Services available at:"
    echo "  • Backend API:        http://localhost:8000"
    echo "  • API Documentation:  http://localhost:8000/docs"
    echo "  • pgAdmin:            http://localhost:5050"
    echo "  • PostgreSQL:         localhost:5432"
    echo ""
    echo "pgAdmin Login Credentials:"
    echo "  Email:    admin@curtin.com"
    echo "  Password: curtin"
    echo ""
    echo "Database Connection Details:"
    echo "  Host:     db (inside Docker) or localhost (from host)"
    echo "  Port:     5432"
    echo "  Database: curtin"
    echo "  Username: curtin"
    echo "  Password: curtin"
    echo ""
    echo "Default Admin User:"
    echo "  Email:    admin@pharmacy.com"
    echo "  Password: admin123"
    echo ""
    echo "To view logs:     docker-compose logs -f"
    echo "To stop services: docker-compose down"
    echo "To restart:       docker-compose restart"
    echo ""
    echo "=========================================="
    echo "Next steps:"
    echo "1. Initialize the database with sample data:"
    echo "   docker-compose exec backend python init_db.py"
    echo ""
    echo "2. Start the frontend:"
    echo "   cd .. && npm install && npm run dev"
    echo ""
    echo "3. Open your browser at http://localhost:3000"
    echo "=========================================="
else
    echo ""
    echo "❌ Some services failed to start. Please check the logs:"
    echo "   docker-compose logs"
    exit 1
fi

