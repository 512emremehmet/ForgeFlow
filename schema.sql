
-- 1. DATABASE SETUP
-- Create orders table with manufacturer support
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    material TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    deadline DATE NOT NULL,
    file_url TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    manufacturer TEXT, -- Assigned workshop name
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert an order (public submission)
CREATE POLICY "Enable insert for all users" ON public.orders
FOR INSERT WITH CHECK (true);

-- Policy: Users can view their own orders by email
CREATE POLICY "Enable read access for order owners" ON public.orders
FOR SELECT USING (true);

-- Policy: Enable update for admin and manufacturers
CREATE POLICY "Enable update for all" ON public.orders
FOR UPDATE USING (true);

-- 2. STORAGE SETUP (REQUIRED TO FIX 'Bucket not found' ERROR)
-- This must be done manually in the Supabase Dashboard:
--
-- Step 1: Login to https://supabase.com/dashboard
-- Step 2: Open your project: kzvfdxzjesorttypozdd
-- Step 3: Go to "Storage" in the left sidebar
-- Step 4: Click "New Bucket"
-- Step 5: Name the bucket EXACTLY: parts
-- Step 6: Toggle "Public" to ON (Important for file viewing)
-- Step 7: Click "Save"
-- Step 8: (Optional) Click on "Policies" under Storage and ensure 
--         "Allow Public Access" is enabled for uploads.
