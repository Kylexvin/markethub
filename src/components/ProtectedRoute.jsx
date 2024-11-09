import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin, children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Get the user's role from local storage

  // Check if the token exists and if the user is an admin if isAdmin is true
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && role !== 'admin') {
    return <Navigate to="/seller-dashboard" />; // Redirect to seller dashboard if not admin
  }

  return children; // Render the protected component
};

export default ProtectedRoute;
