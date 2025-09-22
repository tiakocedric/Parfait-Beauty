import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Mail, Instagram } from 'lucide-react';

const Contact: React.FC = () => {
  const contactWhatsApp = () => {
    const message = encodeURIComponent("Bonjour ! Je souhaiterais obtenir plus d'informations sur vos produits de beauté.");
    window.open(`https://wa.me/237694165996?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Restons en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-500">
              Contact
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Nos Coordonnées
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="h-6 w-6 text-pink-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Téléphone</p>
                    <p className="text-gray-600">+237 6 94 16 59 96</p>
                    <p className="text-gray-600">+237 6 90 89 33 20</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-gray-600">+237 6 94 16 59 96</p>
                    <p className="text-gray-600">+237 6 90 89 33 20</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">nyaparfait91@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-red-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Adresse</p>
                    <p className="text-gray-600">
                      Village, Douala, Cameroun<br />
                      Livraison dans tout le pays
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-amber-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Horaires</p>
                    <p className="text-gray-600">
                      Lundi - Samedi : 8h - 18h<br />
                      Dimanche : 10h - 16h
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Instagram className="h-6 w-6 text-purple-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Réseaux sociaux</p>
                    <p className="text-gray-600">@parfaitShopandbeauty</p>
                    <p className="text-gray-500 text-sm">Instagram • TikTok • Facebook</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">
                Commandez rapidement via WhatsApp
              </h3>
              <p className="mb-4">
                Contactez-nous directement pour passer votre commande ou obtenir des conseils personnalisés.
              </p>
              <button
                onClick={contactWhatsApp}
                className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Contacter via WhatsApp
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Questions Fréquentes
            </h3>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Comment passer une commande ?
                </h4>
                <p className="text-gray-600 text-sm">
                  Ajoutez vos produits au panier, remplissez vos informations de livraison, 
                  puis votre commande sera automatiquement envoyée via WhatsApp pour confirmation.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Quels sont les délais de livraison ?
                </h4>
                <p className="text-gray-600 text-sm">
                  24-48h à Douala et Yaoundé, 2-5 jours pour les autres villes du Cameroun. 
                  Livraison gratuite à partir de 50 000 XAF.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Modes de paiement acceptés ?
                </h4>
                <p className="text-gray-600 text-sm">
                  Mobile Money (MTN, Orange), paiement à la livraison, 
                  et virement bancaire. Paiement sécurisé garanti.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Puis-je retourner un produit ?
                </h4>
                <p className="text-gray-600 text-sm">
                  Oui, retour possible dans les 7 jours suivant la réception 
                  si le produit ne vous convient pas (produit non ouvert).
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Vos produits sont-ils authentiques ?
                </h4>
                <p className="text-gray-600 text-sm">
                  Absolument ! Nous garantissons l'authenticité de tous nos produits. 
                  Nous travaillons uniquement avec des fournisseurs agréés et de confiance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;