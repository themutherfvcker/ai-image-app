# 🚀 Nano Banana AI Image Editor - Production Ready

A production-ready AI image editor with user authentication, credit system, and seamless deployment.

## ✨ Features

- **🔐 User Authentication**: Supabase-powered auth with Google OAuth and email
- **🎨 AI Image Generation**: Text-to-image and image-to-image editing
- **💳 Credit System**: Built-in credit management and Stripe payments
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **⚡ Fast Performance**: Optimized with Next.js 15 and Turbopack
- **🔒 Production Ready**: Secure, scalable, and monitored

## 🚀 Quick Deploy (5 minutes)

### Option 1: One-Click Deploy
```bash
# Make sure you have Vercel CLI installed
npm install -g vercel

# Run the quick deploy script
./quick-deploy.sh
```

### Option 2: Manual Deploy
```bash
# 1. Build the application
npm run build

# 2. Deploy to Vercel
vercel --prod

# 3. Follow the setup instructions below
```

## 🔧 Production Setup

### 1. Supabase Setup (Required)
1. Go to [supabase.com](https://supabase.com) and create a project
2. In your project dashboard, go to **Settings > API**
3. Copy your **Project URL** and **anon public** key
4. Go to **Settings > Database** and copy your **Connection string**

### 2. Vercel Configuration
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your deployed project
3. Go to **Settings > Environment Variables**
4. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### 3. Database Setup
1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Run this script:

```sql
-- Copy and paste the contents of scripts/setup-production-db.sql
```

### 4. Redeploy
1. Go back to Vercel Dashboard
2. Click **Redeploy** on your latest deployment
3. Your app is now live! 🎉

## 🎯 What You Get

### For Users
- **Seamless Authentication**: Sign up with Google or email
- **Free Credits**: 25 credits to start generating images
- **Easy Image Editing**: Upload photos and describe changes
- **Text-to-Image**: Generate images from text descriptions
- **Credit Management**: Buy more credits or subscribe

### For You (Admin)
- **User Management**: Track users and their activity
- **Credit System**: Monitor credit usage and purchases
- **Analytics**: Built-in performance monitoring
- **Scalable**: Handles thousands of users
- **Secure**: Production-grade security

## 📊 Monitoring & Analytics

- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Dashboard**: User and database analytics
- **Error Tracking**: Automatic error reporting
- **Uptime Monitoring**: 99.9% uptime guarantee

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: All inputs are validated and sanitized
- **Rate Limiting**: Prevents abuse and spam
- **HTTPS**: All traffic encrypted

## 💰 Payment Integration (Optional)

To enable payments:

1. **Set up Stripe**:
   - Create a Stripe account
   - Get your API keys
   - Create a $5/month subscription product

2. **Add Stripe variables to Vercel**:
```
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRICE_ID_SUB=price_your_price_id
```

3. **Configure webhooks**:
   - Point to `https://your-domain.vercel.app/api/stripe/webhook`

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

### Environment Variables
```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
DATABASE_URL=your-database-url

# Optional
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
STRIPE_PRICE_ID_SUB=your-price-id
```

## 📁 Project Structure

```
├── app/
│   ├── api/                 # API routes
│   ├── components/          # React components
│   ├── contexts/           # React contexts (Auth)
│   ├── generator/          # Generator page
│   └── page.js             # Homepage
├── lib/
│   ├── db.ts              # Database connection
│   └── supabaseClient.js  # Supabase client
├── prisma/
│   └── schema.prisma      # Database schema
├── scripts/
│   ├── deploy.sh          # Deployment script
│   └── setup-production-db.sql
└── vercel.json           # Vercel configuration
```

## 🚨 Troubleshooting

### Common Issues

**Build fails**: Check environment variables are set correctly
**Authentication not working**: Verify Supabase configuration
**Database errors**: Check DATABASE_URL format
**Payments not working**: Verify Stripe configuration

### Debug Commands
```bash
# Check build locally
npm run build

# Test database connection
npx prisma db push

# Check Vercel logs
vercel logs
```

## 📈 Scaling

- **Database**: Upgrade Supabase plan for higher limits
- **CDN**: Vercel provides global CDN automatically
- **Caching**: Implement Redis for session caching
- **Monitoring**: Set up proper logging and alerts

## 🆘 Support

- **Documentation**: Check `DEPLOYMENT_GUIDE.md`
- **Issues**: Create GitHub issues
- **Community**: Join our Discord server
- **Email**: support@nanobanana.ai

## 📄 License

MIT License - see LICENSE file for details

---

**Ready to deploy?** Run `./quick-deploy.sh` and follow the instructions! 🚀