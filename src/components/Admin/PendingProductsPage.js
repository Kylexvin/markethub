import React from 'react';
import { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import PendingProducts from './PendingProducts';

const PendingProductsPage = () => {
  return (
    <div className="admin-container">     
      <PendingProducts />
    </div>
  );
};

export default PendingProductsPage;