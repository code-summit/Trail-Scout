#!/bin/bash
# Quick Start Script for Trail Scout

echo "🥾 Welcome to Trail Scout Setup!"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check if MongoDB is running (optional)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. Using MongoDB Atlas or docker-compose recommended."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm run install-all

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "⚙️  Creating .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your MongoDB URI and other settings"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "Or use Docker:"
echo "  docker-compose up"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
