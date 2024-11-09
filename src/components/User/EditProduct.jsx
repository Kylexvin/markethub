// EditProduct.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/products/${id}`, product, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/seller-dashboard');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div>
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={product.name || ''} onChange={handleChange} placeholder="Name" />
                <input type="text" name="price" value={product.price || ''} onChange={handleChange} placeholder="Price" />
                <textarea name="description" value={product.description || ''} onChange={handleChange} placeholder="Description" />
                <button type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default EditProduct;
