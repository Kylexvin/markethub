import React from 'react';
import { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import RejectedProducts from './RejectedProducts';

const RejectedProductsPage = () => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Rejected Products</h1>
      </div>
      <RejectedProducts />
    </div>
  );
};

export default RejectedProductsPage;