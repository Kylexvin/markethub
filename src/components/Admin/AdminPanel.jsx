import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const navigate = useNavigate();

  // Fetch pending, approved, and rejected products and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch('http://localhost:5000/api/admin/products/pending', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const approvedProductResponse = await fetch('http://localhost:5000/api/admin/products/approved', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const rejectedProductResponse = await fetch('http://localhost:5000/api/admin/products/rejected', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const userResponse = await fetch('http://localhost:5000/api/admin/users', {
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

  // Product Approval Functions
  const handleApprove = async (productId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
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
      await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvalStatus: 'rejected' }),
      });
      setProducts(products.filter((product) => product._id !== productId));
      setRejectedProducts([...rejectedProducts, products.find(product => product._id === productId)]);
    } catch (err) {
      setError('Failed to reject product. Please try again.');
    }
  };

  const handleDeleteRejectedProduct = async (productId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
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

  // User Management Functions
  const handleGrantAdmin = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/users/${userId}/grant-admin`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: 'admin' } : user
      ));
    } catch (err) {
      setError('Failed to grant admin role. Please try again.');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/users/${userId}/ban`, {
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
      await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
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

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage Products and Users</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Summary Information */}
      <div className="summary-container">
        <div className="summary-item">
          <h3><i className="fas fa-user"></i> Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="summary-item">
          <h3>Pending Products</h3>
          <p>{products.length}</p>
        </div>
        <div className="summary-item">
          <h3>Approved Products</h3>
          <p>{approvedProducts.length}</p>
        </div>
        <div className="summary-item">
          <h3>Rejected Products</h3>
          <p>{rejectedProducts.length}</p>
        </div>
      </div>

      {/* Product Approval Section */}
      <div className="product-approval">
        <h2>Pending Product Approvals</h2>
        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products pending approval</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt={product.name}
                  />
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="price">
                    ${product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="description">{product.description}</p>
                  <p className="whatsapp-number">WhatsApp: {product.sellerWhatsApp}</p>
                </div>
                <div className="product-actions">
                  <button onClick={() => handleApprove(product._id)} className="approve-btn">
                    <i className="fas fa-check"></i> Approve
                  </button>
                  <button onClick={() => handleReject(product._id)} className="reject-btn">
                    <i className="fas fa-times"></i> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Products Section */}
      <div className="approved-products">
        <h2>Approved Products</h2>
        {approvedProducts.length === 0 ? (
          <div className="empty-state">
            <p>No approved products available</p>
          </div>
        ) : (
          <div className="products-grid">
            {approvedProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt={product.name}
                  />
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="price">
                    ${product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="description">{product.description}</p>
                  <p className="whatsapp-number">WhatsApp: {product.sellerWhatsApp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejected Products Section */}
      <div className="rejected-products">
        <h2>Rejected Products</h2>
        {rejectedProducts.length === 0 ? (
          <div className="empty-state">
            <p>No rejected products available</p>
          </div>
        ) : (
          <div className="products-grid">
            {rejectedProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt={product.name}
                  />
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="price">
                    ${product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="description">{product.description}</p>
                  <p className="whatsapp-number">WhatsApp: {product.sellerWhatsApp}</p>
                </div>
                <div className="product-actions">
                  <button
                    onClick={() => handleDeleteRejectedProduct(product._id)}
                    className="delete-btn"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Management Section */}
      <div className="user-management">
        <h2>Manage Users</h2>
        {users.length === 0 ? (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        ) : (
          <div className="users-list">
            {currentUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-details">
                  <p><strong>{user.username}</strong></p>
                  <p>{user.email}</p>
                  <p>{user.role}</p>
                </div>
                <div className="user-actions">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleGrantAdmin(user._id)}
                      className="grant-admin-btn"
                    >
                      Grant Admin
                    </button>
                  )}
                  <button
                    onClick={() => handleBanUser(user._id)}
                    className="ban-user-btn"
                  >
                    Ban User
                  </button>
                  <button
                    onClick={() => handleRemoveUser(user._id)}
                    className="remove-user-btn"
                  >
                    Remove User
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </button>
          <span>Page {currentPage}</span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage * usersPerPage >= users.length}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
