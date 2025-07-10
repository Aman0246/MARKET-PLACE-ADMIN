import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, SortDesc, MapPin } from 'lucide-react';
import authAxiosClient from '../../api/authAxiosClient';
import Loader from '../../Component/Common/Loader';

const PRODUCT_TYPE = {
    SELL: 'SELL',
    RENT: 'RENT',
    AUCTION: 'AUCTION'
};

const SORT_OPTIONS = {
    PRICE_ASC: { field: 'price', order: 'asc', label: 'Price: Low to High' },
    PRICE_DESC: { field: 'price', order: 'desc', label: 'Price: High to Low' },
    CREATED_DESC: { field: 'createdAt', order: 'desc', label: 'Newest First' },
    CREATED_ASC: { field: 'createdAt', order: 'asc', label: 'Oldest First' },
    DISTANCE_ASC: { field: 'distance', order: 'asc', label: 'Nearest First' },
    DISTANCE_DESC: { field: 'distance', order: 'desc', label: 'Farthest First' }
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function ProductList() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(PRODUCT_TYPE.SELL);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [limit] = useState(DEFAULT_LIMIT);
    const [total, setTotal] = useState(0);

    // Filter states
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [attributeKeys, setAttributeKeys] = useState([]);
    const [filters, setFilters] = useState({
        categoryId: '',
        subcategoryId: '',
        attributeKey: '',
        attributeValue: '',
        useLocation: false,
        userLocation: null
    });

    // Sort state
    const [sortOption, setSortOption] = useState('');

    // Fetch initial data
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products when filters, sort, or pagination changes
    useEffect(() => {
        fetchProducts();
    }, [activeTab, page, filters, sortOption]);

    // Fetch subcategories when category changes
    useEffect(() => {
        if (filters.categoryId) {
            fetchSubcategories(filters.categoryId);
        } else {
            setSubcategories([]);
        }
        setFilters(prev => ({ ...prev, subcategoryId: '', attributeKey: '', attributeValue: '' }));
    }, [filters.categoryId]);

    // Fetch attributes when subcategory changes
    useEffect(() => {
        if (filters.subcategoryId) {
            fetchAttributes(filters.subcategoryId);
        } else {
            setAttributeKeys([]);
        }
        setFilters(prev => ({ ...prev, attributeKey: '', attributeValue: '' }));
    }, [filters.subcategoryId]);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFilters(prev => ({
                        ...prev,
                        userLocation: {
                            type: 'Point',
                            coordinates: [position.coords.longitude, position.coords.latitude]
                        }
                    }));
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setFilters(prev => ({
                        ...prev,
                        useLocation: false,
                        userLocation: null
                    }));
                }
            );
        }
    };

    const handleLocationToggle = (enabled) => {
        if (enabled && !filters.userLocation) {
            getUserLocation();
        }
        setFilters(prev => ({
            ...prev,
            useLocation: enabled
        }));
        setPage(DEFAULT_PAGE);
    };

    const fetchCategories = async () => {
        try {
            const response = await authAxiosClient.get('/category/all?level=0');
            setCategories(response.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const response = await authAxiosClient.get(`/category/all?parentId=${categoryId}&level=1`);
            setSubcategories(response.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch subcategories:', err);
        }
    };

    const fetchAttributes = async (subcategoryId) => {
        try {
            const response = await authAxiosClient.get(`/category/getAllKeyParamentbySubcategory/${subcategoryId}`);
            setAttributeKeys(response.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch attributes:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Prepare query parameters
            const params = {
                type: activeTab,
                page,
                limit,
                ...filters.categoryId && { categoryId: filters.categoryId },
                ...filters.subcategoryId && { subcategoryId: filters.subcategoryId },
                ...filters.attributeKey && filters.attributeValue && {
                    attributes: JSON.stringify([{
                        key: filters.attributeKey,
                        value: filters.attributeValue
                    }])
                },
                ...filters.useLocation && filters.userLocation && { location: JSON.stringify(filters.userLocation) },
                ...sortOption && {
                    sortBy: SORT_OPTIONS[sortOption].field,
                    sortOrder: SORT_OPTIONS[sortOption].order
                }
            };

            const response = await authAxiosClient.get('/product/productList', { params });
            setProducts(response.data?.data?.list || []);
            setTotal(response.data?.data?.total || 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(DEFAULT_PAGE);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(DEFAULT_PAGE);
    };

    const handleSortChange = (value) => {
        setSortOption(value);
        setPage(DEFAULT_PAGE);
    };

    const clearFilters = () => {
        setFilters({
            categoryId: '',
            subcategoryId: '',
            attributeKey: '',
            attributeValue: '',
            useLocation: false,
            userLocation: null
        });
        setSortOption('');
        setPage(DEFAULT_PAGE);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    const renderFilters = () => (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                    <Filter size={20} className="mr-2" />
                    Filters
                </h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        value={filters.categoryId}
                        onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subcategory Filter */}
                {filters.categoryId && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Subcategory</label>
                        <select
                            value={filters.subcategoryId}
                            onChange={(e) => handleFilterChange('subcategoryId', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="">All Subcategories</option>
                            {subcategories.map(sub => (
                                <option key={sub._id} value={sub._id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Attribute Filters */}
                {filters.subcategoryId && attributeKeys.length > 0 && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1">Attribute</label>
                            <select
                                value={filters.attributeKey}
                                onChange={(e) => handleFilterChange('attributeKey', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="">Select Attribute</option>
                                {attributeKeys.map(key => (
                                    <option key={key._id} value={key._id}>
                                        {key.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {filters.attributeKey && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Value</label>
                                <select
                                    value={filters.attributeValue}
                                    onChange={(e) => handleFilterChange('attributeValue', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="">Select Value</option>
                                    {attributeKeys
                                        .find(key => key._id === filters.attributeKey)
                                        ?.values.map(val => (
                                            <option key={val._id} value={val._id}>
                                                {val.value}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}
                    </>
                )}

                {/* Sort Options */}
                <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                        <SortDesc size={16} className="mr-1" />
                        Sort By
                    </label>
                    <select
                        value={sortOption}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="">Default</option>
                        {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Location Toggle */}
                <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                        <MapPin size={16} className="mr-1" />
                        Use Location
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="useLocation"
                            checked={filters.useLocation}
                            onChange={(e) => handleLocationToggle(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border rounded"
                        />
                        <label htmlFor="useLocation" className="text-sm text-gray-600">
                            Enable distance-based filtering
                        </label>
                    </div>
                </div>

                {/* Location Status */}
                {filters.useLocation && filters.userLocation && (
                    <div className="col-span-full">
                        <p className="text-sm text-gray-600 flex items-center">
                            <MapPin size={16} className="mr-1" />
                            Using your location for distance-based sorting
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderProductCard = (product) => {
        return (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Product Image */}
                <div className="relative h-48">
                    <img
                        src={product.images?.[0] || '/placeholder-image.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-sm rounded">
                        {product.type}
                    </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>

                    {/* Price Information */}
                    <div className="mb-2">
                        {product.type === PRODUCT_TYPE.SELL && (
                            <p className="text-green-600 font-bold">{formatPrice(product.price)}</p>
                        )}
                        {product.type === PRODUCT_TYPE.RENT && (
                            <div>
                                <p className="text-green-600 font-bold">
                                    {formatPrice(product.rentDetails?.rentPrice)} /month
                                </p>
                                <p className="text-sm text-gray-600">
                                    Security: {formatPrice(product.rentDetails?.securityAmount)}
                                </p>
                            </div>
                        )}
                        {product.type === PRODUCT_TYPE.AUCTION && (
                            <div>
                                <p className="text-green-600 font-bold">
                                    Starting bid: {formatPrice(product.auctionDetails?.startPrice)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Reserve: {formatPrice(product.auctionDetails?.reservePrice)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Additional Details */}
                    <div className="text-sm text-gray-600 mb-4">
                        <p>Condition: {product.condition}</p>
                        <p>Delivery: {product.deliveryMode?.replace('_', ' ')}</p>
                        {product.distance && (
                            <p className="flex items-center">
                                <MapPin size={14} className="mr-1" />
                                {(product.distance / 1000).toFixed(1)} km away
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => navigate(`/product/edit/${product._id}`)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => navigate(`/product/view/${product._id}`)}
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(total / limit);

        return (
            <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-600">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={page * limit >= total}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <button
                    onClick={() => navigate('/product/create')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Add Product
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {Object.values(PRODUCT_TYPE).map(type => (
                    <button
                        key={type}
                        onClick={() => handleTabChange(type)}
                        className={`px-6 py-3 text-sm font-medium ${activeTab === type
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Filters */}
            {renderFilters()}

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            ) : error ? (
                <div className="text-center text-red-600 py-8">
                    {error}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                    No {activeTab.toLowerCase()} products found.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(renderProductCard)}
                    </div>
                    {renderPagination()}
                </>
            )}
        </div>
    );
} 