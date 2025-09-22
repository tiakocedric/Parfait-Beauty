import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, sendWhatsAppOrder } from '../utils/whatsapp';

const Cart: React.FC = () => {
  const { state, closeCart, updateQuantity, removeItem, getSubtotal, getDeliveryFee, getTotal } = useCart();
  const [customerData, setCustomerData] = useState({
    customerName: '',
    phone: '',
    address: '',
    comment: ''
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!state.isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerData.customerName.trim()) {
      newErrors.customerName = 'Le nom est requis';
    }
    
    if (!customerData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^[0-9+\s-()]{8,}$/.test(customerData.phone.trim())) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    
    if (!customerData.address.trim()) {
      newErrors.address = 'L\'adresse de livraison est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (state.items.length === 0) {
      return;
    }

    // Envoyer la commande via WhatsApp
    sendWhatsAppOrder({
      ...customerData,
      items: state.items,
      subtotal: getSubtotal(),
      deliveryFee: getDeliveryFee(),
      total: getTotal()
    });

    // Fermer le panier après envoi
    closeCart();
    setShowCheckout(false);
    setCustomerData({
      customerName: '',
      phone: '',
      address: '',
      comment: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={closeCart}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-pink-500" />
            Mon Panier ({state.items.length})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Votre panier est vide
              </h3>
              <p className="text-gray-600 mb-4">
                Découvrez nos produits et ajoutez-les à votre panier
              </p>
              <button
                onClick={closeCart}
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <>
              {!showCheckout ? (
                <div className="p-4">
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {state.items.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {formatPrice(item.price)}
                            </p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                
                                <span className="px-3 py-1 bg-white border border-gray-200 rounded text-sm font-medium">
                                  {item.quantity}
                                </span>
                                
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Sous-total</span>
                        <span>{formatPrice(getSubtotal())}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Frais de livraison</span>
                        <span>{formatPrice(getDeliveryFee())}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                        <span>Total</span>
                        <span>{formatPrice(getTotal())}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Commander via WhatsApp</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {/* Checkout Form */}
                  <div className="mb-4">
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="text-pink-600 hover:text-pink-700 font-medium flex items-center"
                    >
                      ← Retour au panier
                    </button>
                  </div>

                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        value={customerData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                          errors.customerName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Votre nom complet"
                      />
                      {errors.customerName && (
                        <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de téléphone *
                      </label>
                      <input
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+237 6XX XXX XXX"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse de livraison *
                      </label>
                      <textarea
                        value={customerData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Votre adresse complète de livraison"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commentaire (optionnel)
                      </label>
                      <textarea
                        value={customerData.comment}
                        onChange={(e) => handleInputChange('comment', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                        placeholder="Instructions particulières..."
                      />
                    </div>

                    {/* Order Summary Recap */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Récapitulatif</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Sous-total</span>
                          <span>{formatPrice(getSubtotal())}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Livraison</span>
                          <span>{formatPrice(getDeliveryFee())}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-1">
                          <span>Total</span>
                          <span>{formatPrice(getTotal())}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Envoyer ma commande</span>
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Votre commande sera envoyée via WhatsApp pour confirmation
                    </p>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;