import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://markethubbackend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Update the role assignment
        localStorage.setItem('role', data.user.role); // Ensure this line is using data.user.role
        console.log('Stored role in local storage:', localStorage.getItem('role'));

        setMessage(`Welcome back, ${data.user.username}!`);

        const userRole = data.user.role; // Ensure you are fetching the role correctly
        const redirectPath = userRole === 'admin' ? '/admin' : '/seller-dashboard';
        console.log('Redirecting to:', redirectPath); // Log the redirect path

        navigate(redirectPath); // Direct navigation
      } else {
        console.error('Login error:', data.error);
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Request error:', error);
      setMessage('Error connecting to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign In</h1>
          <p>Access your account by logging in below</p>
        </div>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
              disabled={loading}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={handleChange}
                value={formData.password}
                disabled={loading}
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Sign In'}
          </button>

          <div className="welcome-back">
            <p className="switch-auth">
              Don’t have an account?{' '}
              <Link to="/register">Sign up</Link>{' '}
              to create a new account and start your journey with us.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
