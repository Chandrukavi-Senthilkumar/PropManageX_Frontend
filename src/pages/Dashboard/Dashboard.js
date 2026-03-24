import React, { useEffect, useState } from 'react';
import { 
  BuildingOfficeIcon, 
  HomeIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import AddPropertyModal from '../../components/Modals/AddPropertyModal';

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPropModal, setShowPropModal] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUnits: 0,
    occupancyRate: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getProperties();
      const items = response?.data?.data?.items;
      setProperties(Array.isArray(items) ? items : []);
      
      // Calculate stats financially from available fields
      if (Array.isArray(items)) {
        const totalUnits = items.reduce((sum, p) => sum + (p.totalUnits || 0), 0);

        // try reading occupied units from property level or from parsed developing pipeline
        const occupiedUnits = items.reduce((sum, p) => {
          if (typeof p.occupiedUnits === 'number') return sum + p.occupiedUnits;
          if (p.units && Array.isArray(p.units)) {
            return sum + p.units.filter(u => u.status && u.status.toLowerCase() === 'leased').length;
          }
          return sum;
        }, 0);

        const occupancyRate = totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

        const totalRevenue = items.reduce((sum, p) => {
          if (typeof p.monthlyRevenue === 'number') return sum + p.monthlyRevenue;
          return sum;
        }, 0);

        setStats({
          totalProperties: items.length,
          totalUnits,
          occupancyRate,
          totalRevenue
        });
      }
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyCreated = () => {
    setShowPropModal(false);
    fetchProperties();
  };

  const filteredProperties = properties.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Property Management</h1>
              <p className="text-slate-600 mt-1">Manage your portfolio and track performance</p>
            </div>
            <button
              onClick={() => setShowPropModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <BuildingOfficeIcon className="w-5 h-5" />
              Add Property
            </button>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-24 rounded-xl animate-skeleton" />
                ))}
              </div>
              <p className="mt-3 text-center text-slate-500 text-sm">Loading live metrics...</p>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Properties</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">{stats.totalProperties}</p>
                  </div>
                  <BuildingOfficeIcon className="w-12 h-12 text-blue-300" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Units</p>
                    <p className="text-3xl font-bold text-green-900 mt-1">{stats.totalUnits}</p>
                  </div>
                  <HomeIcon className="w-12 h-12 text-green-300" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Occupancy Rate</p>
                    <p className="text-3xl font-bold text-purple-900 mt-1">{stats.occupancyRate}%</p>
                  </div>
                  <ChartBarIcon className="w-12 h-12 text-purple-300" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-orange-900 mt-1">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
                  </div>
                  <CurrencyDollarIcon className="w-12 h-12 text-orange-300" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by property name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-4">Loading properties...</p>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No properties found</h3>
            <p className="text-slate-600 mt-1">Get started by adding your first property</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Your Properties</h2>
              <span className="text-sm text-slate-600">{filteredProperties.length} properties</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <PropertyCard
                  key={property.propertyID}
                  propertyID={property.propertyID}
                  name={property.name}
                  type={property.type}
                  location={property.location}
                  totalUnits={property.totalUnits || 0}
                  status={property.status}
                  imageUrl={property.imageUrl}
                  onImageClick={() => {
                    // Navigate to details
                  }}
                  onManageUnits={() => {
                    // Handle units
                  }}
                  onAddAmenity={() => {
                    // Handle amenity
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Property Modal */}
      {showPropModal && (
        <AddPropertyModal
          isOpen={showPropModal}
          onClose={() => setShowPropModal(false)}
          onPropertyCreated={handlePropertyCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
