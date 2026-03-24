import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import PropertyDetailsView from './PropertyDetailsView';

const PropertyDetailsPage = () => {
    // 1. Get the ID from the URL (/properties/:id)
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                setLoading(true);
                const token = Cookies.get('accessToken');
                
                // Fetch the specific property by ID
                const response = await axios.get(`http://localhost:5154/api/Property/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });


                setProperty(response.data?.data || response.data);
            } catch (err) {
                console.error("Error fetching property details:", err);
                setError("Could not load property details. It may have been moved or deleted.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPropertyData();
        }
    }, [id]);

    // UI States
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-black animate-pulse uppercase tracking-widest text-xs">
                    Fetching Asset Data...
                </p>
            </div>
        );
    }



    // 2. Render the actual View once data is ready
    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <PropertyDetailsView 
                property={property} 
                onBack={() => navigate('/Property')} 
            />
        </div>
    );
};

export default PropertyDetailsPage;