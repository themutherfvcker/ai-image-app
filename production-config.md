# Production Configuration Checklist

## 🔧 Environment Variables Required

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Configuration
```
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### Stripe Configuration (Optional)
```
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID_SUB=price_your_subscription_price_id
```

### Google Cloud Vertex AI (Optional)
```
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

## 🗄️ Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down URL and anon key

2. **Run Database Migration**
   - Go to Supabase SQL Editor
   - Run the script from `scripts/setup-production-db.sql`

3. **Verify Tables Created**
   - Check that User, GenerationJob, and CreditLedger tables exist
   - Verify indexes are created
   - Test RLS policies

## 🚀 Deployment Platforms

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push to main

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

## 🔒 Security Configuration

### Supabase Security
- [ ] Enable Row Level Security (RLS)
- [ ] Configure auth policies
- [ ] Set up proper CORS settings
- [ ] Enable email confirmation

### API Security
- [ ] Validate all inputs
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Secure file uploads

### Environment Security
- [ ] Use strong database passwords
- [ ] Rotate API keys regularly
- [ ] Enable 2FA on all accounts
- [ ] Monitor access logs

## 📊 Monitoring Setup

### Application Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure performance monitoring
- [ ] Set up uptime monitoring
- [ ] Create alerting rules

### Database Monitoring
- [ ] Monitor query performance
- [ ] Set up connection pooling
- [ ] Configure backup schedules
- [ ] Monitor storage usage

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Test user registration
- [ ] Test user login
- [ ] Test password reset
- [ ] Test OAuth providers

### Core Functionality
- [ ] Test image upload
- [ ] Test text-to-image generation
- [ ] Test image-to-image editing
- [ ] Test credit system

### Payment Integration
- [ ] Test subscription creation
- [ ] Test payment processing
- [ ] Test webhook handling
- [ ] Test refund process

## 🚨 Troubleshooting

### Common Issues
1. **Build Failures**: Check environment variables
2. **Database Connection**: Verify DATABASE_URL format
3. **Authentication Issues**: Check Supabase configuration
4. **Payment Issues**: Verify Stripe configuration

### Debug Commands
```bash
# Check build locally
npm run build

# Test database connection
npx prisma db push

# Check environment variables
vercel env ls

# View logs
vercel logs
```

## 📈 Performance Optimization

### Frontend
- [ ] Enable image optimization
- [ ] Implement lazy loading
- [ ] Use CDN for static assets
- [ ] Optimize bundle size

### Backend
- [ ] Implement caching
- [ ] Optimize database queries
- [ ] Use connection pooling
- [ ] Monitor API response times

## 🔄 Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Monitor error rates
- [ ] Check database performance
- [ ] Review security logs

### Backup Strategy
- [ ] Daily database backups
- [ ] Code repository backups
- [ ] Environment variable backups
- [ ] Disaster recovery plan

## 📞 Support

### Documentation
- [ ] API documentation
- [ ] User guide
- [ ] Admin guide
- [ ] Troubleshooting guide

### Contact Information
- [ ] Support email
- [ ] Status page
- [ ] Community forum
- [ ] Bug reporting system

---

**Note**: This checklist should be completed before going live with your production deployment.