import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SellerDashboard from './components/User/SellerDashboard';
import AdminPanel from './components/Admin/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Use ProtectedRoute for Seller Dashboard */}
        <Route path="/seller-dashboard" element={
          <ProtectedRoute>
            <SellerDashboard />
          </ProtectedRoute>
        } />

        {/* Use ProtectedRoute for Admin Panel and Product Approval */}
        <Route path="/admin" element={
          <ProtectedRoute isAdmin>
            <AdminPanel />
          </ProtectedRoute>
        } />

       
      </Routes>
    </div>
  );
}

export default App;