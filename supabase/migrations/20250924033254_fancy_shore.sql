/*
  # Insert sample products data

  1. Sample Data
    - Insert initial products from the static data
    - Covers all categories: cheveux, visage, compléments, soins
    - Uses Pexels images for product photos
*/

-- Insert sample products
INSERT INTO products (id, name, description, price, stock, category, image_url) VALUES
-- Cheveux
('550e8400-e29b-41d4-a716-446655440001', 'Masque Hydratant Intense', 'Masque réparateur profond pour cheveux secs et abîmés. Formule enrichie en huiles naturelles pour une hydratation longue durée.', 15000, 25, 'cheveux', 'https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440002', 'Shampoing Fortifiant Bio', 'Shampoing naturel qui renforce et nourrit vos cheveux. Sans sulfates, enrichi en protéines végétales.', 12000, 30, 'cheveux', 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440003', 'Huile Capillaire Précieuse', 'Mélange d''huiles précieuses pour nourrir et faire briller vos cheveux. Idéale pour tous types de cheveux.', 18000, 15, 'cheveux', 'https://images.pexels.com/photos/4465812/pexels-photo-4465812.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Visage
('550e8400-e29b-41d4-a716-446655440004', 'Sérum Vitamine C Premium', 'Sérum concentré en vitamine C pour illuminer le teint et réduire les taches. Formule anti-âge puissante.', 25000, 20, 'visage', 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440005', 'Crème Hydratante 24h', 'Crème hydratante longue durée pour tous types de peau. Texture légère et non grasse.', 20000, 35, 'visage', 'https://images.pexels.com/photos/3735677/pexels-photo-3735677.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440006', 'Masque Purifiant Argile', 'Masque à l''argile verte pour purifier et matifier la peau. Parfait pour les peaux mixtes à grasses.', 16000, 22, 'visage', 'https://images.pexels.com/photos/4465814/pexels-photo-4465814.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Compléments (produits phares)
('550e8400-e29b-41d4-a716-446655440007', 'Gluta Glow Premium', 'Complément révolutionnaire au glutathion pour un éclat uniforme qui rayonne de l''intérieur. Peau hydratée, ferme et éclatante garantie.', 45000, 12, 'compléments', 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440008', 'Collagen SUPER', 'Formule exclusive de collagène premium pour réduire rides et ridules. Cheveux plus épais, ongles plus forts, résultats visibles rapidement.', 38000, 15, 'compléments', 'https://images.pexels.com/photos/3873193/pexels-photo-3873193.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440009', 'Collagen With Burn', 'Double action : collagène anti-âge + brûleur de graisse. Regain d''énergie, métabolisme boosté et beauté naturelle au goût délicieux.', 42000, 10, 'compléments', 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440010', 'Collagène Marine Premium', 'Complément alimentaire au collagène marin pour une peau éclatante et des cheveux forts. Cure de 30 jours.', 35000, 18, 'compléments', 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440011', 'Vitamines Beauté Complex', 'Complexe de vitamines et minéraux pour la beauté. Biotine, zinc et vitamines du groupe B.', 28000, 25, 'compléments', 'https://images.pexels.com/photos/3873193/pexels-photo-3873193.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Soins
('550e8400-e29b-41d4-a716-446655440012', 'Gommage Corps Exfoliant', 'Gommage doux au sucre et huiles essentielles pour une peau douce et lisse. Parfum relaxant.', 22000, 16, 'soins', 'https://images.pexels.com/photos/4465835/pexels-photo-4465835.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440013', 'Baume Corps Nourrissant', 'Baume riche pour nourrir intensément la peau sèche. Formule au beurre de karité et huile d''argan.', 19000, 28, 'soins', 'https://images.pexels.com/photos/4465822/pexels-photo-4465822.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440014', 'Huile de Massage Relaxante', 'Huile de massage aux huiles essentielles apaisantes. Idéale pour la détente et l''hydratation.', 24000, 12, 'soins', 'https://images.pexels.com/photos/3735674/pexels-photo-3735674.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440015', 'Coffret Découverte Beauté', 'Coffret contenant 5 miniatures de nos bestsellers. Parfait pour découvrir notre gamme premium.', 45000, 8, 'soins', 'https://images.pexels.com/photos/3785083/pexels-photo-3785083.jpeg?auto=compress&cs=tinysrgb&w=400')

ON CONFLICT (id) DO NOTHING;