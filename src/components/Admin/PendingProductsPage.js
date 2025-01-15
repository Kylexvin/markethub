import React from 'react';
import { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import PendingProducts from './PendingProducts';

const PendingProductsPage = () => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Pending Product Approvals</h1>
      </div>
      <PendingProducts />
    </div>
  );
};

export default PendingProductsPage;