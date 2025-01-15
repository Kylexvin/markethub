import React, { useContext, useState } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import { X, Package2, Search, ArrowUpDown, ShoppingBag, Star, Eye } from 'lucide-react';

const ApprovedProducts = () => {
  const { approvedProducts, handleReject } = useContext(AdminPanelContext);
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const sortProducts = (products) => {
    switch (sortBy) {
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  };

  const filteredProducts = sortProducts(approvedProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Search and Sort */}
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Approved Products</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="name">Name</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Products Display */}
      {approvedProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No approved products yet</p>
          <p className="text-gray-500 text-sm mt-2">Approved products will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product._id}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Product Image with Overlay */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <button
                      className="px-3 py-2 bg-white/90 rounded-lg text-sm font-medium hover:bg-white transition-colors duration-200 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Quick View
                    </button>
                    <button
                      onClick={() => handleReject(product._id)}
                      className="p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-500 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    Approved
                  </span>
                </div>
                
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-600">4.5</span>
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedProducts;