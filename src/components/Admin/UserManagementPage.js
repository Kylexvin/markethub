import React from 'react';
import { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import UserManagement from './UserManagement';

const UserManagementPage = () => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        
      </div>
      <UserManagement />
    </div>
  );
};

export default UserManagementPage;