import React, { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import { Check, X, Phone, Package2, MessageCircle } from 'lucide-react';

const PendingProducts = () => {
  const { products, handleApprove, handleReject } = useContext(AdminPanelContext);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Simplified Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Pending Products</h2>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No products pending approval</p>
          <p className="text-gray-500 text-sm mt-2">New submissions will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Product Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                    Pending
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                </div>

                {/* Seller Contact */}
                <div className="flex items-center space-x-2 mb-6 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{product.sellerWhatsApp}</span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleApprove(product._id)}
                    className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(product._id)}
                    className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>

                {/* WhatsApp Contact */}
                <a
                  href={`https://wa.me/${product.sellerWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center w-full px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Seller
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingProducts;