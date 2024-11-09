import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
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
  if (typeof window !== "undefined") {
    const resizeObserverLoopErr = () => {};
    window.addEventListener("error", (e) => {
      if (e.message === "ResizeObserver loop limit exceeded") {
        e.stopImmediatePropagation();
        resizeObserverLoopErr();
      }
    });
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Registration successful! Welcome, ${formData.username}. You can now log in.`);
        setFormData({ username: '', phone: '', email: '', password: '' });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error connecting to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Enter your details to get started</p>
        </div>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-icon">
              <i className="fas fa-user icon"></i>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="   Enter your username"
                onChange={handleChange}
                value={formData.username}
                disabled={loading}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-icon">
              <i className="fas fa-phone icon"></i>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="    Enter your phone number"
                onChange={handleChange}
                value={formData.phone}
                disabled={loading}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-icon">
              <i className="fas fa-envelope icon"></i>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="    Enter your email"
                onChange={handleChange}
                value={formData.email}
                disabled={loading}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input input-icon">
              <i className="fas fa-lock icon"></i>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="   Create a password"
                onChange={handleChange}
                value={formData.password}
                disabled={loading}
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle"
                disabled={loading}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {/* Login Link */}
          <div className="welcome-back">
            <h3>Welcome Back!</h3>
            <p className="switch-auth">
              Already have an account?{' '}
              <a href="/login">Sign in</a>{' '}
              to access your dashboard and continue your journey with us.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
