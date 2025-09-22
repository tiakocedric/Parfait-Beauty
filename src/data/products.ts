import { Product } from '../types';

export const products: Product[] = [
  // Cheveux
  {
    id: '1',
    name: 'Masque Hydratant Intense',
    description: 'Masque réparateur profond pour cheveux secs et abîmés. Formule enrichie en huiles naturelles pour une hydratation longue durée.',
    price: 15000,
    stock: 25,
    category: 'cheveux',
    image_url: 'https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Shampoing Fortifiant Bio',
    description: 'Shampoing naturel qui renforce et nourrit vos cheveux. Sans sulfates, enrichi en protéines végétales.',
    price: 12000,
    stock: 30,
    category: 'cheveux',
    image_url: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Huile Capillaire Précieuse',
    description: 'Mélange d\'huiles précieuses pour nourrir et faire briller vos cheveux. Idéale pour tous types de cheveux.',
    price: 18000,
    stock: 15,
    category: 'cheveux',
    image_url: 'https://images.pexels.com/photos/4465812/pexels-photo-4465812.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

  // Visage
  {
    id: '4',
    name: 'Sérum Vitamine C Premium',
    description: 'Sérum concentré en vitamine C pour illuminer le teint et réduire les taches. Formule anti-âge puissante.',
    price: 25000,
    stock: 20,
    category: 'visage',
    image_url: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    name: 'Crème Hydratante 24h',
    description: 'Crème hydratante longue durée pour tous types de peau. Texture légère et non grasse.',
    price: 20000,
    stock: 35,
    category: 'visage',
    image_url: 'https://images.pexels.com/photos/3735677/pexels-photo-3735677.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    name: 'Masque Purifiant Argile',
    description: 'Masque à l\'argile verte pour purifier et matifier la peau. Parfait pour les peaux mixtes à grasses.',
    price: 16000,
    stock: 22,
    category: 'visage',
    image_url: 'https://images.pexels.com/photos/4465814/pexels-photo-4465814.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

  // Compléments
  {
    id: '7',
    name: 'Collagène Marine Premium',
    description: 'Complément alimentaire au collagène marin pour une peau éclatante et des cheveux forts. Cure de 30 jours.',
    price: 35000,
    stock: 18,
    category: 'compléments',
    image_url: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '8',
    name: 'Vitamines Beauté Complex',
    description: 'Complexe de vitamines et minéraux pour la beauté. Biotine, zinc et vitamines du groupe B.',
    price: 28000,
    stock: 25,
    category: 'compléments',
    image_url: 'https://images.pexels.com/photos/3873193/pexels-photo-3873193.jpeg?auto=compress&cs=tinysrgb&w=400'
  },

  // Soins
  {
    id: '9',
    name: 'Gommage Corps Exfoliant',
    description: 'Gommage doux au sucre et huiles essentielles pour une peau douce et lisse. Parfum relaxant.',
    price: 22000,
    stock: 16,
    category: 'soins',
    image_url: 'https://images.pexels.com/photos/4465835/pexels-photo-4465835.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '10',
    name: 'Baume Corps Nourrissant',
    description: 'Baume riche pour nourrir intensément la peau sèche. Formule au beurre de karité et huile d\'argan.',
    price: 19000,
    stock: 28,
    category: 'soins',
    image_url: 'https://images.pexels.com/photos/4465822/pexels-photo-4465822.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '11',
    name: 'Huile de Massage Relaxante',
    description: 'Huile de massage aux huiles essentielles apaisantes. Idéale pour la détente et l\'hydratation.',
    price: 24000,
    stock: 12,
    category: 'soins',
    image_url: 'https://images.pexels.com/photos/3735674/pexels-photo-3735674.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '12',
    name: 'Coffret Découverte Beauté',
    description: 'Coffret contenant 5 miniatures de nos bestsellers. Parfait pour découvrir notre gamme premium.',
    price: 45000,
    stock: 8,
    category: 'soins',
    image_url: 'https://images.pexels.com/photos/3785083/pexels-photo-3785083.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];