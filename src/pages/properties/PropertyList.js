import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  /* ✅ TOAST STATE (ADDED) */
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showAmenityModal, setShowAmenityModal] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await propertyService.getProperties();
      setProperties(res?.data?.items || []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filtered = properties.filter(p =>
    (!search || p.name?.toLowerCase().includes(search.toLowerCase())) &&
    (!location || p.location?.includes(location)) &&
    (!type || p.type === type)
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProperties = filtered.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, type]);

  return (
    <div className="min-h-screen bg-[#F6F5F8]">

      {/* ✅ TOAST RENDERER (ADDED) */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* HERO */}
      <section className="bg-[#F3EEF2]">
        <div className="max-w-7xl mx-auto px-10 py-16 text-center">
          <h1 className="text-5xl font-extrabold text-[#1F2937]">
            Explore Properties
          </h1>
          <p className="mt-4 text-[#6B7280] max-w-2xl mx-auto">
            Browse, manage, and grow your real‑estate portfolio across cities,
            categories, and investment types — all in one place.
          </p>

          <button
            onClick={() => setShowAdd(true)}
            className="mt-10 inline-flex items-center gap-3
                       bg-[#a78ca6]
                       text-white px-8 py-4 rounded-2xl
                       font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <BuildingOffice2Icon className="w-5 h-5" />
            Add New Property
          </button>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="max-w-7xl mx-auto px-10 -mt-10 relative z-10">
        <div
          className="bg-[#EFE9F0] rounded-3xl px-8 py-6
                     grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
                     shadow-lg hover:shadow-xl transition-all"
        >
          <div className="relative">
            <MagnifyingGlassIcon
              className="absolute left-4 top-1/2 -translate-y-1/2
                         w-5 h-5 text-gray-400"
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by property name"
              className="w-full pl-12 py-3 rounded-xl
                         border border-[#C9B6C8]
                         focus:border-[#5B3E59]
                         focus:ring-2 focus:ring-[#5B3E59]/40
                         outline-none"
            />
          </div>

          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="py-3 rounded-xl px-4
                       border border-[#C9B6C8]
                       focus:border-[#5B3E59]
                       focus:ring-2 focus:ring-[#5B3E59]/40"
          >
            <option value="">All Locations</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
          </select>

          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="py-3 rounded-xl px-4
                       border border-[#C9B6C8]
                       focus:border-[#5B3E59]
                       focus:ring-2 focus:ring-[#5B3E59]/40"
          >
            <option value="">All Property Types</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
          </select>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20 space-y-12 sm:space-y-16">
      {loading ? (
          <div className="text-center text-gray-400 font-semibold">
            Loading properties...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {paginatedProperties.map(p => (
                <PropertyCard
                  key={p.propertyID}
                  {...p}
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

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 flex-wrap">                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-white border border-gray-200
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 sm:px-5 py-2 rounded-xl font-semibold text-sm transition
                        ${
                          currentPage === page
                            ? 'bg-[#5B3E59] text-white shadow'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-white border border-gray-200
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
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