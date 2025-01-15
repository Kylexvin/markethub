import React, { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';

const ApprovedProducts = () => {
  const { approvedProducts, handleReject } = useContext(AdminPanelContext);

  return (
    <div className="approved-products" id="approved-products">
      <h2>Approved Products</h2>
      {approvedProducts.length === 0 ? (
        <div className="empty-state">
          <p>No approved products</p>
        </div>
      ) : (
        <div className="products-grid">
          {approvedProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
                <p className="description">{product.description}</p>
              </div>
              <div className="product-actions">
                <button onClick={() => handleReject(product._id)} className="reject-btn">
                  <i className="fas fa-times"></i> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedProducts;