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
        const response = await fetch(`https://markethubbackend.onrender.com/api/admin/products/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.ok) {
            // Update the state to remove the deleted product
            setRejectedProducts(prevState => prevState.filter(product => product._id !== productId));
            // Optional: re-fetch the list of rejected products from the server
            fetchRejectedProducts(); // Implement fetchRejectedProducts to update the full list.
        } else {
            console.error('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
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
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: 'admin' } : user
      ));
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

      <div className="summary-container">
        <div className="summary-item">
          <h3><i className="fas fa-user"></i> Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="summary-item">
          <h3><i className="fas fa-clock"></i> Pending Products</h3>
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

      <div className="product-approval">
        <h2>Pending Product Approvals</h2>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products pending approval</p>
          </div>
        ) : (
          <div className="products-gridd">
            {products.map((product) => (
              <div key={product._id} className="product-cardd">
                <div className="product-image">
                  <img
                    src={`https://markethubbackend.onrender.com/${product.image}`}
                    alt={product.name}
                  />
                </div>
                <div className="product-detailss">
                  <h3>{product.name}</h3>
                  <p className="pricee">
                    ${product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="descriptionn">{product.description}</p>
                  <p className="whatsapp-number">
                    WhatsApp: {product.sellerWhatsApp}
                  </p>
                </div>
                <div className="product-actions">
                  <button 
                    onClick={() => handleApprove(product._id)}
                    className="approve-btn"
                  >
                  <i className="fas fa-check"></i>  Approve
                  </button>
                  <button 
                    onClick={() => handleReject(product._id)}
                    className="reject-btn"
                  >
                  <i className="fas fa-times"></i>  Reject
                  </button>
                  <div className="contact-seller">
                    <a 
                      href={`https://wa.me/${product.sellerWhatsApp}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="contact-seller-btn"
                    >
                     <i className="fab fa-whatsapp"></i>   Contact Seller
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="approved-products">
        <h2>Approved Products</h2>

        {approvedProducts.length === 0 ? (
          <div className="empty-state">
            <p>No approved products available</p>
          </div>
        ) : (
          <div className="products-grid">
            {approvedProducts.map((product) => (
              <div key={product._id} className="product-cardd">
                <div className="product-image">
                  <img
                    src={`https://markethubbackend.onrender.com/${product.image}`}
                    alt={product.name}
                  />
                </div>
                <div className="product-detailss">
                  <h3>{product.name}</h3>
                  <p className="pricee">
                    ${product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="descriptionn">{product.description}</p>
                </div>
                <div className="product-actions">
                  <button 
                    onClick={() => handleReject(product._id)}
                    className="reject-btn"
                  >
                   <i className="fas fa-times"></i>  Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rejected-products">
        <h2>Rejected Products</h2>

        {rejectedProducts.length === 0 ? (
          <div className="empty-state">
            <p>No rejected products</p>
          </div>
        ) : (
          <div className="products-grid">
            {rejectedProducts.map((product) => (
              <div key={product._id} className="product-cardd">
                <div className="product-image">
                  <img
                    src={`https://markethubbackend.onrender.com/${product.image}`}
                    alt={product.name}
                  />
                </div>
                <div className="product-detailss">
                  <h3>{product.name}</h3>
                  <p className="pricee">
                    ${product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="descriptionn">{product.description}</p>
                </div>
                <div className="product-actions">
                  <button 
                    onClick={() => handleReapprove(product._id)}
                    className="approve-btn"
                  >
                    <i className="fas fa-check"></i> Reapprove
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="delete-btn"
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="user-management">
        <h2>Manage Users</h2>

        {currentUsers.length === 0 ? (
          <div className="empty-state">
            <p>No users to manage</p>
          </div>
        ) : (
          <div className="users-grid">
            {currentUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-details">
                  <h3>{user.username}</h3>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                </div>
                <div className="user-actions">
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => handleGrantAdmin(user._id)} 
                      className="grant-admin-btn"
                    >
                     <i className="fas fa-user-shield"></i>  Grant Admin
                    </button>
                  )}
                  <button 
                    onClick={() => handleBanUser(user._id)} 
                    className="ban-btn"
                  >
                  <i className="fas fa-ban"></i> Ban
                  </button>
                  <button 
                    onClick={() => handleRemoveUser(user._id)} 
                    className="remove-btn"
                  >
                  <i className="fas fa-trash-alt"></i>  Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pagination">
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
            <button 
              key={index} 
              onClick={() => paginate(index + 1)} 
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;