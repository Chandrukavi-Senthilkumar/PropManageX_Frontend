import { useEffect, useState } from 'react';
import { SaleService } from '../../services/dealService';
import { unitAmenityService } from '../../services/unitAmenityService';
import {
    MapPinIcon,
    BanknotesIcon,
    ArrowLeftIcon,
    HomeIcon,
    PhoneIcon,
    DocumentTextIcon,
    SparklesIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { AddLeadModal, AddSiteVisitModal, AddDealModal } from '../../components/Modals/SalesModel';

const PropertyDetailsView = ({ property, units: externalUnits = [], amenities: externalAmenities = [], documents: externalDocuments = [], onBack, onEditProperty, onEditUnit, onEditAmenity, onEditDocument, onUploadDocument }) => {
    const [units, setUnits] = useState(externalUnits);
    const [amenities, setAmenities] = useState(externalAmenities);
    const [documents, setDocuments] = useState(externalDocuments);
    const [leads, setLeads] = useState([]);
    const [allVisits, setAllVisits] = useState([]);
    const [allDeals, setAllDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [activeTab, setActiveTab] = useState('units');

    const fetchData = async () => {
        try {
            setLoading(true);

            const unitRes = externalUnits.length ? null : await unitAmenityService.getUnits({ PropertyID: property.propertyID });
            const amenityRes = externalAmenities.length ? null : await unitAmenityService.getAmenities({ PropertyID: property.propertyID });
            const leadRes = await SaleService.getLeadsByProperty(property.propertyID);

            setUnits(externalUnits.length ? externalUnits : unitRes?.data?.items || unitRes?.data || []);
            setAmenities(externalAmenities.length ? externalAmenities : amenityRes?.data?.items || amenityRes?.data || []);
            const fetchedLeads = leadRes?.data || [];
            setLeads(fetchedLeads);

            const visitsPromises = fetchedLeads.map(l => SaleService.getSiteVisitsByLead(l.leadID));
            const dealsPromises = fetchedLeads.map(l => SaleService.getDealsByLead(l.leadID));

            const [visitsResults, dealsResults] = await Promise.all([
                Promise.all(visitsPromises),
                Promise.all(dealsPromises)
            ]);

            setAllVisits(visitsResults.flatMap((res, idx) =>
                (res?.data || []).map(v => ({ ...v, customerName: fetchedLeads[idx]?.customerName }))
            ));

            setAllDeals(dealsResults.flatMap((res, idx) =>
                (res?.data || []).map(d => ({ ...d, customerName: fetchedLeads[idx]?.customerName }))
            ));

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!property?.propertyID) return;
        fetchData();
    }, [property?.propertyID, externalUnits.length, externalAmenities.length]);

    useEffect(() => {
        setUnits(externalUnits);
    }, [externalUnits]);

    useEffect(() => {
        setAmenities(externalAmenities);
    }, [externalAmenities]);

    useEffect(() => {
        setDocuments(externalDocuments);
    }, [externalDocuments]);

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                    <ArrowLeftIcon className="w-4 h-4" /> Back to Portfolio
                </button>

                <div className="flex items-center gap-2">
              
                    <button onClick={onEditProperty} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">
                        Edit Property
                    </button>
                </div>
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
                <div className="flex bg-gray-100 p-1.5 rounded-[20px] shadow-inner overflow-x-auto">
                    <TabButton active={activeTab === 'units'} onClick={() => setActiveTab('units')} icon={<HomeIcon className="w-4 h-4" />} label={`Units (${units.length})`} />
                    {/* <TabButton active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} icon={<UsersIcon className="w-4 h-4" />} label={`Leads (${leads.length})`} /> */}
                    <TabButton active={activeTab === 'amenities'} onClick={() => setActiveTab('amenities')} icon={<SparklesIcon className="w-4 h-4" />} label={`Amenities (${amenities.length})`} />
                    <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} icon={<DocumentTextIcon className="w-4 h-4" />} label={`Documents (${documents.length})`} />
                </div>
                
                {/* NEW: Button Group Container */}
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
                    <div className="py-20 text-center animate-pulse">Syncing...</div>
                ) : (
                    <>
                        {activeTab === 'units' && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {units.length ? units.map(u => (
                                    <UnitCard key={u.unitID} unit={u} onEdit={() => onEditUnit(u)} />
                                )) : <EmptyState msg="No units yet" />}
                            </div>
                        )}

                        {activeTab === 'leads' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {leads.length ? leads.map(l => <SimpleLeadCard key={l.leadID} lead={l} onUpdate={fetchData} />) : <EmptyState msg="No leads yet" />}
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
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                {documents.length ? (
                                    <table className="w-full text-left">
                                        <thead className="text-xs uppercase tracking-widest text-gray-400 border-b border-gray-200">
                                            <tr>
                                                <th className="py-3">Type</th>
                                                <th className="py-3">File</th>
                                                <th className="py-3">Uploaded</th>
                                                <th className="py-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documents.map((doc) => (
                                                <tr key={doc.documentID} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 text-sm text-gray-700">{doc.documentType}</td>
                                                    <td className="py-3 text-sm text-blue-600 underline cursor-pointer" onClick={() => window.open(`http://localhost:5154/api/Document/${doc.documentID}/download`, '_blank')}>
                                                        {doc.fileName || doc.uri?.split('/').pop() || 'View'}
                                                    </td>
                                                    <td className="py-3 text-sm text-gray-500">{new Date(doc.uploadedDate || doc.createdAt || Date.now()).toLocaleDateString()}</td>
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

            <AddLeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} propertyID={property.propertyID} onSuccess={fetchData} />
        </div>
    );
};

const AmenityCard = ({ amenity, onEdit }) => (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
        <button onClick={onEdit} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700">Edit</button>
        <h3 className="text-lg font-black text-gray-900">{amenity.name}</h3>
        <p className="mt-2 text-sm text-gray-500">{amenity.description}</p>
    </div>
);

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

const UnitCard = ({ unit, onEdit }) => (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
        <button onClick={onEdit} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700">Edit</button>
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



export default PropertyDetailsView;
