#!/bin/bash

# Nano Banana AI Image Editor - Production Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 Starting Nano Banana Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_status "Dependencies check passed!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_status "Dependencies installed successfully!"
}

# Build the application
build_app() {
    print_status "Building application..."
    npm run build
    print_status "Application built successfully!"
}

# Check if Vercel CLI is installed
check_vercel() {
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if [ ! -f ".vercel/project.json" ]; then
        print_status "Initializing Vercel project..."
        vercel --yes
    fi
    
    print_status "Deploying to production..."
    vercel --prod --yes
    
    print_status "Deployment completed!"
}

# Main deployment function
main() {
    echo "=========================================="
    echo "   Nano Banana AI Image Editor"
    echo "   Production Deployment Script"
    echo "=========================================="
    echo ""
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Run deployment steps
    check_dependencies
    install_dependencies
    build_app
    check_vercel
    deploy_vercel
    
    echo ""
    echo "=========================================="
    print_status "Deployment completed successfully! 🎉"
    echo "=========================================="
    echo ""
    print_warning "Don't forget to:"
    echo "1. Set up your Supabase project"
    echo "2. Configure environment variables in Vercel"
    echo "3. Set up your database using scripts/setup-production-db.sql"
    echo "4. Configure Stripe for payments (optional)"
    echo "5. Test your production deployment"
    echo ""
    print_status "Check the DEPLOYMENT_GUIDE.md for detailed instructions."
}

# Run main function
main "$@"