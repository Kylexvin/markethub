import React from 'react';
import { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import ApprovedProducts from './ApprovedProducts';

const ApprovedProductsPage = () => {
  return (
    <div className="admin-container">    
      <ApprovedProducts />
    </div>
  );
};

export default ApprovedProductsPage;