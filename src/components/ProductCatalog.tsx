import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard';
import { Product } from '../types';

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tous', color: 'bg-gray-100 text-gray-800' },
    { id: 'cheveux', name: 'Cheveux', color: 'bg-purple-100 text-purple-800' },
    { id: 'visage', name: 'Visage', color: 'bg-pink-100 text-pink-800' },
    { id: 'compléments', name: 'Compléments', color: 'bg-green-100 text-green-800' },
    { id: 'soins', name: 'Soins', color: 'bg-blue-100 text-blue-800' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('stock', 0) // Only show products in stock
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to static data if database fails
      const { products: staticProducts } = await import('../data/products');
      setProducts(staticProducts);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { id: 'all', label: 'Tous les produits', count: products.length },
    ...categories.slice(1).map(cat => ({
      id: cat.id,
      label: cat.name,
      count: products.filter(p => p.category === cat.id).length
    }))
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="catalog" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Nos Produits{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-500">
              Phares du Moment
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gluta Glow, Collagen SUPER et Collagen With Burn - Des résultats que vous allez adorer !
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-6 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categoryOptions.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  inline-flex items-center px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105
                  ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-pink-300 hover:text-pink-600'
                  }
                `}
              >
                <Filter className="h-4 w-4 mr-2" />
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou de filtrage
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;