#!/bin/bash

# Start Production Deployment
# This script will guide you through the complete production setup

echo "🚀 Nano Banana AI Image Editor - Production Setup"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}Step $1:${NC} $2"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_step 1 "Setting up Supabase"
echo "1. Go to https://supabase.com"
echo "2. Create a new project"
echo "3. Wait for it to be ready (2-3 minutes)"
echo "4. Go to Settings > API"
echo "5. Copy your Project URL and anon key"
echo ""
read -p "Press Enter when you have your Supabase credentials..."

print_step 2 "Setting up Vercel"
echo "1. Go to https://vercel.com"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New Project'"
echo "4. Import your GitHub repository"
echo "5. Set framework to Next.js"
echo ""
read -p "Press Enter when your Vercel project is created..."

print_step 3 "Configuring Environment Variables"
echo "In your Vercel project settings, add these environment variables:"
echo ""
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
echo "DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"
echo ""
read -p "Press Enter when environment variables are set..."

print_step 4 "Setting up Database"
echo "1. Go to your Supabase project"
echo "2. Navigate to SQL Editor"
echo "3. Copy the contents of scripts/setup-production-db.sql"
echo "4. Paste and run the SQL script"
echo ""
read -p "Press Enter when database is set up..."

print_step 5 "Deploying Application"
echo "Deploying to production..."
vercel --prod --yes

print_success "Deployment completed!"
echo ""
print_warning "Your app is now live! 🎉"
echo ""
echo "Next steps:"
echo "1. Test your app at the Vercel URL"
echo "2. Try the authentication flow"
echo "3. Test image generation"
echo "4. Set up a custom domain (optional)"
echo "5. Configure Stripe for payments (optional)"
echo ""
echo "Check DEPLOYMENT_GUIDE.md for detailed instructions!"