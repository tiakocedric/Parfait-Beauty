/*
  # Configuration utilisateur admin

  1. Création d'un utilisateur admin de test
  2. Configuration des politiques d'authentification
  3. Insertion des données utilisateur
*/

-- Créer un utilisateur admin via l'interface Supabase Auth
-- Email: admin@parfaitbeauty.com
-- Mot de passe: admin123

-- Politique pour permettre l'accès admin
CREATE POLICY "Allow authenticated users to access admin features"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (true);

-- Mettre à jour les politiques existantes si nécessaire
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can manage order items" ON order_items;