import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Added to access profile
import {
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

import PropertyCard from '../../components/PropertyCard/PropertyCard';
import AddPropertyModal from '../../components/Modals/AddPropertyModal';
import AddUnitModal from '../../components/Modals/AddUnitModal';
import AddAmenityModal from '../../components/Modals/AddAmenityModal';
import Toast from '../../components/Toast/Toast';
import { propertyService } from '../../services/propertyService';

const ITEMS_PER_PAGE = 9;

const PropertyList = () => {
  const navigate = useNavigate();

  // 1. Get User Profile from Redux to check Role
  const { profile } = useSelector((state) => state.admin || {});
  const userRole = profile?.role; 

  // State
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showAmenityModal, setShowAmenityModal] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // 2. Load properties directly from service
  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      const res = await propertyService.getProperties();
      // Adjusting to your backend response structure: res.data.items
      setProperties(res?.data?.items || res?.data || []);
    } catch (error) {
      showToast("Failed to fetch properties", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  /* ================= FILTER LOGIC ================= */
  const filtered = properties.filter(p =>
    (!search || p.name?.toLowerCase().includes(search.toLowerCase())) &&
    (!location || p.location?.includes(location)) &&
    (!type || p.type === type)
  );

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProperties = filtered.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, type]);

  return (
    <div className="min-h-screen bg-[#F6F5F8]">
      {/* TOAST RENDERER */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* HERO SECTION */}
      <section className="bg-[#F3EEF2]">
        <div className="max-w-7xl mx-auto px-10 py-16 text-center">
          <h1 className="text-5xl font-extrabold text-[#1F2937] tracking-tight">
            Explore Properties
          </h1>
          <p className="mt-4 text-[#6B7280] max-w-2xl mx-auto font-medium">
            Browse, manage, and grow your real‑estate portfolio across cities,
            categories, and investment types — all in one place.
          </p>

          {/* ✅ ROLE RESTRICTION: Hide "Add Property" for Buyers and Tenants */}
          {userRole !== 'BuyerAndTenant' && userRole !== 'BuyerAndTenant' && (
            <button
              onClick={() => setShowAdd(true)}
              className="mt-10 inline-flex items-center gap-3
                         bg-[#a78ca6] text-white px-8 py-4 rounded-2xl
                         font-bold shadow-lg hover:bg-[#8e738d] transition-all active:scale-95"
            >
              <BuildingOffice2Icon className="w-5 h-5" />
              Add New Property
            </button>
          )}
        </div>
      </section>

      {/* SEARCH & FILTER BAR */}
      <section className="max-w-7xl mx-auto px-10 -mt-10 relative z-10">
        <div className="bg-white border border-gray-100 rounded-3xl px-8 py-6
                        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 shadow-xl">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search property name..."
              className="w-full pl-12 py-3 rounded-xl border border-gray-200 focus:border-[#a78ca6] focus:ring-2 focus:ring-[#a78ca6]/20 outline-none font-medium"
            />
          </div>

          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="py-3 rounded-xl px-4 border border-gray-200 focus:border-[#a78ca6] outline-none font-medium"
          >
            <option value="">All Locations</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
          </select>

          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="py-3 rounded-xl px-4 border border-gray-200 focus:border-[#a78ca6] outline-none font-medium"
          >
            <option value="">All Property Types</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
          </select>
        </div>
      </section>

      {/* PROPERTIES GRID */}
      <section className="max-w-7xl mx-auto px-10 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#a78ca6] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Portfolio...</p>
          </div>
        ) : paginatedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {paginatedProperties.map(p => (
                <PropertyCard
                  key={p.propertyID}
                  {...p}
                  userRole={userRole}
                  onImageClick={() => navigate(`/Property/${p.propertyID}`)}
                  onManageUnits={propertyID => {
                    setSelectedProperty(propertyID);
                    setShowUnitModal(true);
                  }}
                  onAddAmenity={propertyID => {
                    setSelectedProperty(propertyID);
                    setShowAmenityModal(true);
                  }}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-white border border-gray-200 disabled:opacity-30"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-5 py-2 rounded-xl font-bold text-sm transition ${
                        currentPage === page
                          ? 'bg-[#5B3E59] text-white shadow-2xl'
                          : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-white border border-gray-200 disabled:opacity-30"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
             <p className="text-gray-400 font-bold italic">No properties found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* MODALS */}
      <AddPropertyModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        refreshList={loadProperties}
        showToast={showToast}
      />

      <AddUnitModal
        isOpen={showUnitModal}
        onClose={() => setShowUnitModal(false)}
        propertyID={selectedProperty}
      />

      <AddAmenityModal
        isOpen={showAmenityModal}
        onClose={() => setShowAmenityModal(false)}
        propertyID={selectedProperty}
      />
    </div>
  );
};

export default PropertyList;