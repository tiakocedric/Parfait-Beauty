/*
  # Fix categories migration with proper slug matching

  1. Create Categories Table
    - Creates the categories table with proper structure
    - Inserts default categories matching existing product categories
  
  2. Update Products Table
    - Add category_id column if not exists
    - Migrate data from category text to category_id using proper mapping
    - Set category_id as NOT NULL after migration
  
  3. Security
    - Enable RLS on categories table
    - Add public read policy for active categories
    - Add admin management policy
  
  4. Performance
    - Add indexes for optimal querying
*/

-- Create categories table if not exists
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#6B7280',
  icon text DEFAULT 'Package',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert categories matching the product categories
INSERT INTO categories (name, slug, description, color, icon, display_order) 
VALUES
  ('Cheveux', 'cheveux', 'Soins capillaires, shampooings, masques et huiles pour cheveux', '#8B5CF6', 'Scissors', 1),
  ('Visage', 'visage', 'Crèmes, sérums, nettoyants et soins pour le visage', '#EC4899', 'Sparkles', 2),
  ('Compléments', 'compléments', 'Compléments alimentaires beauté, collagène et vitamines', '#10B981', 'Pill', 3),
  ('Soins', 'soins', 'Gommages, baumes, huiles et coffrets de soins', '#F59E0B', 'Heart', 4)
ON CONFLICT (slug) DO NOTHING;

-- Add category_id column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE products ADD COLUMN category_id uuid REFERENCES categories(id);
  END IF;
END $$;

-- Migrate existing data - match by category text directly to slug
UPDATE products 
SET category_id = categories.id
FROM categories
WHERE categories.slug = products.category
  AND products.category_id IS NULL;

-- Verify all products have a category_id before making it NOT NULL
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM products WHERE category_id IS NULL;
  
  IF null_count > 0 THEN
    RAISE EXCEPTION 'Cannot set category_id as NOT NULL: % products still have NULL category_id', null_count;
  END IF;
  
  -- Make category_id NOT NULL after migration
  ALTER TABLE products ALTER COLUMN category_id SET NOT NULL;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can read active categories" ON categories;
  DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
END $$;

-- Public can read active categories
CREATE POLICY "Public can read active categories"
  ON categories
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage categories
CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create or replace trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for categories updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();