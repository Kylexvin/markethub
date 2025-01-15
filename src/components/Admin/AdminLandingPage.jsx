import React from 'react';
import { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import AdminSummary from './AdminSummary';

const AdminLandingPage = () => {
  const { products, approvedProducts, rejectedProducts, users, deleteAllRejected } = useContext(AdminPanelContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8 border-b border-gray-200 bg-white">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        
      </div>
      <AdminSummary />
    </div>
  );
};

export default AdminLandingPage;