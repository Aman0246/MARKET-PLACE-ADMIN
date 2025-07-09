import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import authAxiosClient from '../../api/authAxiosClient';
import { useNavigate } from 'react-router';

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();
    const navigate = useNavigate()

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await authAxiosClient.get('/category/all?level=0');
            setCategories(res.data?.data || []);
        } catch (err) {
            console.error('Fetch failed:', err);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                if (key === 'file' && data.file?.[0]) {
                    formData.append('file', data.file[0]);
                } else {
                    formData.append(key, data[key]);
                }
            }

            formData.append('level', 0);
            // formData.append('parentId', 'null');

            if (selected) {
                await authAxiosClient.post(`/category/${selected._id}`, formData);
            } else {
                await authAxiosClient.post(`/category/create`, formData);
            }

            resetForm();
            fetchCategories();
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    const handleEdit = (cat) => {
        setSelected(cat);
        setValue('name', cat.name);
        setValue('order', cat.order);
        setValue('isDisabled', cat.isDisabled);
    };

    const handleDelete = async (id) => {
        try {
            const body = new URLSearchParams();
            body.append('isDeleted', true);
            await authAxiosClient.post(`/category/${id}`, body, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            fetchCategories();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const resetForm = () => {
        setSelected(null);
        reset({ name: '', order: 1, isDisabled: false });
    };

    return (
        <div className="p-4 max-w-3xl mx-auto space-y-6">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow p-4 rounded space-y-4"
                encType="multipart/form-data"
            >
                <h2 className="text-lg font-bold">{selected ? '✏️ Edit Category' : '➕ Add Category'}</h2>
                <input
                    {...register('name', { required: true })}
                    placeholder="Category name"
                    className="w-full border p-2 rounded"
                />
                <input
                    {...register('order')}
                    type="number"
                    placeholder="Order"
                    className="w-full border p-2 rounded"
                />
                <input
                    {...register('file')}
                    type="file"
                    className="w-full"
                />
                <label className="flex items-center space-x-2">
                    <input type="checkbox" {...register('isDisabled')} />
                    <span>Disable</span>
                </label>
                <div className="space-x-2">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        {selected ? 'Update' : 'Create'}
                    </button>
                    {selected && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-gray-500"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white shadow p-4 rounded">
                <h2 className="text-lg font-bold mb-4">📁 Categories</h2>
                {categories.length === 0 ? (
                    <p>No categories found.</p>
                ) : (
                    <ul className="space-y-2">
                        {categories.map(cat => (
                            <li
                                key={cat._id}

                                className="flex justify-between items-center border-b pb-2"
                            >
                                <span className="capitalize">{cat.name}</span>
                                <img src={cat.icon} alt='img' className=' w-10 h-10' />
                                <span onClick={() => navigate(`/subcategory/${cat?._id}`)} className=' cursor-pointer'> View subcategory </span>

                                <div className="space-x-2">
                                    <button onClick={() => handleEdit(cat)} className="text-blue-500">Edit</button>
                                    <button onClick={() => handleDelete(cat._id)} className="text-red-500">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
