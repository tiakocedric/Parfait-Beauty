import React from 'react';
import { Heart, Phone, MessageCircle, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const contactWhatsApp = () => {
    const message = encodeURIComponent("Bonjour ! Je souhaiterais obtenir plus d'informations sur vos produits.");
    window.open(`https://wa.me/237694165996?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-pink-400 fill-current" />
              <div>
                <h3 className="text-xl font-bold">Parfait Beauty</h3>
                <p className="text-sm text-pink-300">Shop & Beauty</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Votre destination beauté au Cameroun. Nous proposons une sélection premium 
              de cosmétiques et soins de beauté pour révéler votre éclat naturel.
            </p>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={contactWhatsApp}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </button>
              
              <div className="flex items-center space-x-3">
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink-300">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#catalog" className="text-gray-300 hover:text-white transition-colors">
                  Catalogue
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink-300">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">+237 6 94 16 59 96</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">WhatsApp 24/7</span>
              </div>
              <p className="text-gray-300 text-sm mt-3">
                Douala, Cameroun<br />
                Livraison nationale
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <h4 className="text-lg font-semibold mb-4 text-pink-300">Nos Catégories</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <h5 className="font-medium text-white mb-1">Cheveux</h5>
              <p className="text-sm text-gray-400">Shampooings, masques, huiles</p>
            </div>
            <div className="text-center">
              <h5 className="font-medium text-white mb-1">Visage</h5>
              <p className="text-sm text-gray-400">Crèmes, sérums, nettoyants</p>
            </div>
            <div className="text-center">
              <h5 className="font-medium text-white mb-1">Compléments</h5>
              <p className="text-sm text-gray-400">Vitamines, collagène</p>
            </div>
            <div className="text-center">
              <h5 className="font-medium text-white mb-1">Soins</h5>
              <p className="text-sm text-gray-400">Gommages, baumes, coffrets</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Parfait Shop and Beauty. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;