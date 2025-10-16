#!/bin/bash

# LIPMS Backend Setup Script
echo "🚀 Setting up LIPMS Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql"
    exit 1
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
fi

# Initialize Alembic
echo "🗄️  Initializing database migrations..."
alembic init alembic

# Create database (if it doesn't exist)
echo "🗃️  Setting up database..."
createdb lipms_db 2>/dev/null || echo "Database might already exist"

# Run migrations
echo "🔄 Running database migrations..."
alembic upgrade head

echo "✅ Backend setup complete!"
echo ""
echo "To start the development server:"
echo "  source venv/bin/activate"
echo "  python run.py"
echo ""
echo "API will be available at: http://localhost:8000"
echo "API docs at: http://localhost:8000/docs"

