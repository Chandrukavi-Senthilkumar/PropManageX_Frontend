import React, { useEffect, useState } from 'react';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import AddPropertyModal from '../../components/Modals/AddPropertyModal';
import AddUnitModal from '../../components/Modals/AddUnitModal';
import AddAmenityModal from '../../components/Modals/AddAmenityModal';
import PropertyDetailsView from '../PropertyDetailsView/PropertyDetailsView';

const PropertyList = () => {
    // --- State Management ---
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // View Switching: 'list' shows all cards, 'details' shows one property deep-dive
    const [viewMode, setViewMode] = useState('list'); 
    const [selectedProperty, setSelectedProperty] = useState(null);

    // Modal Visibility
    const [showPropModal, setShowPropModal] = useState(false);
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showAmenityModal, setShowAmenityModal] = useState(false);

    // --- Lifecycle ---
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await propertyService.getProperties();
            // Accessing nested data: axios.data -> api.data -> items
            const items = response?.data?.data?.items;
            setProperties(Array.isArray(items) ? items : []);
        } catch (err) {
            console.error("Failed to fetch properties:", err);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    // --- Action Handlers ---
    
    // Triggered only when clicking the image in PropertyCard
    const handleOpenDetails = (property) => {
        setSelectedProperty(property);
        setViewMode('details');
    };

    const handleQuickAddUnit = (propertyID) => {
        const prop = properties.find(p => p.propertyID === propertyID);
        setSelectedProperty(prop);
        setShowUnitModal(true);
    };

    const handleQuickAddAmenity = (propertyID) => {
        const prop = properties.find(p => p.propertyID === propertyID);
        setSelectedProperty(prop);
        setShowAmenityModal(true);
    };

    const filteredProperties = properties.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Conditional Rendering for Detail View ---
    if (viewMode === 'details' && selectedProperty) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen">
                <PropertyDetailsView 
                    property={selectedProperty} 
                    onBack={() => {
                        setViewMode('list');
                        fetchProperties(); // Refresh list in case data changed
                    }} 
                />
            </div>
        );
    }

    // --- Main List View Render ---
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Property Portfolio</h1>
                    <p className="text-gray-500 font-medium">Overview of your real estate assets and performance.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search properties..."
                            className="px-5 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 w-72 bg-white shadow-sm transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setShowPropModal(true)} 
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-2 active:scale-95"
                    >
                        <span>+</span> Add Property
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-opacity-25 border-t-blue-600"></div>
                    <p className="mt-4 text-gray-400 font-bold animate-pulse">Syncing Portfolio...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((property) => (
                            <PropertyCard
                                key={property.propertyID}
                                {...property}
                                onImageClick={() => handleOpenDetails(property)}
                                onManageUnits={(id) => handleQuickAddUnit(id)}
                                onAddAmenity={(id) => handleQuickAddAmenity(id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                            <div className="p-5 bg-gray-50 rounded-full mb-4">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <p className="text-gray-400 font-bold text-lg">No properties match your search.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Global Modals */}
            <AddPropertyModal
                isOpen={showPropModal}
                onClose={() => setShowPropModal(false)}
                refreshList={fetchProperties}
            />

            {/* These modals use selectedPropertyID to know which property they belong to */}
            <AddUnitModal
                isOpen={showUnitModal}
                onClose={() => setShowUnitModal(false)}
                propertyID={selectedProperty?.propertyID}
            />

            <AddAmenityModal 
                isOpen={showAmenityModal} 
                onClose={() => setShowAmenityModal(false)} 
                propertyID={selectedProperty?.propertyID} 
            />
        </div>
    );
};

export default PropertyList;