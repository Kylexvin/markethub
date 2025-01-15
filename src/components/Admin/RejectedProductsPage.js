import React from 'react';
import { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import RejectedProducts from './RejectedProducts';

const RejectedProductsPage = () => {
  return (
    <div className="admin-container">      
      <RejectedProducts />
    </div>
  );
};

export default RejectedProductsPage;