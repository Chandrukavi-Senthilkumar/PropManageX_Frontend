import React, { useEffect, useState } from 'react';
import { unitAmenityService } from '../../services/unitAmenityService';
import { documentService } from '../../services/documentService';
import { 
  HomeIcon, 
  SparklesIcon, 
  ArrowLeftIcon, 
  UserPlusIcon, 
  CalendarIcon, 
  BanknotesIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { AddLeadModal, AddSiteVisitModal, AddDealModal } from '../../components/Modals/SalesModel';
import EditPropertyModal from '../../components/Modals/EditPropertyModal';
import EditUnitModal from '../../components/Modals/EditUnitModal';
import DocumentModal from '../../components/Modals/DocumentModal';
import EditAmenityModal from '../../components/Modals/EditAmenityModal';

const PropertyDetailsView = ({ property, onBack, onPropertyUpdated }) => {
  const [units, setUnits] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedProperty, setUpdatedProperty] = useState(property);
  const [selectedUnitForEdit, setSelectedUnitForEdit] = useState(null);
  const [selectedAmenityForEdit, setSelectedAmenityForEdit] = useState(null);
  const [selectedDocumentForEdit, setSelectedDocumentForEdit] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Independent Modal States
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isDealOpen, setIsDealOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditUnitOpen, setIsEditUnitOpen] = useState(false);
  const [isEditAmenityOpen, setIsEditAmenityOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [unitRes, amenityRes, documentRes] = await Promise.all([
          unitAmenityService.getUnits({ PropertyID: property.propertyID }),
          unitAmenityService.getAmenities({ PropertyID: property.propertyID }),
          documentService.getDocuments({ EntityType: 'Property', EntityID: property.propertyID }),
        ]);
        
        // Handle potential .NET data wrapper variations
        const unitData = unitRes?.data?.items || unitRes?.data || [];
        const amenityData = amenityRes?.data?.items || amenityRes?.data || [];
        const documentData = documentRes?.data?.items || documentRes?.data || [];
        
        setUnits(Array.isArray(unitData) ? unitData : []);
        setAmenities(Array.isArray(amenityData) ? amenityData : []);
        setDocuments(Array.isArray(documentData) ? documentData : []);
      } catch (err) {
        console.error("Error fetching property details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [property.propertyID]);

  const handlePropertyUpdate = () => {
    setUpdatedProperty(property);
    onPropertyUpdated?.();
  };

  const handleUnitUpdate = () => {
    // Refresh units list
    const fetchUnits = async () => {
      try {
        const unitRes = await unitAmenityService.getUnits({ PropertyID: property.propertyID });
        const unitData = unitRes?.data?.items || unitRes?.data || [];
        setUnits(Array.isArray(unitData) ? unitData : []);
      } catch (err) {
        console.error("Error refreshing units:", err);
      }
    };
    fetchUnits();
    setIsEditUnitOpen(false);
  };

  const handleAmenityUpdate = () => {
    // Refresh amenities list
    const fetchAmenities = async () => {
      try {
        const amenityRes = await unitAmenityService.getAmenities({ PropertyID: property.propertyID });
        const amenityData = amenityRes?.data?.items || amenityRes?.data || [];
        setAmenities(Array.isArray(amenityData) ? amenityData : []);
      } catch (err) {
        console.error("Error refreshing amenities:", err);
      }
    };
    fetchAmenities();
    setIsEditAmenityOpen(false);
  };

  const handleDocumentUpdate = () => {
    // Refresh documents list
    const fetchDocuments = async () => {
      try {
        const documentRes = await documentService.getDocuments({ EntityType: 'Property', EntityID: property.propertyID });
        const documentData = documentRes?.data?.items || documentRes?.data || [];
        setDocuments(Array.isArray(documentData) ? documentData : []);
      } catch (err) {
        console.error("Error refreshing documents:", err);
      }
    };
    fetchDocuments();
    setIsEditDocumentOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-all w-fit"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to Portfolio
        </button>

        {/* Standalone Action Buttons */}
        <div className="flex flex-wrap gap-3">
            <button 
                onClick={() => setIsEditOpen(true)}
                className="bg-purple-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all flex items-center gap-2 active:scale-95"
            >
                <PencilSquareIcon className="w-4 h-4" /> Edit
            </button>
            <button 
                onClick={() => setIsLeadOpen(true)}
                className="bg-yellow-500 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-yellow-100 hover:bg-yellow-600 transition-all flex items-center gap-2 active:scale-95"
            >
                <UserPlusIcon className="w-4 h-4" /> New Lead
            </button>
            <button 
                onClick={() => setIsVisitOpen(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
            >
                <CalendarIcon className="w-4 h-4" /> Site Visit
            </button>
            <button 
                onClick={() => setIsDealOpen(true)}
                className="bg-green-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-2 active:scale-95"
            >
                <BanknotesIcon className="w-4 h-4" /> Create Deal
            </button>
        </div>
      </div>

      {/* Property Hero Card */}
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-10 animate-fadeIn">
        <div className="w-full lg:w-72 h-72 rounded-[32px] overflow-hidden bg-gray-100 shrink-0">
            <img 
                src={property.imageUrl || 'https://placehold.co/400x400?text=Property'} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                alt="" 
            />
        </div>
        <div className="flex-grow py-2">
          <div className="flex gap-2 mb-4">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{property.type}</span>
            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{property.status}</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">{property.name}</h2>
          <p className="text-gray-400 font-bold text-lg mb-8">{property.location}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Units</p>
              <p className="text-3xl font-black text-gray-800">{units.length}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Amenities</p>
              <p className="text-3xl font-black text-gray-800">{amenities.length}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Documents</p>
              <p className="text-3xl font-black text-gray-800">{documents.length}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Active Actions</p>
              <p className="text-3xl font-black text-gray-800">{(units.filter(u => u.status?.toLowerCase() === 'leased').length) || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Units Table */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><HomeIcon className="w-6 h-6" /></div>
            <h3 className="text-2xl font-black text-gray-800">Unit Inventory</h3>
          </div>
          
          {loading ? (
             <p className="py-10 text-center text-gray-400 font-bold animate-pulse">Loading units...</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-5 px-4">Unit #</th>
                  <th className="pb-5 px-4">Type</th>
                  <th className="pb-5 px-4">Price</th>
                  <th className="pb-5 px-4">Status</th>
                  <th className="pb-5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.unitID} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all">
                    <td className="py-5 px-4 font-black text-gray-800">{unit.unitNumber}</td>
                    <td className="py-5 px-4 text-gray-500 font-bold">{unit.bedroomCount} BHK</td>
                    <td className="py-5 px-4 font-black text-blue-600">${unit.basePrice?.toLocaleString()}</td>
                    <td className="py-5 px-4">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${unit.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {unit.status}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedUnitForEdit(unit);
                          setIsEditUnitOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm hover:bg-blue-50 px-3 py-1 rounded-lg transition-all"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Amenities List */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600"><SparklesIcon className="w-6 h-6" /></div>
            <h3 className="text-2xl font-black text-gray-800">Amenities</h3>
          </div>
          <div className="space-y-4">
            {amenities.map((amenity) => (
              <div key={amenity.amenityID} className="relative p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-purple-100 transition-all">
                <button
                  onClick={() => {
                    setSelectedAmenityForEdit(amenity);
                    setIsEditAmenityOpen(true);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>

                <p className="font-black text-gray-800">{amenity.name}</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><DocumentDuplicateIcon className="w-6 h-6" /></div>
              <h3 className="text-2xl font-black text-gray-800">Documents</h3>
            </div>
            <button
              onClick={() => {
                setSelectedDocumentForEdit(null);
                setIsEditDocumentOpen(true);
              }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              Upload Document
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-5 px-4">Type</th>
                  <th className="pb-5 px-4">Uploaded</th>
                  <th className="pb-5 px-4">Link</th>
                  <th className="pb-5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.documentID} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all">
                    <td className="py-5 px-4 font-black text-gray-800">{doc.documentType}</td>
                    <td className="py-5 px-4 text-gray-500 font-bold">{new Date(doc.uploadedDate).toLocaleDateString()}</td>
                    <td className="py-5 px-4 font-black text-blue-600">
                      <button
                        onClick={async () => {
                          try {
                            const blob = await documentService.downloadDocument(doc.documentID);
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            const fileName = doc.uri ? doc.uri.split('/').pop() : `document-${doc.documentID}`;
                            a.download = fileName;
                            a.click();
                            window.URL.revokeObjectURL(url);
                          } catch (err) {
                            console.error('Download failed:', err);
                            alert('Failed to download document.');
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        Download
                      </button>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDocumentForEdit(doc);
                          setIsEditDocumentOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm hover:bg-blue-50 px-3 py-1 rounded-lg transition-all mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete this document?')) return;
                          try {
                            await documentService.deleteDocument(doc.documentID);
                            handleDocumentUpdate();
                          } catch (err) {
                            console.error('Delete failed:', err);
                            alert('Failed to delete document.');
                          }
                        }}
                        className="text-red-600 hover:text-red-800 font-bold text-sm hover:bg-red-50 px-3 py-1 rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- STANDALONE MODALS --- */}
      <EditPropertyModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        property={updatedProperty} 
        onSuccess={handlePropertyUpdate}
      />

      <EditUnitModal 
        isOpen={isEditUnitOpen} 
        onClose={() => setIsEditUnitOpen(false)} 
        unit={selectedUnitForEdit} 
        onSuccess={handleUnitUpdate}
      />

      <EditAmenityModal
        isOpen={isEditAmenityOpen}
        onClose={() => setIsEditAmenityOpen(false)}
        amenity={selectedAmenityForEdit}
        onSuccess={handleAmenityUpdate}
      />

      <DocumentModal
        isOpen={isEditDocumentOpen}
        onClose={() => setIsEditDocumentOpen(false)}
        document={selectedDocumentForEdit}
        entityType="Property"
        entityId={property.propertyID}
        onSuccess={handleDocumentUpdate}
      />

      <AddLeadModal 
        isOpen={isLeadOpen} 
        onClose={() => setIsLeadOpen(false)} 
        propertyID={property.propertyID} 
      />
      
      {/* null allows user to input Lead ID manually */}
      <AddSiteVisitModal 
        isOpen={isVisitOpen} 
        onClose={() => setIsVisitOpen(false)} 
        leadID={null}
      />
      
      {/* null allows user to input Lead ID manually */}
      <AddDealModal 
        isOpen={isDealOpen} 
        onClose={() => setIsDealOpen(false)} 
        leadID={null}
      />
    </div>
  );
};

export default PropertyDetailsView;