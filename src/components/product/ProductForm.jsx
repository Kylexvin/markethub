import React, { useState } from 'react';

const ProductForm = ({ onSubmit }) => {
    const [product, setProduct] = useState({ name: '', description: '', price: '' });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(product);
        setProduct({ name: '', description: '', price: '' }); // Reset form
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
            <input type="text" name="description" placeholder="Description" value={product.description} onChange={handleChange} required />
            <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
            <button type="submit">Submit</button>
        </form>
    );
};

export default ProductForm;
