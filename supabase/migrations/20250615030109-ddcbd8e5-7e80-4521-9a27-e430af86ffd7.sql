
-- Create table for pulsa products
CREATE TABLE IF NOT EXISTS public.pulsa_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator VARCHAR(50) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  nominal INTEGER NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  buyer_sku_code VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for pulsa transactions
CREATE TABLE IF NOT EXISTS public.pulsa_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  ref_id VARCHAR(50) UNIQUE NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  operator VARCHAR(50) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  nominal INTEGER NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  sku VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  message TEXT,
  digiflazz_trx_id VARCHAR(50),
  serial_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.pulsa_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pulsa_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for pulsa_products (readable by all authenticated users)
CREATE POLICY "Anyone can view active pulsa products" 
  ON public.pulsa_products 
  FOR SELECT 
  USING (is_active = true);

-- Policies for pulsa_transactions (users can only see their own transactions)
CREATE POLICY "Users can view their own pulsa transactions" 
  ON public.pulsa_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pulsa transactions" 
  ON public.pulsa_transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pulsa transactions" 
  ON public.pulsa_transactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert sample pulsa products
INSERT INTO public.pulsa_products (operator, product_name, nominal, price, buyer_sku_code) VALUES
-- Telkomsel
('Telkomsel', 'Telkomsel 5K', 5000, 6500, 'tsel5'),
('Telkomsel', 'Telkomsel 10K', 10000, 11500, 'tsel10'),
('Telkomsel', 'Telkomsel 15K', 15000, 16500, 'tsel15'),
('Telkomsel', 'Telkomsel 20K', 20000, 21500, 'tsel20'),
('Telkomsel', 'Telkomsel 25K', 25000, 26500, 'tsel25'),
('Telkomsel', 'Telkomsel 50K', 50000, 51500, 'tsel50'),
('Telkomsel', 'Telkomsel 100K', 100000, 101500, 'tsel100'),

-- Indosat
('Indosat', 'Indosat 5K', 5000, 6500, 'isat5'),
('Indosat', 'Indosat 10K', 10000, 11500, 'isat10'),
('Indosat', 'Indosat 15K', 15000, 16500, 'isat15'),
('Indosat', 'Indosat 20K', 20000, 21500, 'isat20'),
('Indosat', 'Indosat 25K', 25000, 26500, 'isat25'),
('Indosat', 'Indosat 50K', 50000, 51500, 'isat50'),
('Indosat', 'Indosat 100K', 100000, 101500, 'isat100'),

-- XL
('XL', 'XL 5K', 5000, 6500, 'xl5'),
('XL', 'XL 10K', 10000, 11500, 'xl10'),
('XL', 'XL 15K', 15000, 16500, 'xl15'),
('XL', 'XL 20K', 20000, 21500, 'xl20'),
('XL', 'XL 25K', 25000, 26500, 'xl25'),
('XL', 'XL 50K', 50000, 51500, 'xl50'),
('XL', 'XL 100K', 100000, 101500, 'xl100'),

-- Tri
('Tri', 'Tri 5K', 5000, 6500, 'tri5'),
('Tri', 'Tri 10K', 10000, 11500, 'tri10'),
('Tri', 'Tri 15K', 15000, 16500, 'tri15'),
('Tri', 'Tri 20K', 20000, 21500, 'tri20'),
('Tri', 'Tri 25K', 25000, 26500, 'tri25'),
('Tri', 'Tri 50K', 50000, 51500, 'tri50'),
('Tri', 'Tri 100K', 100000, 101500, 'tri100'),

-- Smartfren
('Smartfren', 'Smartfren 5K', 5000, 6500, 'smart5'),
('Smartfren', 'Smartfren 10K', 10000, 11500, 'smart10'),
('Smartfren', 'Smartfren 15K', 15000, 16500, 'smart15'),
('Smartfren', 'Smartfren 20K', 20000, 21500, 'smart20'),
('Smartfren', 'Smartfren 25K', 25000, 26500, 'smart25'),
('Smartfren', 'Smartfren 50K', 50000, 51500, 'smart50'),
('Smartfren', 'Smartfren 100K', 100000, 101500, 'smart100');
