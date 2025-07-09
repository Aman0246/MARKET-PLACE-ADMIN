import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authAxiosClient from '../../api/authAxiosClient';

export default function AllSubcategory() {
    const { id } = useParams();
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addError, setAddError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '',
        order: '',
        isActive: true,
        isDisabled: false,
        icon: null,
    });

    const fetchSubcategories = async () => {
        try {
            setLoading(true);
            const res = await authAxiosClient.get(`/category/all?parentId=${id}&level=1`);
            setSubcategories(res.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching subcategories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchSubcategories();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setForm({ ...form, [name]: checked });
        } else if (type === 'file') {
            setForm({ ...form, icon: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        setAddError(null);
        setAdding(true);

        try {
            const formData = new FormData();
            formData.append('name', form.name.trim().toLowerCase());
            formData.append('order', Number(form.order));
            formData.append('isActive', form.isActive);
            formData.append('isDisabled', form.isDisabled);
            formData.append('level', 1);
            formData.append('parentId', id);
            formData.append('type', 'both');
            formData.append('isDeleted', false);
            if (form.icon) formData.append('file', form.icon);

            if (editing) {
                await authAxiosClient.post(`/category/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await authAxiosClient.post('/category/create', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            await fetchSubcategories();
            resetForm();
        } catch (err) {
            setAddError(err.response?.data?.message || 'Failed to submit');
        } finally {
            setAdding(false);
        }
    };

    const resetForm = () => {
        setForm({ name: '', order: '', isActive: true, isDisabled: false, icon: null });
        setIsModalOpen(false);
        setEditing(false);
        setEditingId(null);
    };

    const handleEditOpen = (subcategory) => {
        setForm({
            name: subcategory.name,
            order: subcategory.order,
            isActive: subcategory.isActive,
            isDisabled: subcategory.isDisabled,
            icon: null,
        });
        setEditingId(subcategory._id);
        setEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (subcategoryId) => {
        if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
        try {
            await authAxiosClient.post(`/category/${subcategoryId}`, {
                isDeleted: true,
            });
            await fetchSubcategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    const handleToggleDisable = async (subcategory) => {
        try {
            await authAxiosClient.post(`/category/${subcategory._id}`, {
                isDisabled: !subcategory.isDisabled,
            });
            await fetchSubcategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to toggle status');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Subcategories</h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                >
                    + Add Subcategory
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : subcategories.length === 0 ? (
                <p className="text-gray-600">No subcategories found.</p>
            ) : (
                <ul className="space-y-2">
                    {subcategories.map((sub) => (
                        <li key={sub._id} className="border p-3 rounded bg-white shadow-sm flex justify-between items-center">
                            <span className="capitalize">{sub.name}</span>
                            <span onClick={() => navigate(`/subcategoryAttribute/${sub._id}`)} className="capitalize cursor-pointer">View</span>

                            <img src={sub?.icon} className=' w-12 h-12' />
                            <div className="flex gap-3 text-sm">
                                <button onClick={() => handleEditOpen(sub)} className="text-blue-600 hover:underline">Edit</button>
                                <button onClick={() => handleToggleDisable(sub)} className="text-yellow-600 hover:underline">
                                    {sub.isDisabled ? 'Enable' : 'Disable'}
                                </button>
                                <button onClick={() => handleDelete(sub._id)} className="text-red-600 hover:underline">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
                        <h3 className="text-xl font-semibold mb-4">
                            {editing ? 'Update Subcategory' : 'Create Subcategory'}
                        </h3>
                        <form onSubmit={handleAddOrUpdate} encType="multipart/form-data" className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={form.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={form.order}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>

                            <div className="flex gap-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={form.isActive}
                                        onChange={handleInputChange}
                                    />
                                    <span>Active</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="isDisabled"
                                        checked={form.isDisabled}
                                        onChange={handleInputChange}
                                    />
                                    <span>Disable</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Icon (optional)</label>
                                <input
                                    type="file"
                                    name="icon"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>

                            {addError && <p className="text-red-600">{addError}</p>}

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 border rounded-md text-gray-700"
                                    disabled={adding}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    disabled={adding}
                                >
                                    {adding ? 'Submitting...' : editing ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
