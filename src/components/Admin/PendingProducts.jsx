import React, { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import './PendingProducts.css'; // Import the CSS file

const PendingProducts = () => {
  const { products, handleApprove, handleReject } = useContext(AdminPanelContext);

  return (
    <div className="product-approval" id="pending-products">
      <h2>Pending Product Approvals</h2>
      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products pending approval</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
                <p className="description">{product.description}</p>
                <p className="description">WhatsApp: {product.sellerWhatsApp}</p>
              </div>
              <div className="product-actions">
                <button onClick={() => handleApprove(product._id)} className="approve-btn">
                  <i className="fas fa-check"></i> Approve
                </button>
                <button onClick={() => handleReject(product._id)} className="reject-btn">
                  <i className="fas fa-times"></i> Reject
                </button>
                <div className="contact-seller">
                  <a href={`https://wa.me/${product.sellerWhatsApp}`} target="_blank" rel="noopener noreferrer" className="contact-seller-btn">
                    <i className="fab fa-whatsapp"></i> Contact Seller
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingProducts;