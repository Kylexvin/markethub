import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanelContext = createContext();

const AdminPanelProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch('https://markethubbackend.onrender.com/api/admin/products/pending', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const approvedProductResponse = await fetch('https://markethubbackend.onrender.com/api/admin/products/approved', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const rejectedProductResponse = await fetch('https://markethubbackend.onrender.com/api/admin/products/rejected', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const userResponse = await fetch('https://markethubbackend.onrender.com/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const productData = await productResponse.json();
        const approvedProductData = await approvedProductResponse.json();
        const rejectedProductData = await rejectedProductResponse.json();
        const userData = await userResponse.json();

        setProducts(productData);
        setApprovedProducts(approvedProductData);
        setRejectedProducts(rejectedProductData);
        setUsers(userData);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteAllRejected = async () => {
    try {
      await fetch('https://markethubbackend.onrender.com/api/admin/products/rejected', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setRejectedProducts([]);
      setProducts(products.filter(product => product.status !== 'rejected'));
    } catch (err) {
      console.error('Failed to delete rejected products:', err);
    }
  };

  const handleApprove = async (productId) => {
    try {
      await fetch(`https://markethubbackend.onrender.com/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvalStatus: 'approved' }),
      });
      setProducts(products.filter((product) => product._id !== productId));
    } catch (err) {
      setError('Failed to approve product. Please try again.');
    }
  };

  const handleReject = async (productId) => {
    try {
      await fetch(`https://markethubbackend.onrender.com/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvalStatus: 'rejected' }),
      });
      const rejectedProduct = approvedProducts.find(p => p._id === productId);
      if (rejectedProduct) {
        setRejectedProducts([...rejectedProducts, rejectedProduct]);
        setApprovedProducts(approvedProducts.filter((product) => product._id !== productId));
      }
    } catch (err) {
      setError('Failed to reject product. Please try again.');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await fetch(`https://markethubbackend.onrender.com/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRejectedProducts(rejectedProducts.filter((product) => product._id !== productId));
    } catch (err) {
      setError('Failed to delete product. Please try again.');
    }
  };

  const handleReapprove = async (productId) => {
    try {
      await fetch(`https://markethubbackend.onrender.com/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvalStatus: 'approved' }),
      });
      const reapprovedProduct = rejectedProducts.find(p => p._id === productId);
      if (reapprovedProduct) {
        setApprovedProducts([...approvedProducts, reapprovedProduct]);
        setRejectedProducts(rejectedProducts.filter((product) => product._id !== productId));
      }
    } catch (err) {
      setError('Failed to reapprove product. Please try again.');
    }
  };

  const handleGrantAdmin = async (userId) => {
    try {
      await fetch(`https://markethubbackend.onrender.com/api/admin/users/${userId}/grant-admin`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(users.map(user => user._id === userId ? { ...user, role: 'admin' } : user));
    } catch (err) {
      setError('Failed to grant admin role. Please try again.');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await fetch(`https://markethubbackend.onrender.com/api/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError('Failed to ban user. Please try again.');
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      await fetch(`https://markethubbackend.onrender.com/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError('Failed to remove user. Please try again.');
    }
  };

  return (
    <AdminPanelContext.Provider
      value={{
        products,
        approvedProducts,
        rejectedProducts,
        users,
        error,
        loading,
        deleteAllRejected,
        handleApprove,
        handleReject,
        handleDelete,
        handleReapprove,
        handleGrantAdmin,
        handleBanUser,
        handleRemoveUser,
      }}
    >
      {children}
    </AdminPanelContext.Provider>
  );
};

export { AdminPanelContext, AdminPanelProvider };