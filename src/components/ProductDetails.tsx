import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Star, 
  Heart, 
  Share2, 
  ShoppingBag,
  Check,
  AlertTriangle,
  Truck,
  Shield,
  Award
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/whatsapp';
import { supabase } from '../lib/supabase';

const getCategoryColor = (category: string) => {
  const colors = {
    'cheveux': 'bg-purple-100 text-purple-800',
    'visage': 'bg-pink-100 text-pink-800',
    'compléments': 'bg-green-100 text-green-800',
    'soins': 'bg-blue-100 text-blue-800'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback to static data
      const { products } = await import('../data/products');
      const foundProduct = products.find(p => p.id === productId);
      setProduct(foundProduct || null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    
    setTimeout(() => {
      openCart();
    }, 300);
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getCategoryColor = (category: string) => {
    if (product?.categories?.color) {
      return `text-white bg-[${product.categories.color}]`;
    }
    return 'bg-gray-100 text-gray-700';
  };

  const getCategoryLabel = () => {
    return product?.categories?.name || 'Catégorie';
  };

  const getProductBenefits = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('gluta glow')) {
      return [
        'Éclat uniforme qui rayonne de l\'intérieur',
        'Peau hydratée et ferme',
        'Réduction des imperfections',
        '100% sûr et sans effets secondaires'
      ];
    } else if (name.includes('collagen super')) {
      return [
        'Réduction des rides et ridules',
        'Cheveux plus épais et brillants',
        'Ongles plus forts et résistants',
        'Formule premium anti-âge'
      ];
    } else if (name.includes('collagen with burn')) {
      return [
        'Double action collagène + brûleur',
        'Regain d\'énergie et métabolisme boosté',
        'Beauté naturelle au goût délicieux',
        'Résultats visibles rapidement'
      ];
    } else if (name.includes('masque') || name.includes('soin')) {
      return [
        'Formule enrichie en actifs naturels',
        'Résultats visibles dès la première utilisation',
        'Convient à tous types de peau',
        'Texture agréable et parfum délicat'
      ];
    }
    return [
      'Produit de qualité premium',
      'Formule testée et approuvée',
      'Résultats garantis',
      'Utilisation quotidienne recommandée'
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  const benefits = getProductBenefits(product.name);
  const images = [product.image_url]; // Pour l'instant une seule image, extensible

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-gray-900 truncate mx-4">
            {product.name}
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Breadcrumb Desktop */}
        <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate('/')}
            className="hover:text-pink-600 transition-colors"
          >
            Accueil
          </button>
          <span>/</span>
          <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(product.category)}`}>
            {getCategoryLabel(product.category)}
          </span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images (si plusieurs images) */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-pink-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span 
                className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                getCategoryColor(product.category)
              >
                {product.category}
              </span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">(4.8)</span>
              </div>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.price > 30000 && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(Math.round(product.price * 1.2))}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stock > 10 ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-green-700 font-medium">En stock ({product.stock} disponibles)</span>
                </>
              ) : product.stock > 0 ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span className="text-orange-700 font-medium">
                    Plus que {product.stock} en stock !
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 font-medium">Rupture de stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bénéfices</h3>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 shadow-lg hover:shadow-xl'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>
                  {product.stock === 0 ? 'Rupture de stock' : `Ajouter au panier • ${formatPrice(product.price * quantity)}`}
                </span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-xs text-gray-600">Livraison 24-48h</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600">Paiement sécurisé</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-2">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-xs text-gray-600">Qualité garantie</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;