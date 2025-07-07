import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import authAxiosClient from '../../api/authAxiosClient';
import useToast from '../../Component/ToastProvider/useToast';

export default function Product() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (formData) => {
        try {
            await authAxiosClient.post('/product/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showToast('Product created successfully!', 'success');
            navigate('/product');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to create product', 'error');
            throw error;
        }
    };

    const handleCancel = () => {
        navigate('/product');
    };

    return (
        <Routes>
            <Route index element={<ProductList />} />
            <Route
                path="create"
                element={
                    <ProductForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                }
            />
            <Route
                path="edit/:id"
                element={
                    <ProductForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                }
            />
        </Routes>
    );
}



