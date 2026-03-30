import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';

import PropertyCard from '../../components/PropertyCard/PropertyCard';
import AddPropertyModal from '../../components/Modals/AddPropertyModal';
import AddUnitModal from '../../components/Modals/AddUnitModal';
import AddAmenityModal from '../../components/Modals/AddAmenityModal';

import { MagnifyingGlassIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const PropertyList = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [showPropModal, setShowPropModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showAmenityModal, setShowAmenityModal] = useState(false);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await propertyService.getProperties();
      const items = data?.data?.items || data || [];

      setProperties(items);
    } catch (err) {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const filteredProperties = properties.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <p className="text-red-600">{error}</p>
          <button onClick={loadProperties}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white border-b p-6">
        <h1 className="text-3xl font-bold">My Properties</h1>

        <div className="relative mt-4">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 border rounded w-full"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowPropModal(true)}
        >
          <BuildingOfficeIcon className="w-5 h-5 inline mr-2" />
          Add Property
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.propertyID}
                {...property}
                onImageClick={() => navigate(`/Property/${property.propertyID}`)}
                onManageUnits={() => {
                  setSelectedProperty(property);
                  setShowUnitModal(true);
                }}
                onAddAmenity={() => {
                  setSelectedProperty(property);
                  setShowAmenityModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <AddPropertyModal
        isOpen={showPropModal}
        onClose={() => setShowPropModal(false)}
        refreshList={loadProperties}
      />

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