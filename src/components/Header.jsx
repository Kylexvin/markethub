// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Correctly import useAuth

const Header = () => {
    const { user } = useAuth(); // Access user state from context

    return (
        <header style={{ padding: '10px', backgroundColor: '#f8f9fa' }}>
            <h1>Marketplace</h1>
            <nav>
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/logout">Logout</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
