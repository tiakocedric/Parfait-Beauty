import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Heart,
  Search,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Show loading while checking auth
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Produits', href: '/admin/products', icon: Package },
    { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Clients', href: '/admin/customers', icon: Users },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 sm:w-80 lg:w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500 fill-current" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-pink-500 hidden sm:block">Parfait Beauty</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-4 sm:px-6 lg:px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center px-3 sm:px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:translate-x-1'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate hidden sm:block">
                {user.user_metadata?.full_name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate hidden sm:block">
                {user.email}
              </p>
              <p className="text-xs text-gray-500 truncate sm:hidden">
                Admin
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:translate-x-1"
          >
            <LogOut className="h-4 w-4 mr-3 flex-shrink-0" />
            <span className="hidden sm:inline">Déconnexion</span>
            <span className="sm:hidden">Sortir</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 min-h-screen">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-64 xl:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="sm:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;