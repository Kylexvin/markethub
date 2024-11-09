import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGrantAdmin = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/users/${userId}/grant-admin`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(users.map(user => (user._id === userId ? { ...user, role: 'admin' } : user)));
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <h1>User Management</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="user-list">
        {users.length === 0 ? (
          <div className="empty-state">No users available</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="user-card">
              <p>{user.username}</p>
              <p>{user.email}</p>
              <div className="user-actions">
                {user.role !== 'admin' && (
                  <button onClick={() => handleGrantAdmin(user._id)}>Grant Admin</button>
                )}
                <button onClick={() => handleBanUser(user._id)}>Ban</button>
                <button onClick={() => handleRemoveUser(user._id)}>Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserManagement;
