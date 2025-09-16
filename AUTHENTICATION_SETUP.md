# Authentication Setup

This application now includes user authentication using Supabase. Here's how to set it up:

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your Supabase dashboard, go to Settings > API
3. Copy your project URL and anon key
4. Update the `.env.local` file with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-actual-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
```

## 2. Database Schema

The application uses Prisma for database management. Make sure your database schema includes a `User` table with the following structure:

```prisma
model User {
  id      String @id @default(cuid())
  credits Int    @default(25)
  email   String? @unique
  // Add other fields as needed
}
```

## 3. Authentication Features

- **Try Now Button**: When clicked, it will either scroll to the generator (if authenticated) or show the sign-in modal
- **Generate Button**: When clicked, it will prompt for authentication if the user is not signed in
- **Sign In Modal**: Provides Google OAuth and email-based authentication
- **Credit System**: Users get 25 free credits on first sign-up

## 4. How It Works

1. Users can browse the homepage without authentication
2. When they try to use the generator, they're prompted to sign in
3. After authentication, they can upload photos, enter prompts, and generate images
4. Credits are tracked and displayed in the UI

## 5. Testing

1. Start the development server: `npm run dev`
2. Visit the homepage and click "Try Now" - you should see the sign-in modal
3. Sign in with Google or email
4. Try using the generator - it should now work without prompting for authentication