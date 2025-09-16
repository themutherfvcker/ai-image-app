#!/bin/bash

# Quick Deploy Script for Nano Banana AI Image Editor
# This script will guide you through the deployment process

set -e

echo "🚀 Nano Banana AI Image Editor - Quick Deploy"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "You need to login to Vercel first."
    echo "Please run: vercel login"
    echo "Then run this script again."
    exit 1
fi

print_status "Vercel authentication confirmed"

# Build the application
print_status "Building application..."
npm run build

# Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod --yes

print_status "Deployment completed!"
echo ""
print_warning "IMPORTANT: Before your app works, you need to:"
echo ""
echo "1. Set up Supabase:"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Copy your URL and anon key"
echo ""
echo "2. Configure environment variables in Vercel:"
echo "   - Go to your Vercel dashboard"
echo "   - Select your project"
echo "   - Go to Settings > Environment Variables"
echo "   - Add the following variables:"
echo "     • NEXT_PUBLIC_SUPABASE_URL"
echo "     • NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "     • DATABASE_URL"
echo ""
echo "3. Set up your database:"
echo "   - Go to Supabase SQL Editor"
echo "   - Run the script from scripts/setup-production-db.sql"
echo ""
echo "4. Redeploy your app:"
echo "   - Go to Vercel dashboard"
echo "   - Click 'Redeploy' on your latest deployment"
echo ""
print_status "Check DEPLOYMENT_GUIDE.md for detailed instructions!"