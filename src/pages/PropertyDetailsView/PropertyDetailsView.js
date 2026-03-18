import React, { useEffect, useState } from 'react';
import { SaleService } from '../../services/dealService';
import { unitAmenityService } from '../../services/unitAmenityService';
import { contractService } from '../../services/contractService'; 
import {AddContractModal} from '../../components/Modals/ContractModal';
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
                    <TabButton active={activeTab === 'deals'} onClick={() => setActiveTab('deals')} icon={<BanknotesIcon className="w-4 h-4"/>} label="Deals" />
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
                        {activeTab === 'deals' && <DealsListView deals={allDeals} />}
                    </>
                )}
            </div>

            <AddLeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} propertyID={property.propertyID} onSuccess={fetchData} />
        </div>
    );
};

/* --- CONTRACT COMPONENT (Nested in Deal Card) --- */
const ContractSection = ({ dealID }) => {
    const [status, setStatus] = useState('idle'); // idle, loading, success
    const [formData, setFormData] = useState({
        contractType: 'Sales Agreement',
        contractValue: ''
    });

    const handlePostContract = async () => {
        if (!formData.contractValue) return alert("Please enter contract value");
        try {
            setStatus('loading');
            await contractService.createContract({
                dealID: dealID,
                contractType: formData.contractType,
                startDate: new Date().toISOString(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // 1 year default
                contractValue: parseFloat(formData.contractValue)
            });
            setStatus('success');
        } catch (err) {
            setStatus('idle');
            alert("Failed to create contract");
        }
    };

    if (status === 'success') {
        return (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 font-bold text-xs">
                <CheckCircleIcon className="w-5 h-5" /> Contract Created Successfully
            </div>
        );
    }

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-3 flex items-center gap-1">
                <DocumentTextIcon className="w-3 h-3" /> Quick Contract
            </p>
            <div className="flex flex-col gap-2">
                <input 
                    type="number" 
                    placeholder="Value ($)" 
                    className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-100"
                    value={formData.contractValue}
                    onChange={(e) => setFormData({...formData, contractValue: e.target.value})}
                />
                <button 
                    onClick={handlePostContract}
                    disabled={status === 'loading'}
                    className="bg-blue-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {status === 'loading' ? 'Processing...' : 'Generate Contract'}
                </button>
            </div>
        </div>
    );
};

/* --- UPDATED DEALS LIST VIEW --- */
// Inside PropertyDetailsView or as a sub-component:
const DealsListView = ({ deals }) => {
    const [selectedDeal, setSelectedDeal] = useState(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((d, i) => (
                    <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">{d.dealType}</p>
                                <p className="text-[10px] font-bold text-gray-400 italic">Expected: {d.expectedClosureDate}</p>
                            </div>
                            <h4 className="text-xl font-black text-gray-900 mb-1">{d.customerName}</h4>
                            <p className="text-gray-400 text-[10px] font-black uppercase mb-4 tracking-tighter">Verified Lead</p>
                            
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-gray-400 text-[10px] font-black uppercase">Agreed Value</p>
                                <p className="text-3xl font-black text-gray-900">${d.agreedValue?.toLocaleString()}</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setSelectedDeal(d.dealID)}
                            className="mt-8 w-full bg-gray-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl"
                        >
                            <DocumentCheckIcon className="w-4 h-4" /> Create Contract
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal Trigger */}
            {selectedDeal && (
                <AddContractModal 
                    isOpen={!!selectedDeal} 
                    onClose={() => setSelectedDeal(null)} 
                    dealID={selectedDeal} 
                    onSuccess={() => alert("Contract Added!")} 
                />
            )}
        </>
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