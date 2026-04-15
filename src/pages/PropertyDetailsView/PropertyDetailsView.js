import { useEffect, useState } from 'react';
import {
  MapPinIcon,
  BanknotesIcon,
  ArrowLeftIcon,
  HomeIcon,
  DocumentTextIcon,
  XMarkIcon,
  SparklesIcon,
  UserPlusIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { AddLeadModal } from '../../components/Modals/SalesModel';
import { bookingService } from '../../services/bookingService';

/* ================= BOOKING CONFIRM MODAL ================= */
const BookingConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-[#FEF8FA] rounded-[40px] w-full max-w-md p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="text-center space-y-4 mt-4">
          <div className="w-16 h-16 bg-[#F3EEF2] text-[#5B3E59] rounded-full flex items-center justify-center mx-auto mb-6">
            <BanknotesIcon className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-[#1F2937]">
            Market Value Notice
          </h2>

          <p className="text-[#6B7280] leading-relaxed">
            This is the market value of this unit. If you need to negotiate the
            amount, please contact the administrator.
          </p>

          <div className="flex gap-3 pt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white text-gray-500 rounded-2xl font-semibold shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm} style={{color:'#FFFFFF'}}
              className="flex-1 py-3 bg-[#5B3E59] text-white rounded-2xl font-semibold hover:bg-[#4A3248]"
            >
              OK, Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN VIEW ================= */
const PropertyDetailsView = ({
  property,
  units: externalUnits = [],
  amenities: externalAmenities = [],
  documents: externalDocuments = [],
  onBack,
  onEditProperty,
  onEditUnit,
  onEditAmenity,
  onEditDocument,
  onUploadDocument,
  showToast, // ✅ same toast system
}) => {
  const [units, setUnits] = useState(externalUnits);
  const [amenities, setAmenities] = useState(externalAmenities);
  const [documents, setDocuments] = useState(externalDocuments);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [activeTab, setActiveTab] = useState('units');
  const [bookingModal, setBookingModal] = useState({ isOpen: false, unitID: null });

  useEffect(() => setUnits(externalUnits), [externalUnits]);
  useEffect(() => setAmenities(externalAmenities), [externalAmenities]);
  useEffect(() => setDocuments(externalDocuments), [externalDocuments]);

  const openBookingModal = unitID => {
    setBookingModal({ isOpen: true, unitID });
  };

  /* ✅ TOAST ONLY — NO ALERT */
  const confirmBooking = async () => {
    try {
      await bookingService.bookUnit(bookingModal.unitID);

      setUnits(prev =>
        prev.map(unit =>
          unit.unitID === bookingModal.unitID
            ? { ...unit, isBooked: true, status: 'Booked' }
            : unit
        )
      );

      setBookingModal({ isOpen: false, unitID: null });

      setTimeout(() => {
        showToast?.('Unit booked successfully!', 'success');
      }, 0);

    } catch (err) {
      setBookingModal({ isOpen: false, unitID: null });

      setTimeout(() => {
        showToast?.(
          err.response?.data?.message || 'Already booked',
          'error'
        );
      }, 0);
    }
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#5B3E59] font-semibold hover:underline"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to Portfolio
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setShowLeadModal(true)} style={{color:'#FFFFFF'}}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#5B3E59] text-white font-semibold hover:bg-[#5B3E59]"
          >
            <UserPlusIcon className="w-4 h-4" />
            Add Lead
          </button>

          <button
            onClick={onEditProperty} style={{color:'#FFFFFF'}}
            className="bg-[#5B3E59] text-white px-5 py-2 rounded-xl font-semibold hover:bg-[#4A3248]"
          >
            Edit Property
          </button>
        </div>
      </div>

      {/* PROPERTY CARD */}
      <div className="bg-[#FEF8FA] rounded-[32px] shadow-lg p-8">
        <h1 className="text-2xl font-extrabold text-[#1F2937]">
          {property?.name}
        </h1>
        <p className="flex items-center gap-1 text-sm text-[#6B7280] mt-2">
          <MapPinIcon className="w-4 h-4" />
          {property?.location} • {property?.type}
        </p>
         {/* NEW IMAGE SECTION */}
  {property?.imageUrl && (
    <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-stone-100">
      <img
        src={property.imageUrl}
        alt={property.name}
        className="w-full h-full object-cover"
      />
      {/* Subtle overlay to match your theme */}
      <div className="absolute inset-0 bg-black/5" />
    </div>
  )}
      </div>
     
      {/* TABS */}
      <div className="flex gap-3 bg-[#FEF8FA] p-2 rounded-[24px] shadow-md">
        <TabButton
          active={activeTab === 'units'}
          onClick={() => setActiveTab('units')}
          icon={<HomeIcon className="w-4 h-4" />}
          label={`Units (${units.length})`}
        />
        <TabButton
          active={activeTab === 'amenities'}
          onClick={() => setActiveTab('amenities')}
          icon={<SparklesIcon className="w-4 h-4" />}
          label={`Amenities (${amenities.length})`}
        />
        <TabButton
          active={activeTab === 'documents'}
          onClick={() => setActiveTab('documents')}
          icon={<DocumentTextIcon className="w-4 h-4" />}
          label={`Documents (${documents.length})`}
        />
      </div>

      {/* ================= UNITS ================= */}
      {activeTab === 'units' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map(unit => {
            const isBooked = unit.isBooked || unit.status === 'Booked';

            return (
              <div
                key={unit.unitID}
                className="bg-[#FEF8FA] rounded-3xl shadow-lg p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-extrabold">
                    Unit {unit.unitNumber}
                  </h3>

                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      isBooked
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {isBooked ? 'Booked' : 'Available'}
                  </span>
                </div>

                <div className="text-xl font-bold text-[#5B3E59] text-center">
                  ₹ {unit.basePrice?.toLocaleString('en-IN')}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => onEditUnit(unit)}
                    className="flex-1 py-2 rounded-xl bg-[#F3EEF2] font-semibold"
                  >
                    Edit
                  </button>

                  {!isBooked && (
                    <button
                      onClick={() => openBookingModal(unit.unitID)} style={{color:'#FFFFFF'}}
                      className="flex-1 py-2 rounded-xl bg-[#5B3E59] text-white font-semibold"
                    >
                      Book
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= AMENITIES ================= */}
      {activeTab === 'amenities' && (
        <div className="bg-[#FEF8FA] rounded-[32px] shadow-lg p-8">
          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-widest text-[#6B7280]">
              <tr>
                <th className="py-3">Amenity</th>
                <th className="py-3">Description</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {amenities.map(amenity => (
                <tr
                  key={amenity.amenityID}
                  className="hover:bg-white/60"
                >
                  <td className="py-3">{amenity.name}</td>
                  <td className="py-3">{amenity.description}</td>
                  <td className="py-3">
                    <button
                      onClick={() => onEditAmenity(amenity)}
                      className="text-[#5B3E59] font-semibold text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= DOCUMENTS ================= */}
      {activeTab === 'documents' && (
        <div className="bg-[#FEF8FA] rounded-[32px] shadow-lg p-8 space-y-6 overflow-x-auto">
          <div className="flex justify-end">
            <button
              onClick={onUploadDocument} style={{color:'#FFFFFF'}}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#5B3E59] text-white font-semibold"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              Upload Document
            </button>
          </div>

          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-widest text-[#6B7280]">
              <tr>
                <th className="py-3">Type</th>
                <th className="py-3">File</th>
                <th className="py-3">Uploaded</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.documentID} className="hover:bg-white/60">
                  <td className="py-3">{doc.documentType}</td>
                  <td 
                    className="py-3 text-[#5B3E59] underline cursor-pointer"
                    onClick={() =>
                      window.open(
                        `http://localhost:5154/api/Document/${doc.documentID}/download`,
                        '_blank'
                      )
                    }
                  >
                    View
                  </td>
                  <td className="py-3">
                    {new Date(doc.uploadedDate).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => onEditDocument(doc)}
                      className="text-[#5B3E59] font-semibold text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddLeadModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        propertyID={property.propertyID}
      />

      <BookingConfirmModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, unitID: null })}
        onConfirm={confirmBooking}
      />
    </div>
  );
};

export default PropertyDetailsView;

/* ================= TAB BUTTON ================= */
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-semibold transition ${
      active
        ? 'bg-white text-[#1F2937] shadow-md'
        : 'text-[#6B7280] hover:bg-white/60'
    }`}
  >
    {icon} {label}
  </button>
);