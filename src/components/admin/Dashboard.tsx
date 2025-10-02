import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users,
  AlertTriangle,
  Download,
  Eye,
  Plus
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../utils/whatsapp';

interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  averageOrderValue: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    todayRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    averageOrderValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders stats
      const { data: orders } = await supabase
        .from('orders')
        .select('*');

      // Fetch products stats
      const { data: products } = await supabase
        .from('products')
        .select('*');

      // Fetch recent orders
      const { data: recent } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders?.filter(order => 
        order.created_at.startsWith(today)
      ) || [];

      const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;
      const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
      const lowStockProducts = products?.filter(product => product.stock < 5).length || 0;
      const averageOrderValue = orders?.length ? totalRevenue / orders.length : 0;

      setStats({
        totalRevenue,
        todayRevenue,
        totalOrders: orders?.length || 0,
        pendingOrders,
        totalProducts: products?.length || 0,
        lowStockProducts,
        averageOrderValue,
      });

      setRecentOrders(recent || []);
      
      // Mock top products for now
      setTopProducts(products?.slice(0, 5) || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'CA Total',
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'CA Aujourd\'hui',
      value: formatPrice(stats.todayRevenue),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Commandes',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'En attente',
      value: stats.pendingOrders.toString(),
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Produits',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      title: 'Stock faible',
      value: stats.lowStockProducts.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Vue d'ensemble de votre boutique</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
          <button className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">Exporter</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-pink-700 transition-all">
            <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">Nouveau produit</span>
            <span className="sm:hidden">Nouveau</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 truncate" title={stat.value}>{stat.value}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {stats.lowStockProducts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm sm:text-base text-red-700 font-medium">
              {stats.lowStockProducts} produit(s) en rupture de stock
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Commandes récentes</h3>
          </div>
          <div className="p-4 sm:p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{order.customer_name}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{order.phone}</p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="text-sm sm:text-base font-semibold text-gray-900">{formatPrice(order.total)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-gray-500 text-center py-6 sm:py-8">Aucune commande récente</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Produits populaires</h3>
          </div>
          <div className="p-4 sm:p-6">
            {topProducts.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 sm:space-x-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{formatPrice(product.price)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-gray-500 text-center py-6 sm:py-8">Aucun produit</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;