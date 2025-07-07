import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import authAxiosClient from '../../api/authAxiosClient';

export default function AttributePage() {
    const { id: categoryId } = useParams();
    const [attributeKeys, setAttributeKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', order: 0 });
    const [formError, setFormError] = useState('');
    const [valueForms, setValueForms] = useState({});
    const [editValues, setEditValues] = useState({});
    const [editKeys, setEditKeys] = useState({});

    const fetchAttributeKeys = async () => {
        try {
            const res = await authAxiosClient.get(`/category/getAllKeyParamentbySubcategory/${categoryId}`);
            setAttributeKeys(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching attribute keys:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttributeKeys();
    }, [categoryId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return setFormError('Name is required');

        try {
            const payload = {
                name: form.name.trim().toLowerCase(),
                order: Number(form.order),
                categoryId
            };
            await authAxiosClient.post('/attributKey/create', payload);
            setShowModal(false);
            setForm({ name: '', order: 0 });
            fetchAttributeKeys();
        } catch (error) {
            setFormError(error?.response?.data?.message || 'Failed to create attribute key');
        }
    };

    const handleValueChange = (keyId, val) => {
        setValueForms(prev => ({ ...prev, [keyId]: { value: val, error: '' } }));
    };

    const handleValueSubmit = async (keyId) => {
        const formData = valueForms[keyId] || {};
        if (!formData.value?.trim()) {
            setValueForms(prev => ({ ...prev, [keyId]: { ...formData, error: 'Value is required' } }));
            return;
        }

        try {
            const payload = {
                key: keyId,
                value: formData.value.trim().toLowerCase(),
                categoryId
            };

            await authAxiosClient.post('/attributValue/create', payload);
            setValueForms(prev => ({ ...prev, [keyId]: { value: '', error: '' } }));
            fetchAttributeKeys();
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to add value';
            setValueForms(prev => ({ ...prev, [keyId]: { ...formData, error: errorMsg } }));
        }
    };

    const handleValueEdit = (val) => {
        setEditValues(prev => ({ ...prev, [val._id]: { value: val.value, editing: true } }));
    };

    const handleValueEditChange = (id, val) => {
        setEditValues(prev => ({ ...prev, [id]: { ...prev[id], value: val } }));
    };

    const handleValueUpdate = async (valId) => {
        const data = editValues[valId];
        if (!data?.value?.trim()) return;

        try {
            await authAxiosClient.post(`/attributValue/${valId}`, {
                value: data.value.trim().toLowerCase()
            });
            fetchAttributeKeys();
            setEditValues(prev => {
                const clone = { ...prev };
                delete clone[valId];
                return clone;
            });
        } catch (err) {
            alert('Update failed');
        }
    };

    const handleValueDelete = async (valId) => {
        if (!window.confirm('Delete this value?')) return;
        try {
            await authAxiosClient.post(`/attributValue/${valId}`, { isDeleted: true });
            fetchAttributeKeys();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleKeyEdit = (key) => {
        setEditKeys(prev => ({
            ...prev,
            [key._id]: { name: key.name, order: key.order, editing: true }
        }));
    };

    const handleKeyEditChange = (keyId, field, value) => {
        setEditKeys(prev => ({
            ...prev,
            [keyId]: { ...prev[keyId], [field]: value }
        }));
    };

    const handleKeyToggleDisable = async (key) => {
        try {
            const newStatus = !key.isDisable;
            await authAxiosClient.post(`/attributKey/${key._id}`, { isDisable: newStatus });
            fetchAttributeKeys();
        } catch (err) {
            alert('Failed to toggle disable');
        }
    };


    const handleKeyUpdate = async (keyId) => {
        const data = editKeys[keyId];
        if (!data.name?.trim()) return;

        try {
            await authAxiosClient.post(`/attributKey/${keyId}`, {
                name: data.name.trim().toLowerCase(),
                order: Number(data.order)
            });
            fetchAttributeKeys();
            setEditKeys(prev => {
                const clone = { ...prev };
                delete clone[keyId];
                return clone;
            });
        } catch (err) {
            alert('Key update failed');
        }
    };

    const handleKeyDisable = async (keyId) => {
        if (!window.confirm('Disable this key?')) return;
        try {
            await authAxiosClient.post(`/attributKey/${keyId}`, { isDisable: true });
            fetchAttributeKeys();
        } catch (err) {
            alert('Disable failed');
        }
    };

    const handleKeyDelete = async (keyId) => {
        if (!window.confirm('Delete this key?')) return;
        try {
            await authAxiosClient.post(`/attributKey/${keyId}`, { isDeleted: true });
            fetchAttributeKeys();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const cancelKeyEdit = (keyId) => {
        setEditKeys(prev => {
            const clone = { ...prev };
            delete clone[keyId];
            return clone;
        });
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">🧩 Attribute Keys</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                    ➕ Add Attribute
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : attributeKeys.length === 0 ? (
                <p>No attribute keys found.</p>
            ) : (
                <ul className="space-y-4">
                    {attributeKeys.map((key) => (
                        <li key={key._id} className="border p-4 rounded shadow-sm">
                            {editKeys[key._id]?.editing ? (
                                <div className="space-y-2 mb-2">
                                    <input
                                        type="text"
                                        value={editKeys[key._id].name}
                                        onChange={(e) => handleKeyEditChange(key._id, 'name', e.target.value)}
                                        className="border px-2 py-1 rounded w-full"
                                    />
                                    <input
                                        type="number"
                                        value={editKeys[key._id].order}
                                        onChange={(e) => handleKeyEditChange(key._id, 'order', e.target.value)}
                                        className="border px-2 py-1 rounded w-full"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => handleKeyUpdate(key._id)} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                                        <button onClick={() => cancelKeyEdit(key._id)} className="bg-gray-400 px-3 py-1 rounded">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between mb-2">
                                    <div>
                                        <p className="font-semibold capitalize">{key.name}</p>
                                        <p className="text-sm text-gray-500">Order: {key.order}</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button onClick={() => handleKeyEdit(key)} className="text-blue-500 text-sm hover:underline">Edit</button>

                                        <button
                                            onClick={() => handleKeyToggleDisable(key)}
                                            className={`text-sm hover:underline ${key.isDisable ? 'text-green-600' : 'text-yellow-600'}`}
                                        >
                                            {key.isDisable ? 'Enable' : 'Disable'}
                                        </button>


                                        <button onClick={() => handleKeyDelete(key._id)} className="text-red-500 text-sm hover:underline">Delete</button>
                                    </div>
                                </div>
                            )}

                            <div className="ml-4 space-y-2">
                                {key.values?.map((val) => (
                                    <div key={val._id} className="flex items-center gap-2">
                                        {editValues[val._id]?.editing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editValues[val._id].value}
                                                    onChange={(e) => handleValueEditChange(val._id, e.target.value)}
                                                    className="border px-2 py-1 rounded"
                                                />
                                                <button onClick={() => handleValueUpdate(val._id)} className="bg-green-600 text-white px-2 rounded">✅</button>
                                                <button onClick={() => setEditValues(prev => { const copy = { ...prev }; delete copy[val._id]; return copy; })} className="text-gray-600 hover:text-red-500">❌</button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="capitalize">{val.value}</span>
                                                <button onClick={() => handleValueEdit(val)} className="text-blue-500 text-sm hover:underline">Edit</button>
                                                <button onClick={() => handleValueDelete(val._id)} className="text-red-500 text-sm hover:underline">Delete</button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <input
                                    type="text"
                                    placeholder="Add a value"
                                    value={valueForms[key._id]?.value || ''}
                                    onChange={(e) => handleValueChange(key._id, e.target.value)}
                                    className="border px-3 py-1 rounded w-full"
                                />
                                <button
                                    onClick={() => handleValueSubmit(key._id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                    ➕
                                </button>
                            </div>
                            {valueForms[key._id]?.error && (
                                <p className="text-red-500 text-sm">{valueForms[key._id].error}</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <h3 className="text-lg font-semibold mb-4">Add Attribute Key</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={form.order}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                    min={0}
                                />
                            </div>
                            {formError && <p className="text-red-500 text-sm">{formError}</p>}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
