import React from 'react';
import { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import AdminSummary from './AdminSummary';
import PendingProducts from './PendingProducts';
import ApprovedProducts from './ApprovedProducts';
import RejectedProducts from './RejectedProducts';
import UserManagement from './UserManagement';

const AdminPage = () => {
  const { loading, error } = useContext(AdminPanelContext);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage Products and Users</p>
      </div>
      <AdminSummary />
      <div className="admin-content">
        <nav className="admin-nav">
          <ul>
            <li><a href="#pending-products">Pending Products</a></li>
            <li><a href="#approved-products">Approved Products</a></li>
            <li><a href="#rejected-products">Rejected Products</a></li>
            <li><a href="#user-management">User Management</a></li>
          </ul>
        </nav>
        <main className="admin-main">
          <PendingProducts />
          <ApprovedProducts />
          <RejectedProducts />
          <UserManagement />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;