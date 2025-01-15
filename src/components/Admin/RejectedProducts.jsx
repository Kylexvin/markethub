import React, { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';

const RejectedProducts = () => {
  const { rejectedProducts, handleReapprove, handleDelete } = useContext(AdminPanelContext);

  return (
    <div className="rejected-products" id="rejected-products">
      <h2>Rejected Products</h2>
      {rejectedProducts.length === 0 ? (
        <div className="empty-state">
          <p>No rejected products</p>
        </div>
      ) : (
        <div className="products-grid">
          {rejectedProducts.map((product) => (
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
                <button onClick={() => handleReapprove(product._id)} className="approve-btn">
                  <i className="fas fa-check"></i> Reapprove
                </button>
                <button onClick={() => handleDelete(product._id)} className="delete-btn">
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RejectedProducts;