import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CreditCard as Edit, Trash2, Eye, Upload, X, Save, AlertTriangle } from 'lucide-react';
import { supabase, uploadProductImage, deleteProductImage } from '../../lib/supabase';
import { formatPrice } from '../../utils/whatsapp';
import { Product } from '../../types';

const ProductsAdmin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'cheveux' as const,
    image_url: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'cheveux', label: 'Cheveux' },
    { id: 'visage', label: 'Visage' },
    { id: 'compléments', label: 'Compléments' },
    { id: 'soins', label: 'Soins' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'cheveux',
      image_url: ''
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      image_url: product.image_url
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      return;
    }

    try {
      // Delete image if it exists
      if (product.image_url) {
        await deleteProductImage(product.image_url);
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (imageFile) {
        const productId = editingProduct?.id || crypto.randomUUID();
        imageUrl = await uploadProductImage(imageFile, productId);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
      }

      await fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erreur lors de la sauvegarde du produit');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Gérez votre catalogue de produits</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-pink-700 mt-4 sm:mt-0 transition-all"
        >
          <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="hidden sm:inline">Ajouter un produit</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block sm:hidden">
          {filteredProducts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.stock < 5 
                            ? 'bg-red-100 text-red-800' 
                            : product.stock < 10 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          Stock: {product.stock}
                          {product.stock < 5 && <AlertTriangle className="h-3 w-3 ml-1" />}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-800">
                          {product.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun produit trouvé</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="ml-3 sm:ml-4 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 max-w-xs truncate">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock < 5 
                        ? 'bg-red-100 text-red-800' 
                        : product.stock < 10 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock}
                      {product.stock < 5 && <AlertTriangle className="h-3 w-3 ml-1" />}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (XAF) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="cheveux">Cheveux</option>
                  <option value="visage">Visage</option>
                  <option value="compléments">Compléments</option>
                  <option value="soins">Soins</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image du produit
                </label>
                <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-pink-300 transition-colors">
                  <div className="space-y-1 text-center">
                    {formData.image_url && !imageFile && (
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="mx-auto h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-lg mb-4"
                      />
                    )}
                    <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                    <div className="flex text-xs sm:text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500">
                        <span className="px-2">Télécharger une image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 transition-all"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 flex-shrink-0"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2 flex-shrink-0" />
                      {editingProduct ? 'Modifier' : 'Ajouter'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;