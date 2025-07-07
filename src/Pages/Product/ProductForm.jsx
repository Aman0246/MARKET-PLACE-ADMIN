import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Plus, Upload, MapPin, Crosshair } from 'lucide-react';
import authAxiosClient from '../../api/authAxiosClient';

// Constants
const PRODUCT_TYPE = {
    SELL: 'SELL',
    RENT: 'RENT',
    AUCTION: 'AUCTION'
};

const PRODUCT_CONDITION = {
    NEW: 'new',
    USED: 'used',
    REFURBISHED: 'REFURBISHED'
};

const DELIVERY_MODE = {
    SELLER_DELIVERY: 'seller_delivery',
    BUYER_PICKUP: 'buyer_pickup',
    APP_SHIPPING: 'app_shipping'
};

const RENT_DURATION = {
    1: 1,
    3: 3,
    6: 6,
    12: 12
};

export default function ProductForm({ product = null, onSubmit, onCancel }) {
    const isEdit = !!product;

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: PRODUCT_TYPE.SELL,
        categoryId: '',
        subcategoryId: '',
        condition: '',
        price: '',
        rentDetails: {
            rentPrice: '',
            duration: '',
            securityAmount: ''
        },
        auctionDetails: {
            startPrice: '',
            reservePrice: '',
            bidIncrement: '',
            startTime: '',
            endTime: ''
        },
        deliveryMode: '',
        pickupAddress: '',
        attributes: [],
        location: {
            type: 'Point',
            coordinates: [0, 0]
        },
        images: []
    });

    // Category data state
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [attributeKeys, setAttributeKeys] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Add new state for location detection
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch subcategories when category changes
    useEffect(() => {
        if (formData.categoryId) {
            fetchSubcategories(formData.categoryId);
        } else {
            setSubcategories([]);
        }
    }, [formData.categoryId]);

    // Fetch attributes when subcategory changes
    useEffect(() => {
        if (formData.subcategoryId) {
            fetchAttributes(formData.subcategoryId);
        } else {
            setAttributeKeys([]);
        }
    }, [formData.subcategoryId]);

    // Initialize form with product data if editing
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                type: product.type || PRODUCT_TYPE.SELL,
                categoryId: product.categoryId || '',
                subcategoryId: product.subcategoryId || '',
                condition: product.condition || '',
                price: product.price || '',
                rentDetails: {
                    rentPrice: product.rentDetails?.rentPrice || '',
                    duration: product.rentDetails?.duration || '',
                    securityAmount: product.rentDetails?.securityAmount || ''
                },
                auctionDetails: {
                    startPrice: product.auctionDetails?.startPrice || '',
                    reservePrice: product.auctionDetails?.reservePrice || '',
                    bidIncrement: product.auctionDetails?.bidIncrement || '',
                    startTime: product.auctionDetails?.startTime ? new Date(product.auctionDetails.startTime).toISOString().slice(0, 16) : '',
                    endTime: product.auctionDetails?.endTime ? new Date(product.auctionDetails.endTime).toISOString().slice(0, 16) : ''
                },
                deliveryMode: product.deliveryMode || '',
                pickupAddress: product.pickupAddress || '',
                attributes: product.attributes || [],
                location: product.location || { type: 'Point', coordinates: [0, 0] },
                images: product.images || []
            });
        }
    }, [product]);

    // Fetch functions
    const fetchCategories = async () => {
        try {
            const res = await authAxiosClient.get('/category/all?level=0');
            setCategories(res.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const res = await authAxiosClient.get(`/category/all?parentId=${categoryId}&level=1`);
            setSubcategories(res.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch subcategories:', err);
        }
    };

    const fetchAttributes = async (subcategoryId) => {
        try {
            const res = await authAxiosClient.get(`/category/getAllKeyParamentbySubcategory/${subcategoryId}`);
            setAttributeKeys(res.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch attributes:', err);
        }
    };

    // Validation functions
    const validateField = (name, value, formData) => {
        const errors = {};

        switch (name) {
            case 'name':
                if (!value.trim()) errors.name = 'Product name is required';
                break;

            case 'description':
                if (!value.trim()) errors.description = 'Product description is required';
                if (value.trim().length < 20) errors.description = 'Description must be at least 20 characters';
                break;

            case 'type':
                if (!Object.values(PRODUCT_TYPE).includes(value)) {
                    errors.type = 'Invalid product type';
                }
                break;

            case 'categoryId':
                if (!value) errors.categoryId = 'Category is required';
                break;

            case 'subcategoryId':
                if (!value) errors.subcategoryId = 'Subcategory is required';
                break;

            case 'condition':
                if (!Object.values(PRODUCT_CONDITION).includes(value)) {
                    errors.condition = 'Product condition is required';
                }
                break;

            case 'price':
                if (formData.type === PRODUCT_TYPE.SELL) {
                    if (!value || value < 0) errors.price = 'Valid price is required for sell products';
                }
                break;

            case 'rentDetails':
                if (formData.type === PRODUCT_TYPE.RENT) {
                    if (!value.rentPrice || value.rentPrice < 0) {
                        errors['rentDetails.rentPrice'] = 'Rent price is required';
                    }
                    if (!value.duration || !Object.values(RENT_DURATION).includes(Number(value.duration))) {
                        errors['rentDetails.duration'] = 'Valid duration is required';
                    }
                    if (value.securityAmount !== '' && value.securityAmount < 0) {
                        errors['rentDetails.securityAmount'] = 'Security amount must be positive';
                    }
                }
                break;

            case 'auctionDetails':
                if (formData.type === PRODUCT_TYPE.AUCTION) {
                    if (!value.startPrice || value.startPrice < 0) {
                        errors['auctionDetails.startPrice'] = 'Start price is required';
                    }
                    if (!value.reservePrice || value.reservePrice <= value.startPrice) {
                        errors['auctionDetails.reservePrice'] = 'Reserve price must be greater than start price';
                    }
                    if (!value.bidIncrement || value.bidIncrement < 1) {
                        errors['auctionDetails.bidIncrement'] = 'Bid increment must be at least 1';
                    }
                    if (!value.startTime) {
                        errors['auctionDetails.startTime'] = 'Start time is required';
                    }
                    if (!value.endTime || new Date(value.endTime) <= new Date(value.startTime)) {
                        errors['auctionDetails.endTime'] = 'End time must be after start time';
                    }
                }
                break;

            case 'deliveryMode':
                if (!Object.values(DELIVERY_MODE).includes(value)) {
                    errors.deliveryMode = 'Delivery mode is required';
                }
                break;

            case 'pickupAddress':
                if (formData.deliveryMode === DELIVERY_MODE.BUYER_PICKUP && !value.trim()) {
                    errors.pickupAddress = 'Pickup address is required when buyer pickup is selected';
                }
                break;

            case 'location':
                if (!value.coordinates || value.coordinates.length !== 2) {
                    errors.location = 'Valid coordinates are required';
                } else {
                    const [lng, lat] = value.coordinates;
                    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
                        errors.location = 'Coordinates must be within valid ranges';
                    }
                }
                break;
        }

        return errors;
    };

    const validateForm = () => {
        let allErrors = {};

        // Validate all fields
        Object.keys(formData).forEach(key => {
            const fieldErrors = validateField(key, formData[key], formData);
            allErrors = { ...allErrors, ...fieldErrors };
        });

        setErrors(allErrors);
        return Object.keys(allErrors).length === 0;
    };

    // Event handlers
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Clear subcategory and attributes when category changes
        if (name === 'categoryId') {
            setFormData(prev => ({
                ...prev,
                subcategoryId: '',
                attributes: []
            }));
        }

        // Clear attributes when subcategory changes
        if (name === 'subcategoryId') {
            setFormData(prev => ({
                ...prev,
                attributes: []
            }));
        }

        // Validate the changed field
        const fieldErrors = validateField(name, newValue, formData);
        setErrors(prev => ({
            ...prev,
            ...fieldErrors
        }));
    };

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));

        // Clear error for this field
        const errorKey = `${section}.${field}`;
        if (errors[errorKey]) {
            setErrors(prev => ({ ...prev, [errorKey]: '' }));
        }
    };

    const handleLocationChange = (index, value) => {
        const newCoordinates = [...formData.location.coordinates];
        newCoordinates[index] = parseFloat(value) || 0;

        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                coordinates: newCoordinates
            }
        }));
    };

    const handleAttributeChange = (keyId, value) => {
        setFormData(prev => {
            const attributes = [...prev.attributes];
            const existingIndex = attributes.findIndex(attr => attr.key === keyId);

            if (existingIndex >= 0) {
                attributes[existingIndex] = { key: keyId, value };
            } else {
                attributes.push({ key: keyId, value });
            }

            return {
                ...prev,
                attributes
            };
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...files]
            }));
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate form before submission
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                setLoading(false);
                return;
            }

            const formDataToSend = new FormData();

            // Basic fields
            formDataToSend.append('name', formData.name.trim());
            formDataToSend.append('description', formData.description.trim());
            formDataToSend.append('type', formData.type);
            formDataToSend.append('categoryId', formData.categoryId);
            formDataToSend.append('subcategoryId', formData.subcategoryId);
            formDataToSend.append('condition', formData.condition);
            formDataToSend.append('deliveryMode', formData.deliveryMode);

            // Conditional fields based on product type
            if (formData.type === PRODUCT_TYPE.SELL) {
                formDataToSend.append('price', formData.price);
            }

            if (formData.type === PRODUCT_TYPE.RENT) {
                const rentDetails = {
                    rentPrice: Number(formData.rentDetails.rentPrice),
                    duration: Number(formData.rentDetails.duration),
                    securityAmount: formData.rentDetails.securityAmount ? Number(formData.rentDetails.securityAmount) : undefined
                };
                formDataToSend.append('rentDetails', JSON.stringify(rentDetails));
            }

            if (formData.type === PRODUCT_TYPE.AUCTION) {
                const auctionDetails = {
                    startPrice: Number(formData.auctionDetails.startPrice),
                    reservePrice: Number(formData.auctionDetails.reservePrice),
                    bidIncrement: Number(formData.auctionDetails.bidIncrement),
                    startTime: new Date(formData.auctionDetails.startTime).toISOString(),
                    endTime: new Date(formData.auctionDetails.endTime).toISOString()
                };
                formDataToSend.append('auctionDetails', JSON.stringify(auctionDetails));
            }

            // Pickup address (only if delivery mode is BUYER_PICKUP)
            if (formData.deliveryMode === DELIVERY_MODE.BUYER_PICKUP) {
                formDataToSend.append('pickupAddress', formData.pickupAddress.trim());
            }

            // Location (GeoJSON format)
            formDataToSend.append('location', JSON.stringify({
                type: 'Point',
                coordinates: formData.location.coordinates.map(Number)
            }));

            // Attributes (array of key-value pairs)
            const attributes = formData.attributes.map(attr => ({
                key: attr.key,
                value: attr.value
            }));
            formDataToSend.append('attributes', JSON.stringify(attributes));

            // Images (append all images to the images field)
            formData.images.forEach(image => {
                if (image instanceof File) {
                    formDataToSend.append('images', image);
                }
            });

            await onSubmit(formDataToSend);
        } catch (err) {
            console.error('Submit failed:', err);
            setErrors(prev => ({
                ...prev,
                submit: err.message || 'Failed to submit form'
            }));
        } finally {
            setLoading(false);
        }
    };

    // Add new function for location detection
    const detectCurrentLocation = () => {
        setIsDetectingLocation(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setIsDetectingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { longitude, latitude } = position.coords;
                setFormData(prev => ({
                    ...prev,
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    }
                }));
                setIsDetectingLocation(false);
            },
            (error) => {
                let errorMessage = 'Failed to get location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Please allow location access to use this feature';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }
                setLocationError(errorMessage);
                setIsDetectingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                            rows="4"
                            placeholder="Provide a detailed description of your product (minimum 20 characters)"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Product Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        >
                            {Object.entries(PRODUCT_TYPE).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.categoryId && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Subcategory</label>
                            <select
                                name="subcategoryId"
                                value={formData.subcategoryId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            >
                                <option value="">Select Subcategory</option>
                                {subcategories.map(sub => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Condition</label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        >
                            <option value="">Select Condition</option>
                            {Object.entries(PRODUCT_CONDITION).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Price Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Price Information</h3>

                    {formData.type === PRODUCT_TYPE.SELL && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                                min="0"
                            />
                        </div>
                    )}

                    {formData.type === PRODUCT_TYPE.RENT && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Rent Price</label>
                                <input
                                    type="number"
                                    name="rentPrice"
                                    value={formData.rentDetails.rentPrice}
                                    onChange={(e) => handleNestedChange('rentDetails', 'rentPrice', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Duration (months)</label>
                                <select
                                    name="duration"
                                    value={formData.rentDetails.duration}
                                    onChange={(e) => handleNestedChange('rentDetails', 'duration', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                >
                                    <option value="">Select Duration</option>
                                    {Object.values(RENT_DURATION).map(duration => (
                                        <option key={duration} value={duration}>
                                            {duration} {duration === 1 ? 'month' : 'months'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Security Amount</label>
                                <input
                                    type="number"
                                    name="securityAmount"
                                    value={formData.rentDetails.securityAmount}
                                    onChange={(e) => handleNestedChange('rentDetails', 'securityAmount', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    min="0"
                                />
                            </div>
                        </>
                    )}

                    {formData.type === PRODUCT_TYPE.AUCTION && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Price</label>
                                <input
                                    type="number"
                                    name="startPrice"
                                    value={formData.auctionDetails.startPrice}
                                    onChange={(e) => handleNestedChange('auctionDetails', 'startPrice', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Reserve Price</label>
                                <input
                                    type="number"
                                    name="reservePrice"
                                    value={formData.auctionDetails.reservePrice}
                                    onChange={(e) => handleNestedChange('auctionDetails', 'reservePrice', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Bid Increment</label>
                                <input
                                    type="number"
                                    name="bidIncrement"
                                    value={formData.auctionDetails.bidIncrement}
                                    onChange={(e) => handleNestedChange('auctionDetails', 'bidIncrement', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Time</label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.auctionDetails.startTime}
                                    onChange={(e) => handleNestedChange('auctionDetails', 'startTime', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Time</label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.auctionDetails.endTime}
                                    onChange={(e) => handleNestedChange('auctionDetails', 'endTime', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Delivery Information</h3>

                <div>
                    <label className="block text-sm font-medium mb-1">Delivery Mode</label>
                    <select
                        name="deliveryMode"
                        value={formData.deliveryMode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    >
                        <option value="">Select Delivery Mode</option>
                        {Object.entries(DELIVERY_MODE).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                            </option>
                        ))}
                    </select>
                </div>

                {formData.deliveryMode === DELIVERY_MODE.BUYER_PICKUP && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Pickup Address</label>
                        <textarea
                            name="pickupAddress"
                            value={formData.pickupAddress}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                            rows="3"
                            placeholder="Enter the complete pickup address"
                        />
                    </div>
                )}

                {/* Location Information */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium">Location Coordinates</label>
                        <button
                            type="button"
                            onClick={detectCurrentLocation}
                            disabled={isDetectingLocation}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            <Crosshair className="w-4 h-4 mr-1" />
                            {isDetectingLocation ? 'Detecting...' : 'Detect My Location'}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Longitude</label>
                            <input
                                type="number"
                                value={formData.location.coordinates[0]}
                                onChange={(e) => handleLocationChange(0, e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                                step="any"
                                min="-180"
                                max="180"
                                placeholder="-180 to 180"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Latitude</label>
                            <input
                                type="number"
                                value={formData.location.coordinates[1]}
                                onChange={(e) => handleLocationChange(1, e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                                step="any"
                                min="-90"
                                max="90"
                                placeholder="-90 to 90"
                            />
                        </div>
                    </div>
                    {locationError && (
                        <p className="text-red-500 text-sm mt-1">{locationError}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <MapPin className="inline-block mr-1" size={14} />
                        Click "Detect My Location" or enter coordinates manually
                    </p>
                </div>
            </div>

            {/* Attributes */}
            {formData.subcategoryId && attributeKeys.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Product Attributes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {attributeKeys.map(key => (
                            <div key={key._id}>
                                <label className="block text-sm font-medium mb-1">{key.name}</label>
                                <select
                                    value={formData.attributes.find(attr => attr.key === key._id)?.value || ''}
                                    onChange={(e) => handleAttributeChange(key._id, e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="">Select {key.name}</option>
                                    {key.values.map(val => (
                                        <option key={val._id} value={val._id}>
                                            {val.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Images */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Product Images</h3>

                <div className="border-2 border-dashed p-4 rounded-lg">
                    <label className="block text-sm font-medium mb-2">Product Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                        <Upload size={14} className="mr-1" />
                        Upload one or more product images
                    </p>
                </div>

                {formData.images.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-600 mb-2">
                            {formData.images.length} image(s) selected
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image instanceof File ? URL.createObjectURL(image) : image}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                </button>
            </div>

            {errors.submit && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md flex items-center">
                    <AlertCircle className="mr-2" size={20} />
                    {errors.submit}
                </div>
            )}
        </form>
    );
}






