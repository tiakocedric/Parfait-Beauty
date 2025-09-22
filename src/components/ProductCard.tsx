import React from 'react';
import { Plus, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    // Petit délai pour l'animation puis ouvrir le panier
    setTimeout(() => {
      openCart();
    }, 300);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cheveux':
        return 'bg-purple-100 text-purple-700';
      case 'visage':
        return 'bg-pink-100 text-pink-700';
      case 'compléments':
        return 'bg-green-100 text-green-700';
      case 'soins':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cheveux':
        return 'Cheveux';
      case 'visage':
        return 'Visage';
      case 'compléments':
        return 'Compléments';
      case 'soins':
        return 'Soins';
      default:
        return category;
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(product.category)}`}>
            {getCategoryLabel(product.category)}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
          <Star className="h-3 w-3 text-amber-400 fill-current" />
          <span className="text-xs font-medium text-gray-700">4.8</span>
        </div>

        {/* Stock indicator */}
        {product.stock < 10 && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Plus que {product.stock} en stock !
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`
              inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105
              ${product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 shadow-md hover:shadow-lg'
              }
            `}
          >
            <Plus className="h-4 w-4 mr-1" />
            {product.stock === 0 ? 'Rupture' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;