import React, { useEffect, useState } from 'react';
import { SaleService } from '../../services/dealService';
import { unitAmenityService } from '../../services/unitAmenityService';
import {
    MapPinIcon,
    BanknotesIcon,
    PlusIcon,
    ArrowLeftIcon,
    HomeIcon,
    DocumentTextIcon,
    XMarkIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { AddLeadModal } from '../../components/Modals/SalesModel';

// NEW: Booking Confirmation Modal Component
const BookingConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
            <div className="bg-white rounded-[40px] w-full max-w-md p-8 relative shadow-2xl border border-gray-100 animate-fadeIn">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="text-center space-y-4 mt-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BanknotesIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-black text-gray-800 tracking-tight">Market Value Notice</h2>
                    <p className="text-gray-500 leading-relaxed font-medium">
                        This is the market value of this unit. If you need to negotiate the amount, please contact the respective administrator.
                    </p>
                    <div className="flex gap-3 pt-6">
                        <button onClick={onClose} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                            OK, Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PropertyDetailsView = ({ property, units: externalUnits = [], amenities: externalAmenities = [], documents: externalDocuments = [], onBack, onEditProperty, onEditUnit, onEditAmenity, onEditDocument, onUploadDocument }) => {
    const [units, setUnits] = useState(externalUnits);
    const [amenities, setAmenities] = useState(externalAmenities);
    const [documents, setDocuments] = useState(externalDocuments);
    const [loading, setLoading] = useState(true);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [activeTab, setActiveTab] = useState('units');
    
    // Track bookings locally for this session
    const [bookedUnits, setBookedUnits] = useState({});
    const [bookingModal, setBookingModal] = useState({ isOpen: false, unitID: null });

    const openBookingModal = (unitID) => {
        setBookingModal({ isOpen: true, unitID });
    };

    const confirmBooking = async () => {
        if (bookingModal.unitID) {
            // 1. Update UI state immediately
            setBookedUnits(prev => ({ ...prev, [bookingModal.unitID]: true }));
            setBookingModal({ isOpen: false, unitID: null });
            
            // Note: If you have an API to update status, call it here:
            // await unitAmenityService.updateUnitStatus(bookingModal.unitID, "Booked");
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const unitRes = externalUnits.length ? null : await unitAmenityService.getUnits({ PropertyID: property.propertyID });
            const amenityRes = externalAmenities.length ? null : await unitAmenityService.getAmenities({ PropertyID: property.propertyID });
            const leadRes = await SaleService.getLeadsByProperty(property.propertyID);

            setUnits(externalUnits.length ? externalUnits : unitRes?.data?.items || unitRes?.data || []);
            setAmenities(externalAmenities.length ? externalAmenities : amenityRes?.data?.items || amenityRes?.data || []);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!property?.propertyID) return;
        fetchData();
    }, [property?.propertyID]);

    useEffect(() => { setUnits(externalUnits); }, [externalUnits]);
    useEffect(() => { setAmenities(externalAmenities); }, [externalAmenities]);
    useEffect(() => { setDocuments(externalDocuments); }, [externalDocuments]);

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                    <ArrowLeftIcon className="w-4 h-4" /> Back to Portfolio
                </button>
                <button onClick={onEditProperty} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">
                    Edit Property
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <h1 className="text-2xl font-extrabold text-gray-900">{property?.name}</h1>
                        <p className="text-sm text-gray-500 mt-1">{property?.location} • {property?.type}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase text-gray-400 tracking-widest">Status</p>
                        <p className="text-lg font-black text-blue-700">{property?.status}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3">
                <div className="flex bg-gray-100 p-1.5 rounded-[20px] shadow-inner">
                    <TabButton active={activeTab === 'units'} onClick={() => setActiveTab('units')} icon={<HomeIcon className="w-4 h-4" />} label={`Units (${units.length})`} />
                    <TabButton active={activeTab === 'amenities'} onClick={() => setActiveTab('amenities')} icon={<SparklesIcon className="w-4 h-4" />} label={`Amenities (${amenities.length})`} />
                    <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} icon={<DocumentTextIcon className="w-4 h-4" />} label={`Documents (${documents.length})`} />
                </div>
                
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowLeadModal(true)} className="bg-gray-900 text-white px-4 py-2 rounded-2xl font-semibold text-xs flex items-center gap-2 hover:bg-black transition-all shadow-sm">
                        <PlusIcon className="w-3 h-3" /> Add Lead
                    </button>
                    <button onClick={onUploadDocument} className="bg-green-600 text-white px-4 py-2 rounded-2xl font-semibold text-xs hover:bg-green-700 transition-all shadow-sm">
                        Upload Document
                    </button>
                </div>
            </div>

            <div className="animate-fadeIn">
                {loading ? (
                    <div className="py-20 text-center animate-pulse font-bold text-gray-400">Loading details...</div>
                ) : (
                    <>
                        {activeTab === 'units' && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {units.length ? units.map(u => {
                                    // Check if the unit is locally booked or has a booked status from the API
                                    const isBooked = !!bookedUnits[u.unitID] || u.status?.toLowerCase() === 'booked';
                                    return (
                                        <UnitCard 
                                            key={u.unitID} 
                                            unit={u} 
                                            onEdit={() => onEditUnit(u)} 
                                            isBooked={isBooked} 
                                            onBook={() => openBookingModal(u.unitID)} 
                                        />
                                    );
                                }) : <EmptyState msg="No units yet" />}
                            </div>
                        )}

                        {activeTab === 'amenities' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {amenities.length ? amenities.map(a => (
                                    <AmenityCard key={a.amenityID} amenity={a} onEdit={() => onEditAmenity(a)} />
                                )) : <EmptyState msg="No amenities yet" />}
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
                                {documents.length ? (
                                    <table className="w-full text-left">
                                        <thead className="text-xs uppercase tracking-widest text-gray-400 border-b border-gray-200">
                                            <tr><th className="py-3">Type</th><th className="py-3">File</th><th className="py-3">Uploaded</th><th className="py-3">Actions</th></tr>
                                        </thead>
                                        <tbody>
                                            {documents.map((doc) => (
                                                <tr key={doc.documentID} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 text-sm text-gray-700">{doc.documentType}</td>
                                                    <td className="py-3 text-sm text-blue-600 underline cursor-pointer" onClick={() => window.open(`http://localhost:5154/api/Document/${doc.documentID}/download`, '_blank')}>
                                                        {doc.fileName || 'View'}
                                                    </td>
                                                    <td className="py-3 text-sm text-gray-500">{new Date(doc.uploadedDate || Date.now()).toLocaleDateString()}</td>
                                                    <td className="py-3 flex gap-2">
                                                        <button className="px-3 py-1 text-xs border border-blue-200 text-blue-600 rounded-xl" onClick={() => onEditDocument(doc)}>Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <EmptyState msg="No documents yet" />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* MODALS */}
            <AddLeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} propertyID={property.propertyID} onSuccess={fetchData} />
            
            <BookingConfirmModal 
                isOpen={bookingModal.isOpen} 
                onClose={() => setBookingModal({ isOpen: false, unitID: null })} 
                onConfirm={confirmBooking} 
            />
        </div>
    );
};

// HELPER COMPONENTS
const AmenityCard = ({ amenity, onEdit }) => (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
        <button onClick={onEdit} className="absolute top-4 right-4 text-[10px] font-bold text-blue-600 uppercase">Edit</button>
        <h3 className="text-lg font-black text-gray-900">{amenity.name}</h3>
        <p className="mt-2 text-sm text-gray-500">{amenity.description}</p>
    </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[11px] font-black transition-all whitespace-nowrap ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>
        {icon} {label}
    </button>
);

const EmptyState = ({ msg }) => (
    <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed text-center text-gray-400 italic font-bold">{msg}</div>
);

const UnitCard = ({ unit, onEdit, isBooked, onBook }) => (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
        <button onClick={onEdit} className="absolute top-4 right-4 text-[10px] font-bold text-blue-600 uppercase">Edit</button>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black mb-4 tracking-tighter">
            {unit.unitNumber}
        </div>
        <h3 className="font-black text-xl text-gray-900">{unit.bedroomCount} BHK</h3>
        <p className={`text-[10px] font-black uppercase mb-4 tracking-widest ${isBooked ? 'text-orange-600' : 'text-gray-400'}`}>
            {isBooked ? 'Booked' : unit.status || 'Available'}
        </p>
        <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
            <div>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Market Value</p>
                <p className="text-xl font-black text-blue-600 leading-none mt-1">₹{unit.basePrice?.toLocaleString()}</p>
            </div>
            <button 
                onClick={onBook}
                disabled={isBooked}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${
                    isBooked 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                {isBooked ? 'Booked' : 'Book'}
            </button>
        </div>
    </div>
);

export default PropertyDetailsView;