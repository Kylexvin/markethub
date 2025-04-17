import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Package, MessageCircle, Send, User, Edit, LogOut, AlertTriangle, PlusCircle } from 'lucide-react';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const adminWhatsApp = "254745276898"; 
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState(null);  
  const [profileFormData, setProfileFormData] = useState({
    username: '',
    email: '',
    phone: '',
    oldPassword: '',
    newPassword: ''
  });

  
  useEffect(() => {
    fetchProfile();
  }, []); // Fetch profile once when component mounts
  

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

  // Handle profile form data changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prevData => ({ ...prevData, [name]: value }));
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

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://markethubbackend.onrender.com/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setProfile(response.data.user);
      setProfileFormData({
        username: response.data.user.username,
        email: response.data.user.email,
        phone: response.data.user.phone
      });
      setUsername(response.data.user.username);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showAlert('Failed to load your profile');
    }
  };

  // Update user profile
  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('https://markethubbackend.onrender.com/api/auth/update', profileFormData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      showAlert('Profile updated successfully');
      setIsEditingProfile(false);
      fetchProfile(); // Refresh profile data
      localStorage.setItem('username', profileFormData.username);
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert(error.response?.data?.message || 'Error updating profile');
    }
  };

  // Delete user account
  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('https://markethubbackend.onrender.com/api/auth/delete', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      showAlert('Account deleted successfully');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      // Redirect to login page after account deletion
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Error deleting account:', error);
      showAlert(error.response?.data?.message || 'Error deleting account');
      setShowDeleteConfirm(false);
    }
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
      const response = await axios.get('https://markethubbackend.onrender.com/api/products/seller', {
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
      const response = await axios.delete(`http://localhost:5000/api/products/delete/${productId}`, {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchProducts();
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      {/* Notification Toast */}
      {showNotification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          notificationMessage.includes('Error') ? 'bg-red-500' : 'bg-green-500'
        } text-white`}>
          {notificationMessage}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-bold">Delete Account</h3>
            </div>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={deleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[#d0f2e3] p-6 rounded-xl shadow-lg shadow-[#1c503a] mb-6">
  <h1 className="text-3xl font-bold text-[#1c503a] mb-2">Niaje {username}!</h1>
  <p className="text-gray-600">Manage your second hands marketplace items with ease.</p>
</div>


        <div className="relative">
  {/* Navigation Tabs */}
  <div className="flex overflow-x-auto no-scrollbar space-x-2 mb-6 bg-white rounded-t-lg shadow-sm px-2 py-2 sm:justify-start">
    {[
       { key: 'manage', label: 'Manage', icon: <Package className="w-5 h-5" /> },
      { key: 'upload', label: 'Upload', icon: <PlusCircle className="w-5 h-5" /> },
     
      { key: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
      { key: 'contact', label: 'Contact', icon: <MessageCircle className="w-5 h-5" /> }
    ].map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`flex items-center px-3 sm:px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${
          activeTab === tab.key
            ? 'bg-[#1c503a] text-white'
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
        }`}
      >
        {tab.icon}
        <span
          className={`ml-2 ${
            activeTab === tab.key ? 'inline' : 'hidden sm:inline'
          }`}
        >
          {tab.label}
        </span>
      </button>
    ))}
  </div>

  {/* Floating Logout Button on Mobile */}
  <button
    onClick={handleLogout}
    className="fixed bottom-4 right-4 sm:hidden bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 hover:bg-red-600 transition-all"
  >
    <LogOut className="w-5 h-5" />
    <span>Logout</span>
  </button>

  {/* Static Logout Button for Desktop */}
  <div className="hidden sm:flex justify-end pr-4 mb-4">
    <button
      onClick={handleLogout}
      className="px-4 py-2 font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center"
    >
      <LogOut className="w-5 h-5 mr-2" />
      Logout
    </button>
  </div>
        </div>

        {/* Manage Products */}
        {activeTab === 'manage' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Manage Your Products</h2>
            {loading ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading your products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="bg-gray-100 h-40 mb-3 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
                    <p className="text-blue-600 font-medium mb-3">Ksh {product.price}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.approvalStatus === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.approvalStatus}
                      </span>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">No products yet</h3>
                <p className="text-gray-500 mb-4">Add your first product to start selling!</p>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="bg-[#1c503a] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Upload Product
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upload Product Form */}
        {activeTab === 'upload' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Upload New Product</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Ksh)</label>
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
                <p className="text-xs text-gray-500 mt-1">Max file size: 3MB</p>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-[#1c503a] text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors disabled:from-blue-300 disabled:to-indigo-400"
              >
                {isUploading ? 'Uploading...' : 'Upload Product'}
              </button>
            </form>
          </div>
        )}



        {/* Profile Section */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Your Profile
            </h2>
            
            {profile ? (
  <>
    {!isEditingProfile ? (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-800">{profile.username}</h3>
              <p className="text-indigo-500 font-medium capitalize">{profile.role}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
           
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-start">
            <div className="w-24 text-gray-500 font-medium">Email:</div>
            <div className="flex-1 text-gray-800">{profile.email}</div>
          </div>
          <div className="flex items-start">
            <div className="w-24 text-gray-500 font-medium">Phone:</div>
            <div className="flex-1 text-gray-800">{profile.phone || 'Not provided'}</div>
          </div>
          <div className="flex items-start">
            <div className="w-24 text-gray-500 font-medium">Joined:</div>
            <div className="flex-1 text-gray-800">
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete Account
          </button>
        </div>
      </div>
    ) : (
      <form onSubmit={updateProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={profileFormData.username}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={profileFormData.email}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={profileFormData.phone}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Optional: Old password field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={profileFormData.oldPassword || ''}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Optional: New password field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={profileFormData.newPassword || ''}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEditingProfile(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    )}
  </>
) : (
  <div className="text-center py-10">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    <p>Loading your profile...</p>
  </div>
)}

          </div>
        )}

        {/* WhatsApp Contact Admin */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-lg mx-auto">
            {/* Admin Header */}
            <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 text-white flex items-center rounded-t-lg">
              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mr-4 border-2 border-white">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
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

              {/* Message Input */}
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
            <div className="p-4 bg-gray-50 border-t">
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