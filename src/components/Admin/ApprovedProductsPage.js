import React from 'react';
import { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import ApprovedProducts from './ApprovedProducts';

const ApprovedProductsPage = () => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Approved Products</h1>
      </div>
      <ApprovedProducts />
    </div>
  );
};

export default ApprovedProductsPage;