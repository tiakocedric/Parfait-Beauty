/*
  # Création de la table categories et normalisation

  1. Nouvelle table
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) - nom de la catégorie
      - `slug` (text, unique) - slug pour URLs
      - `description` (text) - description de la catégorie
      - `color` (text) - couleur pour l'affichage
      - `icon` (text) - nom de l'icône
      - `display_order` (integer) - ordre d'affichage
      - `is_active` (boolean) - catégorie active
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Modification table products
    - Ajout de `category_id` (uuid, foreign key)
    - Suppression de l'ancienne colonne `category` (text)

  3. Sécurité
    - Enable RLS sur categories
    - Politique de lecture publique
    - Politique de gestion pour les admins
*/

-- Créer la table categories
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

-- Insérer les catégories existantes
INSERT INTO categories (name, slug, description, color, icon, display_order) VALUES
  ('Cheveux', 'cheveux', 'Soins capillaires, shampooings, masques et huiles pour cheveux', '#8B5CF6', 'Scissors', 1),
  ('Visage', 'visage', 'Crèmes, sérums, nettoyants et soins pour le visage', '#EC4899', 'Sparkles', 2),
  ('Compléments', 'complements', 'Compléments alimentaires beauté, collagène et vitamines', '#10B981', 'Pill', 3),
  ('Soins', 'soins', 'Gommages, baumes, huiles et coffrets de soins', '#F59E0B', 'Heart', 4);

-- Ajouter la nouvelle colonne category_id à products
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id);

-- Mettre à jour les produits existants avec les nouveaux category_id
UPDATE products SET category_id = (
  SELECT id FROM categories WHERE slug = products.category
) WHERE category_id IS NULL;

-- Rendre category_id obligatoire après la migration
ALTER TABLE products ALTER COLUMN category_id SET NOT NULL;

-- Supprimer l'ancienne colonne category (après vérification)
-- ALTER TABLE products DROP COLUMN IF EXISTS category;

-- Créer des index pour les performances
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Enable RLS sur categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique pour categories
CREATE POLICY "Public can read active categories"
  ON categories
  FOR SELECT
  TO public
  USING (is_active = true);

-- Politique de gestion pour les admins authentifiés
CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger pour updated_at sur categories
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();