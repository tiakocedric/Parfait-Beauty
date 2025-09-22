import React from 'react';
import { ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const { getItemCount, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-400 fill-current" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Parfait Beauty</h1>
              <p className="text-xs text-pink-400 font-medium">Shop & Beauty</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              Accueil
            </a>
            <a href="#catalog" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              Catalogue
            </a>
            <a href="#about" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              À propos
            </a>
            <a href="#contact" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-pink-500 transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-pink-500 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-pink-100 bg-white">
            <nav className="py-4 space-y-2">
              <a
                href="#home"
                className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </a>
              <a
                href="#catalog"
                className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Catalogue
              </a>
              <a
                href="#about"
                className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </a>
              <a
                href="#contact"
                className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;