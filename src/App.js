import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SellerDashboard from './components/User/SellerDashboard';
import AdminLandingPage from './components/Admin/AdminLandingPage';
import PendingProductsPage from './components/Admin/PendingProductsPage';
import ApprovedProductsPage from './components/Admin/ApprovedProductsPage';
import RejectedProductsPage from './components/Admin/RejectedProductsPage';
import UserManagementPage from './components/Admin/UserManagementPage';
import { AdminPanelProvider } from './components/Admin/AdminPanelProvider';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller-dashboard" element={
          <ProtectedRoute>
            <SellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute isAdmin>
            <AdminPanelProvider>
              <AdminLandingPage />
            </AdminPanelProvider>
          </ProtectedRoute>
        } />
        <Route path="/admin/pending-products" element={
          <ProtectedRoute isAdmin>
            <AdminPanelProvider>
              <PendingProductsPage />
            </AdminPanelProvider>
          </ProtectedRoute>
        } />
        <Route path="/admin/approved-products" element={
          <ProtectedRoute isAdmin>
            <AdminPanelProvider>
              <ApprovedProductsPage />
            </AdminPanelProvider>
          </ProtectedRoute>
        } />
        <Route path="/admin/rejected-products" element={
          <ProtectedRoute isAdmin>
            <AdminPanelProvider>
              <RejectedProductsPage />
            </AdminPanelProvider>
          </ProtectedRoute>
        } />
        <Route path="/admin/user-management" element={
          <ProtectedRoute isAdmin>
            <AdminPanelProvider>
              <UserManagementPage />
            </AdminPanelProvider>
          </ProtectedRoute>
        } />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;