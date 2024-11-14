import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './seller.css';
import Footer from '../Footer';

function SellerDashboard() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // Uploading state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const username = localStorage.getItem('username');

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
      setResponseMessage('File size should not exceed 3MB');
      setFormData(prevData => ({ ...prevData, image: null }));
      return;
    }

    setFormData(prevData => ({ ...prevData, image: file }));
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
      setIsUploading(true); // Start uploading indicator
      setResponseMessage('');

      // Send the product upload request with the token
      const token = localStorage.getItem('token');
      const response = await axios.post('https://markethubbackend.onrender.com/api/products/upload', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setResponseMessage(response.data.message);

      // Clear form after successful upload
      setFormData({
        name: '',
        price: '',
        description: '',
        image: null
      });

      // Fetch updated products after upload
      fetchProducts();
    } catch (error) {
      setResponseMessage(error.response?.data?.message || 'Error uploading product');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false); // Stop uploading indicator
    }
  };

  // Fetch products on component mount
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

  // Delete product function in frontend
  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`https://markethubbackend.onrender.com/api/products/delete/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setResponseMessage(response.data.message);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setResponseMessage(error.response?.data?.message || 'Error deleting product');
    }
  };

  // Run fetchProducts when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
    <div className="seller-dashboard">
      <div className="dashboard-header">
       <h1 className="dashboard-title">Welcome To Seller's Dashboard!{/* Display username here just as we fetch sellers */}</h1>
       
       <button
         className={`upload-btn ${showUploadForm ? 'btn-close' : 'btn-open'}`}
         onClick={() => setShowUploadForm(!showUploadForm)}
       >
         {showUploadForm ? (
           <>
             Close <i className="fas fa-chevron-up"></i>
           </>
         ) : (
           <>
             Upload Product <i className="fas fa-chevron-down"></i>
           </>
         )}
       </button>
      </div>

      {showUploadForm && (
        <div className="upload-form-container">
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Product Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">Price:</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image" className="form-label">Product Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Product'}
            </button>
          </form>
        </div>
      )}

      {responseMessage && (
        <div className={`message ${responseMessage.includes('Error') ? 'error' : 'success'}`}>
          {responseMessage}
        </div>
      )}

      <div className="products-list">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          products.length > 0 ? (
            products.map((product) => (
              <div className="product-card" key={product._id}>
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: Ksh {product.price}</p>
                <p className="product-status">Status: {product.approvalStatus}</p>
                <button className="btn btn-danger" onClick={() => deleteProduct(product._id)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default SellerDashboard;
