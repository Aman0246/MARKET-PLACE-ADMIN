import React, { useState } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Crosshair, MapPin, Plus, Trash2 } from 'lucide-react';
import authAxiosClient from '../../api/authAxiosClient';
import useToast from '../../Component/ToastProvider/useToast';

const GOOGLE_MAPS_API_KEY = "AIzaSyD5mQuPg4TTUrxYtPj_T2ffvTECNftfJ_aw"; // Move to env
const libraries = ['places'];

export default function LocationManagement() {
    const { showToast } = useToast();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries,
    });



    const [autocomplete, setAutocomplete] = useState(null);

    // Function to extract address components
    const extractAddressComponents = (place) => {
        const addressComponents = {};
        place.address_components.forEach(component => {
            const type = component.types[0];
            switch (type) {
                case 'street_number':
                    addressComponents.streetNumber = component.long_name;
                    break;
                case 'route':
                    addressComponents.route = component.long_name;
                    break;
                case 'locality':
                    addressComponents.locality = component.long_name;
                    break;
                case 'administrative_area_level_1':
                    addressComponents.administrativeAreaLevel1 = component.long_name;
                    break;
                case 'country':
                    addressComponents.country = component.long_name;
                    break;
                case 'postal_code':
                    addressComponents.postalCode = component.long_name;
                    break;
            }
        });
        return addressComponents;
    };

    const onLoad = (autocomplete) => {
        setAutocomplete(autocomplete);
    };

    const onPlaceChanged = async () => {
        if (autocomplete !== null) {
            try {
                setLoading(true);
                const place = autocomplete.getPlace();

                if (!place.geometry) {
                    showToast('error', 'Please select a location from the dropdown');
                    return;
                }

                const addressComponents = extractAddressComponents(place);
                const payload = {
                    formattedAddress: place.formatted_address,
                    ...addressComponents,
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng(),
                    isDefault: addresses.length === 0 // Make default if first address
                };

                const response = await authAxiosClient.post('/userAddress', payload);

                if (response.data.success) {
                    showToast('success', 'Address added successfully');
                    setAddress('');
                    fetchAddresses();
                }
            } catch (error) {
                showToast('error', error.response?.data?.message || 'Failed to add address');
            } finally {
                setLoading(false);
            }
        }
    };

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
                            const addressComponents = extractAddressComponents(place);

                            const payload = {
                                formattedAddress: place.formatted_address,
                                ...addressComponents,
                                latitude,
                                longitude,
                                isDefault: addresses.length === 0
                            };

                            const saveResponse = await authAxiosClient.post('/userAddress', payload);

                            if (saveResponse.data.success) {
                                showToast('success', 'Address added successfully');
                                fetchAddresses();
                            }
                        }
                    } catch (error) {
                        showToast('error', error.response?.data?.message || 'Failed to add address');
                    } finally {
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
                    showToast('error', errorMessage);
                    setIsDetectingLocation(false);
                }
            );
        } else {
            const errorMessage = 'Geolocation is not supported by your browser';
            setLocationError(errorMessage);
            showToast('error', errorMessage);
            setIsDetectingLocation(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await authAxiosClient.get('/userAddress');

            if (!response.data.error) {
                setAddresses(response.data?.data);
            }
        } catch (error) {
            showToast('error', 'Failed to fetch addresses');
        }
    };

    // Fetch addresses on component mount
    React.useEffect(() => {
        fetchAddresses();
    }, []);

    if (loadError) {
        return <div className="text-red-500 p-4">Error loading Google Maps</div>;
    }

    if (!isLoaded) {
        return <div className="text-gray-500 p-4">Loading Google Maps...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-6">Manage Locations</h2>

                {/* Add New Address Section */}
                {/* <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Add New Address</h3>
                        <button
                            onClick={detectCurrentLocation}
                            disabled={isDetectingLocation}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <Crosshair className="w-4 h-4 mr-1" />
                            {isDetectingLocation ? 'Detecting...' : 'Use Current Location'}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <Autocomplete
                            onLoad={onLoad}
                            onPlaceChanged={onPlaceChanged}
                        >
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for a location"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </Autocomplete>

                        {locationError && (
                            <p className="text-red-500 text-sm">{locationError}</p>
                        )}
                    </div>
                </div> */}

                {/* Saved Addresses Section */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Saved Addresses</h3>
                    <div className="space-y-4">
                        {addresses && addresses.map((savedAddress) => (
                            <div
                                key={savedAddress._id}
                                className="border rounded-lg p-4 flex justify-between items-start"
                            >
                                <div>
                                    <p className="font-medium">
                                        {savedAddress.isDefault && (
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-2">
                                                Default
                                            </span>
                                        )}
                                        {savedAddress.formattedAddress}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {savedAddress.locality}, {savedAddress.administrativeAreaLevel1}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {/* Implement delete */ }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}

                        {addresses.length === 0 && (
                            <p className="text-gray-500 text-center py-4">
                                No saved addresses yet
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 