import React, { useEffect, useState } from 'react';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import AddPropertyModal from '../../components/Modals/AddPropertyModal';
import AddUnitModal from '../../components/Modals/AddUnitModal';
import AddAmenityModal from '../../components/Modals/AddAmenityModal';
import PropertyDetailsView from '../PropertyDetailsView/PropertyDetailsView';
import { MagnifyingGlassIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

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
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Conditional Rendering for Detail View ---
    if (viewMode === 'details' && selectedProperty) {
        return (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
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
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen animate-fadeIn">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">My Properties</h1>
                            <p className="text-slate-600 mt-1">Manage your portfolio and track all assets</p>
                        </div>
                        <button 
                            onClick={() => setShowPropModal(true)} 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 w-fit"
                        >
                            <BuildingOfficeIcon className="w-5 h-5" />
                            Add Property
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by property name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                        </div>
                        <p className="text-slate-600 font-semibold">Loading properties...</p>
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">
                                {filteredProperties.length === properties.length 
                                    ? `All Properties (${filteredProperties.length})` 
                                    : `Search Results (${filteredProperties.length})`
                                }
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProperties.map((property) => (
                                <PropertyCard
                                    key={property.propertyID}
                                    {...property}
                                    onImageClick={() => handleOpenDetails(property)}
                                    onManageUnits={(id) => handleQuickAddUnit(id)}
                                    onAddAmenity={(id) => handleQuickAddAmenity(id)}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BuildingOfficeIcon className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No properties found</h3>
                        <p className="text-slate-600 mb-6">
                            {searchTerm 
                                ? "Try adjusting your search criteria" 
                                : "Get started by adding your first property"
                            }
                        </p>
                        {!searchTerm && (
                            <button 
                                onClick={() => setShowPropModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                            >
                                <BuildingOfficeIcon className="w-4 h-4" />
                                Add Your First Property
                            </button>
                        )}
                    </div>
                )}
            </div>

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