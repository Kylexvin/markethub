// services/productService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

const uploadProduct = async (formData) => {
    return await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const fetchProducts = async () => {
    return await axios.get(`${API_URL}/seller`);
};

const deleteProduct = async (productId) => {
    return await axios.delete(`${API_URL}/${productId}`);
};

export { uploadProduct, fetchProducts, deleteProduct };
