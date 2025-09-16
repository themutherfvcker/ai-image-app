# Production Deployment Guide

This guide will help you deploy the Nano Banana AI Image Editor to production.

## 🚀 Quick Deploy to Vercel

### 1. Prerequisites
- [Vercel account](https://vercel.com)
- [Supabase account](https://supabase.com)
- [Stripe account](https://stripe.com) (for payments)
- [Google Cloud account](https://cloud.google.com) (for Vertex AI)

### 2. Deploy to Vercel

#### Option A: Deploy from GitHub (Recommended)
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure the build settings

#### Option B: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Set up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings > API
4. Copy your project URL and anon key
5. Go to Settings > Database
6. Copy your database connection string

### 4. Set up Database

1. In your Supabase project, go to the SQL Editor
2. Run the following SQL to create the required tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "stripeId" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 25,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "ghlContactId" TEXT
);

-- Create GenerationJob table
CREATE TABLE "GenerationJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true
);

-- Create CreditLedger table
CREATE TABLE "CreditLedger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "ref" TEXT
);

-- Add foreign key constraints
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create indexes for better performance
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_stripeId_idx" ON "User"("stripeId");
CREATE INDEX "GenerationJob_userId_idx" ON "GenerationJob"("userId");
CREATE INDEX "CreditLedger_userId_idx" ON "CreditLedger"("userId");
```

### 5. Configure Environment Variables

In your Vercel dashboard, go to your project settings and add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=your-database-connection-string
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID_SUB=price_your_subscription_price_id
```

### 6. Set up Stripe (Optional)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create a product with a $5/month subscription
3. Copy the price ID
4. Set up webhooks pointing to `https://your-domain.vercel.app/api/stripe/webhook`

### 7. Set up Google Cloud Vertex AI (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable the Vertex AI API
3. Create a service account with Vertex AI permissions
4. Download the service account key
5. Add the key to your Vercel project

## 🔧 Alternative Deployment Options

### Railway
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing Production

1. Visit your deployed URL
2. Test the authentication flow
3. Try uploading an image and generating
4. Test the payment flow (if configured)

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Dashboard**: Database and auth monitoring
- **Stripe Dashboard**: Payment monitoring

## 🔒 Security Checklist

- [ ] Environment variables are properly set
- [ ] Database is secured with proper access controls
- [ ] Stripe webhooks are configured with proper secrets
- [ ] Supabase RLS policies are configured
- [ ] API routes have proper error handling
- [ ] File uploads are validated and secured

## 🚨 Troubleshooting

### Common Issues:

1. **Build fails**: Check environment variables are set
2. **Database connection fails**: Verify DATABASE_URL format
3. **Authentication not working**: Check Supabase configuration
4. **Payments not working**: Verify Stripe configuration

### Debug Commands:
```bash
# Check build locally
npm run build

# Test database connection
npx prisma db push

# Check environment variables
vercel env ls
```

## 📈 Scaling

- **Database**: Consider upgrading Supabase plan for higher limits
- **CDN**: Vercel provides global CDN automatically
- **Caching**: Implement Redis for session caching if needed
- **Monitoring**: Set up proper logging and error tracking

Your app is now ready for production! 🎉