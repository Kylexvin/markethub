import React, { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import { CheckCircle, Trash2 } from 'lucide-react';

const RejectedProducts = () => {
  const { rejectedProducts, handleReapprove, handleDelete } = useContext(AdminPanelContext);

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Rejected Products</h2>
      
      {rejectedProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 text-lg">No rejected products</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rejectedProducts.map((product) => (
            <div 
              key={product._id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-lg font-medium text-blue-600 mb-2">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReapprove(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Reapprove</span>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RejectedProducts;