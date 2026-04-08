import { useEffect, useState } from 'react';
import { SaleService } from '../../services/dealService';
import { unitAmenityService } from '../../services/unitAmenityService';
import { bookingService } from '../../services/bookingService';
import {
  MapPinIcon,
  BanknotesIcon,
  ArrowLeftIcon,
  HomeIcon,
  PlusIcon,
  DocumentTextIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { AddLeadModal } from '../../components/Modals/SalesModel';

/* ================= BOOKING CONFIRM MODAL (STYLE ONLY) ================= */
const BookingConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-[#FEF8FA] rounded-[40px] w-full max-w-md p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black">
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
            This is the market value of this unit. If you need to negotiate the amount,
            please contact the administrator.
          </p>

          <div className="flex gap-3 pt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white text-gray-500 rounded-2xl font-semibold shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
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
  onUploadDocument
}) => {
  const [units, setUnits] = useState(externalUnits);
  const [amenities, setAmenities] = useState(externalAmenities);
  const [documents, setDocuments] = useState(externalDocuments);
  const [loading, setLoading] = useState(true);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [activeTab, setActiveTab] = useState('units');
  const [bookingModal, setBookingModal] = useState({ isOpen: false, unitID: null });

  const openBookingModal = (unitID) => {
    setBookingModal({ isOpen: true, unitID });
  };

  const confirmBooking = async () => {
    try {
      await bookingService.bookUnit(bookingModal.unitID);
      setBookingModal({ isOpen: false, unitID: null });
    } catch (err) {
      alert(err.response?.data?.message || 'Already booked');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const unitRes = externalUnits.length ? null : await unitAmenityService.getUnits({ PropertyID: property.propertyID });
      const amenityRes = externalAmenities.length ? null : await unitAmenityService.getAmenities({ PropertyID: property.propertyID });
      await SaleService.getLeadsByProperty(property.propertyID);

      setUnits(externalUnits.length ? externalUnits : unitRes?.data?.items || []);
      setAmenities(externalAmenities.length ? externalAmenities : amenityRes?.data?.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!property?.propertyID) return;
    fetchData();
  }, [property?.propertyID]);

  useEffect(() => setUnits(externalUnits), [externalUnits]);
  useEffect(() => setAmenities(externalAmenities), [externalAmenities]);
  useEffect(() => setDocuments(externalDocuments), [externalDocuments]);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-[#5B3E59] font-semibold hover:underline">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Portfolio
        </button>
        <button
          onClick={onEditProperty}
          className="bg-[#5B3E59] text-white px-5 py-2 rounded-xl font-semibold hover:bg-[#4A3248]"
        >
          Edit Property
        </button>
      </div>

      {/* PROPERTY CARD */}
      <div className="bg-[#FEF8FA] rounded-[32px] shadow-lg p-8">
        <h1 className="text-2xl font-extrabold text-[#1F2937]">{property?.name}</h1>
        <p className="flex items-center gap-1 text-sm text-[#6B7280] mt-2">
          <MapPinIcon className="w-4 h-4" />
          {property?.location} • {property?.type}
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 bg-[#FEF8FA] p-2 rounded-[24px] shadow-md">
        <TabButton active={activeTab === 'units'} onClick={() => setActiveTab('units')} icon={<HomeIcon className="w-4 h-4" />} label={`Units (${units.length})`} />
        <TabButton active={activeTab === 'amenities'} onClick={() => setActiveTab('amenities')} icon={<SparklesIcon className="w-4 h-4" />} label={`Amenities (${amenities.length})`} />
        <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} icon={<DocumentTextIcon className="w-4 h-4" />} label={`Documents (${documents.length})`} />
      </div>

      {/* CONTENT */}
      {activeTab === 'units' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {units.map(u => {
            const isBooked = u.isBooked === true || u.status === 'Booked';
            return (
              <UnitCard
                key={u.unitID}
                unit={u}
                onEdit={() => onEditUnit(u)}
                isBooked={isBooked}
                onBook={() => openBookingModal(u.unitID)}
              />
            );
          })}
        </div>
      )}

      {activeTab === 'amenities' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {amenities.map(a => (
            <AmenityCard key={a.amenityID} amenity={a} onEdit={() => onEditAmenity(a)} />
          ))}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-[#FEF8FA] rounded-[32px] shadow-lg p-8 overflow-x-auto">
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
                <tr key={doc.documentID} className="hover:bg-white/60 transition">
                  <td className="py-3">{doc.documentType}</td>
                  <td className="py-3 text-[#5B3E59] underline cursor-pointer"
                      onClick={() => window.open(`http://localhost:5154/api/Document/${doc.documentID}/download`, '_blank')}>
                    View
                  </td>
                  <td className="py-3">{new Date(doc.uploadedDate).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button onClick={() => onEditDocument(doc)} className="text-[#5B3E59] font-semibold text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddLeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} propertyID={property.propertyID} />

      <BookingConfirmModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, unitID: null })}
        onConfirm={confirmBooking}
      />
    </div>
  );
};

/* ================= HELPERS ================= */
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-semibold transition
      ${active ? 'bg-white text-[#1F2937] shadow-md' : 'text-[#6B7280] hover:bg-white/60'}`}
  >
    {icon} {label}
  </button>
);

const AmenityCard = ({ amenity, onEdit }) => (
  <div className="bg-[#FEF8FA] rounded-[32px] shadow-lg p-8 relative">
    <button onClick={onEdit} className="absolute top-6 right-6 text-sm font-semibold text-[#5B3E59]">
      EDIT
    </button>
    <h3 className="text-2xl font-bold text-[#1F2937]">{amenity.name}</h3>
    <p className="mt-4 text-[#6B7280]">{amenity.description}</p>
  </div>
);

const UnitCard = ({ unit, onEdit, isBooked, onBook }) => (
  <div className="bg-[#FEF8FA] rounded-[32px] shadow-lg p-8 relative">
    <button onClick={onEdit} className="absolute top-6 right-6 text-sm font-semibold text-[#5B3E59]">
      EDIT
    </button>

    <h3 className="text-xl font-bold text-[#1F2937] mb-6">{unit.unitNumber}</h3>

    <div className="text-center space-y-1">
      <p className="text-3xl font-extrabold text-[#1F2937]">{unit.bedroomCount} BHK</p>
      <p className={`text-xs uppercase tracking-wider font-semibold ${isBooked ? 'text-orange-600' : 'text-[#6B7280]'}`}>
        {isBooked ? 'Booked' : unit.status}
      </p>
    </div>

    <div className="mt-8 flex justify-between items-end">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#6B7280]">Market Value</p>
        <p className="text-2xl font-bold text-[#1F2937]">
          ₹{unit.basePrice?.toLocaleString()}
        </p>
      </div>

      <button
        onClick={onBook}
        disabled={isBooked}
        className={`px-6 py-3 rounded-xl text-sm font-semibold transition
          ${
            isBooked
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#5B3E59] text-white hover:bg-[#4A3248]'
          }`}
      >
        {isBooked ? 'Booked' : 'Book'}
      </button>
    </div>
  </div>
);

export default PropertyDetailsView;