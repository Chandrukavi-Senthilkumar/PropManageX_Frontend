import React, { useEffect, useState } from 'react';
import { 
  BuildingOfficeIcon, 
  HomeIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import AddPropertyModal from '../../components/Modals/AddPropertyModal';
import MyProperty from './MyProperty'; // Import the new component

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPropModal, setShowPropModal] = useState(false);
  const [currentView, setCurrentView] = useState("portfolio"); // 'portfolio' or 'myProperty'
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
      
      if (Array.isArray(items)) {
        const totalUnits = items.reduce((sum, p) => sum + (p.totalUnits || 0), 0);
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

  // HEADER REPLACEMENT: If My Property is active, show a back button
  if (currentView === "myProperty") {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 pt-8">
           <button 
             onClick={() => setCurrentView("portfolio")}
             className="flex items-center gap-2 text-blue-600 font-bold hover:underline mb-4"
           >
             <ArrowLeftIcon className="w-4 h-4" /> Back to Portfolio
           </button>
        </div>
        <MyProperty />
      </div>
    );
  }

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
            <div className="flex gap-3">
                <button
                    onClick={() => setCurrentView("myProperty")}
                    className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <HomeIcon className="w-5 h-5 text-purple-500" />
                    My Property
                </button>
                <button
                    onClick={() => setShowPropModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                    <BuildingOfficeIcon className="w-5 h-5" />
                    Add Property
                </button>
            </div>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <p className="text-blue-600 text-sm font-medium">Total Properties</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{stats.totalProperties}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <p className="text-green-600 text-sm font-medium">Total Units</p>
                <p className="text-3xl font-bold text-green-900 mt-1">{stats.totalUnits}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <p className="text-purple-600 text-sm font-medium">Occupancy Rate</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">{stats.occupancyRate}%</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <p className="text-orange-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative mb-8">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by property name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {loading ? (
           <div className="py-20 text-center text-slate-400">Loading your portfolio...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard key={property.propertyID} {...property} />
            ))}
          </div>
        )}
      </div>

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