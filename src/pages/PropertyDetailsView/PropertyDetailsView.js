import React, { useEffect, useState } from 'react';
import { SaleService } from '../../services/dealService';
import { unitAmenityService } from '../../services/unitAmenityService';
import { contractService } from '../../services/contractService'; 
import {AddContractModal} from '../../components/Modals/ContractModal';
import { documentService } from '../../services/documentService';
import { 
    MapPinIcon, 
    BanknotesIcon, 
    PlusIcon, 
    ArrowLeftIcon,
    HomeIcon,
    UsersIcon,
    CalendarIcon,
    PhoneIcon,
    EnvelopeIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    DocumentCheckIcon
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
const PropertyDetailsView = ({ property, onBack }) => {
    const [units, setUnits] = useState([]);
    const [leads, setLeads] = useState([]);
    const [allVisits, setAllVisits] = useState([]);
    const [allDeals, setAllDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [activeTab, setActiveTab] = useState('units'); 

    const fetchData = async () => {
        try {
            setLoading(true);
            const [unitRes, leadRes] = await Promise.all([
                unitAmenityService.getUnits({ PropertyID: property.propertyID }),
                SaleService.getLeadsByProperty(property.propertyID)
            ]);
            
            const fetchedLeads = leadRes?.data || [];
            setUnits(unitRes?.data?.items || unitRes?.data || []);
            setLeads(fetchedLeads);

            const visitsPromises = fetchedLeads.map(l => SaleService.getSiteVisitsByLead(l.leadID));
            const dealsPromises = fetchedLeads.map(l => SaleService.getDealsByLead(l.leadID));
            
            const [visitsResults, dealsResults] = await Promise.all([
                Promise.all(visitsPromises),
                Promise.all(dealsPromises)
            ]);

            setAllVisits(visitsResults.flatMap((res, idx) => 
                (res?.data || []).map(v => ({ ...v, customerName: fetchedLeads[idx].customerName }))
            ));
            
            setAllDeals(dealsResults.flatMap((res, idx) => 
                (res?.data || []).map(d => ({ ...d, customerName: fetchedLeads[idx].customerName }))
            ));

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [property.propertyID]);
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
        <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                    <ArrowLeftIcon className="w-4 h-4" /> Back to Portfolio
                </button>
                <div className="flex bg-gray-100 p-1.5 rounded-[20px] shadow-inner overflow-x-auto">
                    <TabButton active={activeTab === 'units'} onClick={() => setActiveTab('units')} icon={<HomeIcon className="w-4 h-4"/>} label="Units" />
                    <TabButton active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} icon={<UsersIcon className="w-4 h-4"/>} label="Leads" />
                    <TabButton active={activeTab === 'visits'} onClick={() => setActiveTab('visits')} icon={<MapPinIcon className="w-4 h-4"/>} label="Visits" />
                </div>
                <button onClick={() => setShowLeadModal(true)} className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl active:scale-95 transition-all text-xs">
                    <PlusIcon className="w-4 h-4" /> Add Lead
                </button>
            </div>

            <div className="animate-fadeIn">
                {loading ? (
                    <div className="py-20 text-center animate-pulse">Syncing...</div>
                ) : (
                    <>
                        {activeTab === 'units' && <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{units.map(u => <UnitCard key={u.unitID} unit={u} />)}</div>}
                        {activeTab === 'leads' && <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{leads.map(l => <SimpleLeadCard key={l.leadID} lead={l} onUpdate={fetchData} />)}</div>}
                        {activeTab === 'visits' && <VisitsListView visits={allVisits} />}
                      
                    </>
                )}
            </div>

            <AddLeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} propertyID={property.propertyID} onSuccess={fetchData} />
        </div>
    );
};




// ... (Rest of components: TabButton, UnitCard, SimpleLeadCard, VisitsListView, EmptyState remain the same)
const SimpleLeadCard = ({ lead, onUpdate }) => {
    const [modals, setModals] = useState({ visit: false, deal: false });
    return (
        <div className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-900 text-white rounded-[24px] flex items-center justify-center text-2xl font-black">
                        {lead.customerName?.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-gray-900">{lead.customerName}</h4>
                        <div className="flex items-center gap-1 text-blue-600 font-bold text-[10px] uppercase">
                            <HomeIcon className="w-3 h-3" /> Unit: {lead.unitNumber || 'TBD'}
                        </div>
                    </div>
                </div>
                <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-3 rounded-2xl">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-bold">{lead.contactInfo || 'No phone'}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-3">
                <button onClick={() => setModals({...modals, visit: true})} className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"><MapPinIcon className="w-4 h-4" /> Visit</button>
                <button onClick={() => setModals({...modals, deal: true})} className="flex-1 bg-green-50 text-green-600 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white transition-all"><BanknotesIcon className="w-4 h-4" /> Deal</button>
            </div>
            <AddSiteVisitModal isOpen={modals.visit} onClose={() => setModals({...modals, visit: false})} leadID={lead.leadID} onSuccess={onUpdate} />
            <AddDealModal isOpen={modals.deal} onClose={() => setModals({...modals, deal: false})} leadID={lead.leadID} unitID={lead.unitID} onSuccess={onUpdate} />
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>
        {icon} {label}
    </button>
);

const EmptyState = ({ msg }) => (
    <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed text-center text-gray-400 italic font-bold">{msg}</div>
);

const UnitCard = ({ unit }) => (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black mb-4">{unit.unitNumber}</div>
        <h3 className="font-black text-xl text-gray-900">{unit.bedroomCount} BHK</h3>
        <p className="text-gray-400 font-bold text-xs uppercase mb-4">{unit.status || 'Available'}</p>
        <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
            <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Market Value</p>
                <p className="text-xl font-black text-blue-600">${unit.basePrice?.toLocaleString()}</p>
            </div>
        </div>
    </div>
);

const VisitsListView = ({ visits }) => (
    <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 uppercase text-[10px] font-black text-gray-400 tracking-widest">
                <tr><th className="px-8 py-6">Customer</th><th className="px-8 py-6">Visit Date</th><th className="px-8 py-6">Notes</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {visits.length > 0 ? visits.map((v, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-8 py-6 font-black text-gray-900">{v.customerName}</td>
                        <td className="px-8 py-6 font-bold text-blue-600 flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> {v.visitDate}</td>
                        <td className="px-8 py-6 text-gray-500 italic text-sm">"{v.notes}"</td>
                    </tr>
                )) : <tr><td colSpan="3" className="py-20 text-center"><EmptyState msg="No visits recorded." /></td></tr>}
            </tbody>
        </table>
    </div>
);

export default PropertyDetailsView;