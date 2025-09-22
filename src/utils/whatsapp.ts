import { CartItem } from '../types';

interface OrderData {
  customerName: string;
  phone: string;
  address: string;
  comment?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export const formatWhatsAppMessage = (orderData: OrderData): string => {
  const { customerName, phone, address, comment, items, subtotal, deliveryFee, total } = orderData;
  
  let message = `🌸 *NOUVELLE COMMANDE - PARFAIT BEAUTY*\n\n`;
  
  // Informations client
  message += `👤 *CLIENT :*\n`;
  message += `• Nom : ${customerName}\n`;
  message += `• Téléphone : ${phone}\n`;
  message += `• Adresse : ${address}\n\n`;
  
  // Produits commandés
  message += `🛍️ *PRODUITS COMMANDÉS :*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Quantité : ${item.quantity}\n`;
    message += `   Prix unitaire : ${item.price.toLocaleString()} XAF\n`;
    message += `   Sous-total : ${(item.price * item.quantity).toLocaleString()} XAF\n\n`;
  });
  
  // Récapitulatif financier
  message += `💰 *RÉCAPITULATIF :*\n`;
  message += `• Sous-total : ${subtotal.toLocaleString()} XAF\n`;
  message += `• Frais de livraison : ${deliveryFee.toLocaleString()} XAF\n`;
  message += `• *TOTAL : ${total.toLocaleString()} XAF*\n\n`;
  
  // Commentaire si présent
  if (comment && comment.trim()) {
    message += `📝 *COMMENTAIRE :*\n${comment}\n\n`;
  }
  
  message += `✨ Merci de confirmer cette commande !\n`;
  message += `🚀 Parfait Shop and Beauty - Votre beauté, notre passion`;
  
  return message;
};

export const sendWhatsAppOrder = (orderData: OrderData): void => {
  const message = formatWhatsAppMessage(orderData);
  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = '237694165996'; // Numéro WhatsApp fourni
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  // Ouvrir WhatsApp
  window.open(whatsappUrl, '_blank');
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} XAF`;
};