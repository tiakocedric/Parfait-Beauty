import React from 'react';
import { Sparkles, ShoppingBag } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-pink-50 to-pink-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 to-green-200/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-200">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-semibold text-gray-700">Produits phares du moment</span>
            </div>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Gluta Glow & Collagen{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-500">
              Premium Collection
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Découvrez nos compléments beauté premium ! Redonnez à votre corps tout ce qu'il mérite avec 
            Gluta Glow, Collagen SUPER et Collagen With Burn. Des résultats visibles, 100% sûrs et sans effets secondaires.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <button
              onClick={scrollToCatalog}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Découvrir nos produits
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-8 py-4 bg-white text-pink-600 font-semibold rounded-full border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300 transform hover:scale-105 transition-all duration-300"
            >
              Nous contacter
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Clients satisfaites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Produits naturels</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24h</div>
              <div className="text-gray-600 font-medium">Livraison rapide</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
    </section>
  );
};

export default Hero;