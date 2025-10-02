import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  MessageCircle, 
  Download,
  Calendar,
  Phone,
  MapPin,
  Package,
  Clock
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../utils/whatsapp';
import { Order, OrderItem } from '../../types';

const OrdersAdmin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmée' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annulée' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        order.id.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            name,
            image_url
          )
        `)
        .eq('order_id', order.id);

      if (error) throw error;
      setOrderItems(data || []);
    } catch (error) {
      console.error('Error fetching order items:', error);
      setOrderItems([]);
    }
    
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Client', 'Téléphone', 'Total', 'Statut', 'Date'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.customer_name,
        order.phone,
        order.total,
        order.status,
        new Date(order.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sendWhatsAppMessage = (order: Order) => {
    const message = `Bonjour ${order.customer_name}, votre commande #${order.id.slice(0, 8)} a été confirmée ! Nous vous livrerons à l'adresse : ${order.address}. Merci de votre confiance ! - Parfait Beauty`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${order.phone.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Gérez toutes les commandes de votre boutique</p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 mt-4 sm:mt-0 transition-colors"
        >
          <Download className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="hidden sm:inline">Exporter CSV</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          {filteredOrders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          #{order.id.slice(0, 8)}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmée</option>
                          <option value="delivered">Livrée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </div>
                      <p className="font-medium text-gray-900 truncate">{order.customer_name}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{order.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => sendWhatsAppMessage(order)}
                          className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors"
                          title="Contacter via WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande trouvée</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer_name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center truncate">
                        <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{order.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => sendWhatsAppMessage(order)}
                        className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                        title="Contacter via WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande trouvée</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Détails de la commande #{selectedOrder.id.slice(0, 8)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Informations client</h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-700 w-16 sm:w-20 flex-shrink-0">Nom:</span>
                      <span className="text-sm text-gray-900 break-words">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-900 break-all">{selectedOrder.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-900 break-words">{selectedOrder.address}</span>
                    </div>
                    {selectedOrder.comment && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-700">Commentaire:</span>
                        <p className="text-sm text-gray-900 mt-1 break-words">{selectedOrder.comment}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Informations commande</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sous-total:</span>
                      <span className="text-sm text-gray-900">{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Livraison:</span>
                      <span className="text-sm text-gray-900">{formatPrice(selectedOrder.delivery_fee)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm sm:text-base font-semibold border-t border-gray-200 pt-2">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">{formatPrice(selectedOrder.total)}</span>
                    </div>
                    <div className="flex items-center mt-3">
                      <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        {new Date(selectedOrder.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Produits commandés</h4>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.products?.image_url || '/placeholder.jpg'}
                        alt={item.products?.name || 'Produit'}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {item.products?.name || 'Produit supprimé'}
                        </h5>
                        <p className="text-sm text-gray-600">
                          Quantité: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => sendWhatsAppMessage(selectedOrder)}
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  Contacter client
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;