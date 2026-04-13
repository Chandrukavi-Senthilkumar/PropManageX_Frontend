import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import AddPropertyModal from '../../components/Modals/AddPropertyModal';
import Toast from '../../components/Toast/Toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPropModal, setShowPropModal] = useState(false);

  // ✅ TOAST STATE
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    const res = await propertyService.getProperties();
    setProperties(res?.data?.items || []);
    setLoading(false);
  };

  const filtered = properties.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
    (!location || p.location.includes(location)) &&
    (!type || p.type === type)
  );

  return (
    <div className="bg-[#F5F3F7] min-h-screen">

      {/* ✅ TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ===== HERO ===== */}
      <div className="bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-white">
        <div className="max-w-7xl mx-auto px-8 py-14">
          <h1 className="text-4xl font-extrabold">Explore Properties</h1>
          <p className="text-gray-300 mt-3 max-w-xl">
            Discover premium commercial and residential properties designed for modern living.
          </p>

          <button
            onClick={() => setShowPropModal(true)}
            className="mt-6 bg-[#846E83] hover:bg-[#4A3248] px-6 py-3 rounded-xl font-bold inline-flex gap-2 items-center"
          >
            <BuildingOfficeIcon className="w-5 h-5" />
            Add Property
          </button>
        </div>
      </div>

      {/* ===== FILTER CARD ===== */}
      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-10">
        <div className="bg-[#EFE9F0] rounded-2xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              className="pl-10 w-full py-3 rounded-xl border"
              placeholder="Search by name or city"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="py-3 rounded-xl border px-4"
            value={location}
            onChange={e => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
          </select>

          <select
            className="py-3 rounded-xl border px-4"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
          </select>

          <button className="bg-[#1C1C1C] text-white rounded-xl font-semibold">
            Apply Filters
          </button>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {loading ? (
          <div className="text-center text-gray-400 font-bold py-20">
            Loading properties...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {filtered.map(p => (
              <PropertyCard
                key={p.propertyID}
                {...p}
                onImageClick={() => navigate(`/Property/${p.propertyID}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ MODAL WITH TOAST */}
      <AddPropertyModal
        isOpen={showPropModal}
        onClose={() => setShowPropModal(false)}
        refreshList={loadProperties}
        showToast={showToast}
      />
    </div>
  );
};

export default Dashboard;
