-- Production Database Setup Script
-- Run this in your Supabase SQL Editor or PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "stripeId" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 25,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "ghlContactId" TEXT
);

-- Create GenerationJob table
CREATE TABLE IF NOT EXISTS "GenerationJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true
);

-- Create CreditLedger table
CREATE TABLE IF NOT EXISTS "CreditLedger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "ref" TEXT
);

-- Add foreign key constraints
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'GenerationJob_userId_fkey'
    ) THEN
        ALTER TABLE "GenerationJob" 
        ADD CONSTRAINT "GenerationJob_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'CreditLedger_userId_fkey'
    ) THEN
        ALTER TABLE "CreditLedger" 
        ADD CONSTRAINT "CreditLedger_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_stripeId_idx" ON "User"("stripeId");
CREATE INDEX IF NOT EXISTS "GenerationJob_userId_idx" ON "GenerationJob"("userId");
CREATE INDEX IF NOT EXISTS "CreditLedger_userId_idx" ON "CreditLedger"("userId");

-- Create updatedAt trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updatedAt trigger to User table
DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert a test user (optional)
INSERT INTO "User" ("id", "email", "credits") 
VALUES ('test-user-123', 'test@example.com', 25)
ON CONFLICT ("id") DO NOTHING;

-- Create RLS policies for Supabase (if using Supabase)
-- Enable RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GenerationJob" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditLedger" ENABLE ROW LEVEL SECURITY;

-- Create policies for User table
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON "User"
    FOR UPDATE USING (auth.uid()::text = id);

-- Create policies for GenerationJob table
CREATE POLICY "Users can view own jobs" ON "GenerationJob"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own jobs" ON "GenerationJob"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Create policies for CreditLedger table
CREATE POLICY "Users can view own ledger" ON "CreditLedger"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own ledger" ON "CreditLedger"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;