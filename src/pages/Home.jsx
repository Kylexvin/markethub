import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/home.css';
import Footer from '../components/Footer';

const getRelativeTime = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (let interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return count === 1 ? `${count} ${interval.label} ago` : `${count} ${interval.label}s ago`;
    }
  }
  return "just now";
};

const ProductCard = ({ product, contactSeller }) => {
  const [relativeTime, setRelativeTime] = useState(getRelativeTime(product.createdAt));
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRelativeTime(getRelativeTime(product.createdAt));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [product.createdAt]);

  return (
    <div className="product-card" key={product._id}>
     <div className="product-image">
  <img
    src={`https://markethubbackend.onrender.com/${product.image.replace(/\\/g, "/")}`}
    alt={product.name}
    onLoad={() => setImageLoaded(true)}
    onError={(e) => {
      e.target.src = "/fallback-image.jpg"; // Ensure this path is accessible
    }}
    className={imageLoaded ? "image-loaded" : "image-loading"}
  />
</div>


      <div className="product-info">
        <div className="price-row">
          <div className="product-price">
            <i className="fas fa-tag"></i> Price Ksh {product.price.toLocaleString()}
          </div>
          <div className="timestamp">
            <i className="fas fa-clock"></i> <b>Posted</b> {relativeTime}
          </div>
        </div>
        <div className="product-description">
          <b><i className="fas fa-info-circle"></i> Description:</b><br/>
          <p className="product-description">{product.description}</p>
        </div>
        <div className="seller-info">
          <div className="seller-name">
            <i className="fas fa-user"></i> <b>Seller:</b>
            {product.sellerId ? product.sellerId.username || product.sellerId.phone : 'Unknown Seller'}
          </div>
        </div>
        <button className="contact-btn" onClick={() => contactSeller(product.sellerWhatsApp)}>
          <i className="fab fa-whatsapp"></i> Contact Seller
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://markethubbackend.onrender.com/api/products/approved');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const contactSeller = (sellerWhatsApp) => {
    const whatsappLink = `https://wa.me/${sellerWhatsApp}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <>
      <div className="Home">
        <nav className="nav">
          <div className="nav-content">
            <div className="logo">MarketHub</div>
            <div className="nav-buttons">
              <button className="nav-btn login-btn" onClick={() => navigate('/login')}>
                <i className="fas fa-sign-in-alt"></i> Login
              </button>
              <button className="nav-btn register-btn" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-content">
            <h1> Buy and Sell in Moi University</h1>
            <p>Join us and trade your items safely and easily on your trusted marketplace platform.</p>
          </div>
        </section>

        <div className="seller-card">
          <div className="seller-card-content">
            <h2> Want to Sell Your Items?</h2>
            <p>Create a free account and start selling to potential buyers in Moi University.</p>
            <button className="nav-btn register-btn" onClick={() => navigate('/register')}>
              <i className="fas fa-plus-circle"></i> Start Selling Today
            </button>
          </div>
        </div>

        <div className="container">
          <h2 className="section-title">Product for you</h2>
          <div className="products-grid">
            {loading ? (
              <p><i className="fas fa-spinner fa-spin"></i> Loading products...</p>
            ) : error ? (
              <p>{error}</p>
            ) : products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product._id} product={product} contactSeller={contactSeller} />
              ))
            ) : (
              <p>No products available at the moment. Become a seller now</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
