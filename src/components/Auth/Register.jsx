import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './auth.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '254',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const sanitizedValue = value.replace(/\D/g, "");
      const formattedPhone = sanitizedValue.startsWith("254")
        ? sanitizedValue
        : `254${sanitizedValue.slice(3)}`;
      
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedPhone,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://markethubbackend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Registration successful! Welcome, ${formData.username}. You can now log in.`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
        setFormData({ username: '', phone: '254', email: '', password: '' });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error('Unable to connect to the server. Please try again later.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Enter your details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-icon">
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
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
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="254"
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
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input input-icon">
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