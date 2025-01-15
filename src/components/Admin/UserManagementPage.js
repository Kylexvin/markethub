import React from 'react';
import { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import UserManagement from './UserManagement';

const UserManagementPage = () => {
  return (
    <div className="admin-container">     
      <UserManagement />
    </div>
  );
};

export default UserManagementPage;