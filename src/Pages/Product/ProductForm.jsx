import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Plus, Upload, MapPin, Crosshair } from 'lucide-react';
import authAxiosClient from '../../api/authAxiosClient';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

// Constants
const GOOGLE_MAPS_API_KEY = "AIzaSyD5mQuPg4TTUrxYtPj_TffvTECNftfJ_aw"; // Add this to your .env file
const libraries = ['places'];

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

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [autocomplete, setAutocomplete] = useState(null);
    const [address, setAddress] = useState('');

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

    // Add new state for saved addresses
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');

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

    // Add function to fetch saved addresses
    const fetchSavedAddresses = async () => {
        try {
            const response = await authAxiosClient.get('/userAddress');
            if (!response.data.error) {
                setSavedAddresses(response.data?.data || []);
                // If editing product and it has location, select the matching address
                if (product && product.location) {
                    const matchingAddress = response.data?.data.find(addr =>
                        addr.latitude === product.location.coordinates[1] &&
                        addr.longitude === product.location.coordinates[0]
                    );
                    if (matchingAddress) {
                        setSelectedAddressId(matchingAddress._id);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        }
    };

    // Add useEffect to fetch addresses
    useEffect(() => {
        fetchSavedAddresses();
    }, []);

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

            case 'selectedAddressId':
                if (!value) {
                    errors.address = 'Please select a delivery address';
                }
                break;

            case 'attributes':
                if (formData.subcategoryId && attributeKeys.length > 0) {
                    const requiredAttributes = attributeKeys.filter(key => key.isRequired);
                    requiredAttributes.forEach(attr => {
                        if (!value.find(v => v.key === attr._id)) {
                            errors[`attributes.${attr._id}`] = `${attr.name} is required`;
                        }
                    });
                }
                break;

            case 'images':
                if (!value || value.length === 0) {
                    errors.images = 'At least one product image is required';
                }
                if (value.length > 10) {
                    errors.images = 'Maximum 10 images allowed';
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

        // Validate selected address
        const addressErrors = validateField('selectedAddressId', selectedAddressId, formData);
        allErrors = { ...allErrors, ...addressErrors };

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
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                setLoading(false);
                return;
            }

            // Validate that an address is selected
            if (!selectedAddressId) {
                setErrors(prev => ({
                    ...prev,
                    address: 'Please select a delivery address'
                }));
                setLoading(false);
                return;
            }

            const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId);
            if (!selectedAddress) {
                setErrors(prev => ({
                    ...prev,
                    address: 'Selected address not found'
                }));
                setLoading(false);
                return;
            }

            // Create the request payload with all required fields
            const payload = {
                // Basic Information
                name: formData.name.trim(),
                description: formData.description.trim(),
                type: formData.type,
                categoryId: formData.categoryId,
                subcategoryId: formData.subcategoryId,
                condition: formData.condition,
                deliveryMode: formData.deliveryMode,

                // Location and Address
                location: {
                    type: 'Point',
                    coordinates: [selectedAddress.longitude, selectedAddress.latitude]
                },
                address: {
                    formattedAddress: selectedAddress.formattedAddress,
                    streetNumber: selectedAddress.streetNumber || '',
                    route: selectedAddress.route || '',
                    locality: selectedAddress.locality || '',
                    administrativeAreaLevel1: selectedAddress.administrativeAreaLevel1 || '',
                    country: selectedAddress.country || '',
                    postalCode: selectedAddress.postalCode || ''
                },

                // Product Status and Control Flags
                productStatus: isEdit ? formData.productStatus : undefined,

                // Attributes
                attributes: formData.attributes.map(attr => ({
                    key: attr.key,
                    value: attr.value
                }))
            };

            // Add type-specific fields
            if (formData.type === PRODUCT_TYPE.SELL) {
                payload.price = Number(formData.price);
                // Set other type-specific fields to null
                payload.rentDetails = null;
                payload.auctionDetails = null;
            }

            if (formData.type === PRODUCT_TYPE.RENT) {
                payload.rentDetails = {
                    rentPrice: Number(formData.rentDetails.rentPrice),
                    duration: Number(formData.rentDetails.duration),
                    securityAmount: formData.rentDetails.securityAmount
                        ? Number(formData.rentDetails.securityAmount)
                        : Number(formData.rentDetails.rentPrice) * 2 // Default to 2x rent price
                };
                // Set other type-specific fields to null
                payload.price = null;
                payload.auctionDetails = null;
            }

            if (formData.type === PRODUCT_TYPE.AUCTION) {
                payload.auctionDetails = {
                    startPrice: Number(formData.auctionDetails.startPrice),
                    reservePrice: Number(formData.auctionDetails.reservePrice),
                    bidIncrement: Number(formData.auctionDetails.bidIncrement),
                    startTime: new Date(formData.auctionDetails.startTime).toISOString(),
                    endTime: new Date(formData.auctionDetails.endTime).toISOString()
                };
                // Set other type-specific fields to null
                payload.price = null;
                payload.rentDetails = null;
            }

            // If editing, add the product ID
            if (isEdit) {
                payload.productId = product._id;
            }

            // Check if there are new images to upload
            const hasNewImages = formData.images.some(image => image instanceof File);

            // Create FormData and add each field individually
            const formDataToSend = new FormData();

            // Add each field individually to FormData
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formDataToSend.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
                }
            });

            // Add images separately if any
            if (hasNewImages) {
                formData.images.forEach((image) => {
                    if (image instanceof File) {
                        formDataToSend.append('images', image);
                    }
                });
            }

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

    const onLoad = (autocomplete) => {
        setAutocomplete(autocomplete);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setFormData(prev => ({
                    ...prev,
                    location: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    pickupAddress: place.formatted_address
                }));
                setAddress(place.formatted_address);
            }
        }
    };

    // Update detectCurrentLocation to use Google Maps Geocoding
    const detectCurrentLocation = () => {
        setIsDetectingLocation(true);
        setLocationError('');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const response = await fetch(
                            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
                        );
                        const data = await response.json();

                        if (data.results && data.results[0]) {
                            const place = data.results[0];
                            setFormData(prev => ({
                                ...prev,
                                location: {
                                    type: 'Point',
                                    coordinates: [longitude, latitude]
                                },
                                pickupAddress: place.formatted_address
                            }));
                            setAddress(place.formatted_address);
                        }
                        setIsDetectingLocation(false);
                    } catch (error) {
                        setLocationError('Failed to get location details');
                        setIsDetectingLocation(false);
                    }
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
                }
            );
        } else {
            setLocationError('Geolocation is not supported by your browser');
            setIsDetectingLocation(false);
        }
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
                    {errors.deliveryMode && (
                        <p className="text-red-500 text-sm mt-1">{errors.deliveryMode}</p>
                    )}
                </div>

                {/* Address Selection - Required for all delivery modes */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Product Location/Pickup Address
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            value={selectedAddressId}
                            onChange={(e) => setSelectedAddressId(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : ''}`}
                            required
                        >
                            <option value="">Select an address</option>
                            {savedAddresses.map((addr) => (
                                <option key={addr._id} value={addr._id}>
                                    {addr.formattedAddress} {addr.isDefault && '(Default)'}
                                </option>
                            ))}
                        </select>
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                    </div>

                    {selectedAddressId && (
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-sm font-medium mb-2">Selected Address Details</h4>
                            {(() => {
                                const addr = savedAddresses.find(a => a._id === selectedAddressId);
                                return addr ? (
                                    <div className="text-sm text-gray-600">
                                        <p>{addr.formattedAddress}</p>
                                        <p className="mt-1">
                                            {addr.locality}, {addr.administrativeAreaLevel1}
                                            {addr.postalCode && `, ${addr.postalCode}`}
                                        </p>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Location coordinates: [{addr.longitude.toFixed(6)}, {addr.latitude.toFixed(6)}]
                                        </p>
                                    </div>
                                ) : null;
                            })()}
                        </div>
                    )}

                    {savedAddresses.length === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                            <p className="text-yellow-700 text-sm flex items-center">
                                <AlertCircle className="mr-2" size={16} />
                                No saved addresses found. Please add an address in your profile settings first.
                            </p>
                        </div>
                    )}
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






