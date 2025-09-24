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
  const whatsappNumber = '237694165996'; // Numéro WhatsApp principal
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  // Log order to database
  logOrderToDatabase(orderData);
  
  // Ouvrir WhatsApp
  window.open(whatsappUrl, '_blank');
};

const logOrderToDatabase = async (orderData: OrderData) => {
  try {
    const { supabase } = await import('../lib/supabase');
    
    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name: orderData.customerName,
        phone: orderData.phone,
        address: orderData.address,
        comment: orderData.comment,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        total: orderData.total,
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    if (itemsError) throw itemsError;

  } catch (error) {
    console.error('Error logging order to database:', error);
    // Don't block the WhatsApp flow if database fails
  }
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} XAF`;
};