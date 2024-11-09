import React, { useState, useEffect } from 'react';
import './ApprovedProducts.css';

const ApprovedProducts = () => {
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch approved products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/products/approved', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setApprovedProducts(data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="approved-products">
      <h1>Approved Products</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="products-grid">
        {approvedProducts.length === 0 ? (
          <div className="empty-state">No approved products available</div>
        ) : (
          approvedProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={`http://localhost:5000/${product.image}`} alt={product.name} />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="price">${product.price.toLocaleString()}</p>
                <p className="description">{product.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovedProducts;
