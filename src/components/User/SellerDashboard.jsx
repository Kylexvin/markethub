import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Package, MessageCircle, Send } from 'lucide-react';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const username = localStorage.getItem('username'); 
  const adminWhatsApp = "254745276898"; 
  const [message, setMessage] = useState('');

  // Product state management
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null
  });

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handle file input change (image upload)
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Check if file size exceeds 3MB
    if (file && file.size > 3 * 1024 * 1024) {
      showAlert('File size should not exceed 3MB');
      setFormData(prevData => ({ ...prevData, image: null }));
      return;
    }

    setFormData(prevData => ({ ...prevData, image: file }));
  };

  const showAlert = (msg) => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data for file upload
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      setIsUploading(true);
      setNotificationMessage('');

      const token = localStorage.getItem('token');
      const response = await axios.post('https://markethubbackend.onrender.com/api/products/upload', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      showAlert(response.data.message);

      // Clear form after successful upload
      setFormData({
        name: '',
        price: '',
        description: '',
        image: null
      });

      // Fetch updated products
      fetchProducts();
    } catch (error) {
      showAlert(error.response?.data?.message || 'Error uploading product');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://markethubbackend.onrender.com/api/seller/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`https://markethubbackend.onrender.com/api/products/delete/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      showAlert(response.data.message);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showAlert(error.response?.data?.message || 'Error deleting product');
    }
  };

  const handleWhatsAppRedirect = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodedMessage}`, '_blank');
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notification Toast */}
      {showNotification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          notificationMessage.includes('Error') ? 'bg-red-500' : 'bg-green-500'
        } text-white`}>
          {notificationMessage}
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Niaje {username}!</h1>
        <p className="text-gray-600 mb-6">Manage your second hands.</p>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium rounded-t-lg ${
              activeTab === 'upload'
                ? 'bg-white border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <Package className="inline-block w-4 h-4 mr-2" />
            Upload Product
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 font-medium rounded-t-lg ${
              activeTab === 'manage'
                ? 'bg-white border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <Package className="inline-block w-4 h-4 mr-2" />
            Manage Products
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 font-medium rounded-t-lg ${
              activeTab === 'contact'
                ? 'bg-white border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <MessageCircle className="inline-block w-4 h-4 mr-2" />
            Contact Admin
          </button>
        </div>

        {/* Upload Product Form */}
        {activeTab === 'upload' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Upload New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {isUploading ? 'Uploading...' : 'Upload Product'}
              </button>
            </form>
          </div>
        )}

        {/* Manage Products */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-10">Loading products...</div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product._id} className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <p className="text-gray-800 font-medium mb-2">Ksh {product.price}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        product.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {product.approvalStatus}
                      </span>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-600">No products available.</div>
            )}
          </div>
        )}

        {/* WhatsApp Contact Admin */}
        {activeTab === 'contact' && (
  <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-lg mx-auto">
    {/* Admin Header */}
    <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 text-white flex items-center rounded-t-lg">
      <img
        src="kylex.png"
        alt="Admin"
        className="w-12 h-12 rounded-full mr-4 border-2 border-white"
      />
      <div>
        <h3 className="font-bold text-lg">Store Admin</h3>
        <p className="text-sm opacity-90">Usually responds within an hour</p>
      </div>
    </div>

    {/* Message Area */}
    <div className="bg-[#f7f7f7] p-6 flex flex-col space-y-6">
      {/* Welcome Message */}
      <div className="bg-white rounded-lg p-5 max-w-xs ml-auto mb-4 shadow-lg relative">
        <p className="text-base text-gray-700 font-medium">
          Welcome! Click the button below to contact admin via WhatsApp.
        </p>
        <span className="text-xs text-gray-500 mt-2 block">Moihub Support</span>
      </div>

      {/* Message Input and WhatsApp Button */}
      <div className="flex gap-4 items-center">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 placeholder-gray-500 resize-none transition-all"
          placeholder="Type your message here..."
          rows={3}
        />
      </div>

      {/* Send Button */}
      <div className="flex justify-end">
        <button
          onClick={handleWhatsAppRedirect}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors flex items-center gap-3"
        >
          <Send className="w-5 h-5" />
          Open WhatsApp
        </button>
      </div>
    </div>

    {/* Footer Message */}
    <div className="p-4 bg-gray-50 border-t rounded-b-lg">
      <p className="text-sm text-gray-600 text-center">
        You'll be redirected to WhatsApp to continue the conversation with admin.
      </p>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default SellerDashboard;