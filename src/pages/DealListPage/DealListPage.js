import React, { useEffect, useState } from 'react';
import { SaleService } from '../../services/dealService';
import { propertyService } from '../../services/propertyService';
import { 
    BanknotesIcon, 
    CalendarDaysIcon, 
    ArrowPathIcon,
    MagnifyingGlassIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import { AddContractModal } from '../../components/Modals/ContractModal';
import { 
    AddLeadModal, 
    AddSiteVisitModal, 
    AddDealModal, 
    EditSiteVisitModal, 
    UpdateDealStatusModal 
} from '../../components/Modals/SalesModel';

const SalesManagementPage = () => {
    const [activeTab, setActiveTab] = useState('leads'); 
    const [data, setData] = useState({ leads: [], deals: [], visits: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Action States
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [selectedLeadForVisit, setSelectedLeadForVisit] = useState(null); 
    const [selectedLeadForDeal, setSelectedLeadForDeal] = useState(null);
    const [selectedVisitForEdit, setSelectedVisitForEdit] = useState(null); 
    const [selectedDealForUpdate, setSelectedDealForUpdate] = useState(null); 
    const [modal, setModal] = useState({ lead: false, visit: false, deal: false });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [leadsRes, dealsRes, visitsRes, propsRes] = await Promise.all([
                SaleService.getAllLeads().catch(err => { console.error("Leads error:", err); return null; }),
                SaleService.getAllDeals().catch(err => { console.error("Deals error:", err); return null; }),
                SaleService.getAllSiteVisits().catch(err => { console.error("Visits error:", err); return null; }),
                propertyService.getProperties().catch(err => { console.error("Props error:", err); return null; }) 
            ]);
            
            const getArray = (res) => {
                if (!res) return [];
                if (Array.isArray(res)) return res;
                if (Array.isArray(res.data)) return res.data;
                if (Array.isArray(res.data?.items)) return res.data.items;
                return [];
            };

            const rawLeads = getArray(leadsRes);
            const rawDeals = getArray(dealsRes);
            const rawVisits = getArray(visitsRes);
            const rawProps = getArray(propsRes);

            const getPropId = (obj) => {
                const id = obj?.propertyID || obj?.propertyId || obj?.PropertyID || obj?.id || obj?.Id;
                return id ? String(id).toLowerCase() : null;
            };
            const getLeadId = (obj) => {
                const id = obj?.leadID || obj?.leadId || obj?.LeadID || obj?.id || obj?.Id;
                return id ? String(id).toLowerCase() : null;
            };

            const mappedLeads = rawLeads.map(lead => {
                const leadPropId = getPropId(lead);
                const matchedProp = rawProps.find(p => getPropId(p) === leadPropId);
                let propName = rawProps.length === 0 ? '❌ Props API Empty/Failed' : (matchedProp ? (matchedProp.propertyName || matchedProp.name) : 'Unknown Property');
                return { ...lead, propertyName: propName };
            });

            const mappedVisits = rawVisits.map(visit => {
                const visitLeadId = getLeadId(visit);
                const matchedLead = mappedLeads.find(l => getLeadId(l) === visitLeadId);
                return { ...visit, customerName: matchedLead ? matchedLead.customerName : 'Unknown Lead', propertyName: matchedLead ? matchedLead.propertyName : 'Unknown Property' };
            });

            const mappedDeals = rawDeals.map(deal => {
                const dealLeadId = getLeadId(deal);
                const matchedLead = mappedLeads.find(l => getLeadId(l) === dealLeadId);
                return { ...deal, customerName: matchedLead ? matchedLead.customerName : 'Unknown Lead', propertyName: matchedLead ? matchedLead.propertyName : 'Unknown Property' };
            });
            
            setData({ leads: mappedLeads, deals: mappedDeals, visits: mappedVisits });
        } catch (err) {
            console.error("Error fetching sales data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredItems = (
        activeTab === 'leads' ? data.leads : 
        activeTab === 'deals' ? data.deals : 
        data.visits
    ).filter(item => {
        const search = searchTerm.toLowerCase();
        return (item.customerName?.toLowerCase().includes(search) || item.propertyName?.toLowerCase().includes(search));
    });

    const getStatusStyle = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'new' || s === 'open') return { dot: 'bg-blue-500', text: 'text-blue-600' };
        if (s === 'closed' || s === 'won' || s === 'booked' || s === 'visitscheduled') return { dot: 'bg-green-500', text: 'text-green-600' };
        if (s === 'cancelled') return { dot: 'bg-red-500', text: 'text-red-600' };
        return { dot: 'bg-yellow-500', text: 'text-yellow-600' }; 
    };

    return (
        <div className="p-8 space-y-6 bg-gray-50/30 min-h-screen">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h1 className="text-4xl font-black text-[#5a2ab3] tracking-tight">Deals Dashboard</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="pl-12 pr-6 py-2.5 bg-white border border-gray-200 rounded-xl outline-none w-72 shadow-sm focus:ring-2 focus:ring-[#7c3aed]/20 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={fetchData} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
                        <ArrowPathIcon className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-8 border-b border-gray-200">
                {['leads', 'visits', 'deals'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-bold capitalize transition-all border-b-2 ${activeTab === tab ? 'border-[#7c3aed] text-[#7c3aed]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider">Customer / Property</th>
                            {activeTab === 'leads' && (
                                <>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider">Contact Info</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider">Interest</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider">Status</th>
                                    <th className="px-4 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider text-center">Engagement</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider text-right">Conversion</th>
                                </>
                            )}
                            {activeTab === 'visits' && (
                                <>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider">Visit Date</th>
                                    <th colSpan="4" className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider">Notes</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider text-right">Action</th>
                                </>
                            )}
                            {activeTab === 'deals' && (
                                <>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider">Type</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider">Expected Close</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider">Agreed Value</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider text-center">Status</th>
                                    <th className="px-8 py-5 text-[11px] font-bold uppercase text-gray-400 tracking-wider text-right">Action</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="7" className="px-8 py-12 text-center text-gray-400 font-bold animate-pulse">Syncing pipeline data...</td></tr>
                        ) : filteredItems.length > 0 ? (
                            filteredItems.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    {/* COMMON: Property Cell */}
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col items-start">
                                            <span className="font-bold text-gray-900">{item.customerName}</span>
                                            <span className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold mt-1">
                                                <BuildingOfficeIcon className="w-3.5 h-3.5 text-gray-400" />
                                                <span className={item.propertyName?.includes('❌') ? "text-red-500 font-bold" : ""}>{item.propertyName}</span>
                                            </span>
                                        </div>
                                    </td>

                                    {/* LEADS TAB CONTENT */}
                                    {activeTab === 'leads' && (
                                        <>
                                            <td className="px-8 py-5 text-gray-600 text-sm font-medium">{item.contactInfo}</td>
                                            <td className="px-8 py-5 text-gray-600 text-xs font-bold uppercase">{item.interestType || 'Buy'}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${getStatusStyle(item.status).dot}`}></span>
                                                    <span className={`text-sm font-bold ${getStatusStyle(item.status).text}`}>{item.status || 'New'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 text-center">
                                                <button onClick={() => setSelectedLeadForVisit(item.leadID || item.leadId)} className="text-[11px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-tighter">+ Visit</button>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button onClick={() => setSelectedLeadForDeal(item)} className="bg-green-50 text-green-700 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide hover:bg-green-600 hover:text-white transition-all border border-green-200">Create Deal</button>
                                            </td>
                                        </>
                                    )}

                                    {/* VISITS TAB CONTENT */}
                                    {activeTab === 'visits' && (
                                        <>
                                            <td className="px-8 py-5 text-gray-900 font-bold text-sm whitespace-nowrap">{item.visitDate || 'N/A'}</td>
                                            <td colSpan="4" className="px-8 py-5 text-gray-500 text-sm italic">
                                                "{item.notes || 'No notes available'}"
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button onClick={() => setSelectedVisitForEdit(item)} className="text-[11px] font-black text-[#7c3aed] hover:underline uppercase">Edit Notes</button>
                                            </td>
                                        </>
                                    )}

                                    {/* DEALS TAB CONTENT */}
                                    {activeTab === 'deals' && (
                                        <>
                                            <td className="px-8 py-5"><span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold">{item.dealType || 'Sale'}</span></td>
                                            <td className="px-8 py-5 text-gray-500 text-sm font-medium whitespace-nowrap">{item.expectedClosureDate || 'TBD'}</td>
                                            <td className="px-8 py-5 font-bold text-gray-900">₹{item.agreedValue?.toLocaleString()}</td>
                                            <td className="px-8 py-5 text-center">
                                                <div 
                                                    onClick={() => setSelectedDealForUpdate(item)}
                                                    className="group flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 py-1.5 px-3 rounded-xl transition-all border border-transparent hover:border-gray-200"
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${getStatusStyle(item.status).dot}`}></span>
                                                    <span className={`text-sm font-bold ${getStatusStyle(item.status).text}`}>{item.status || 'Open'}</span>
                                                    <PencilSquareIcon className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#7c3aed] transition-colors" />
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button onClick={() => setSelectedDeal(item.dealID || item.dealId)} className="text-[10px] font-black text-[#7c3aed] uppercase hover:underline whitespace-nowrap">Contract</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="px-8 py-12 text-center text-gray-400 font-bold">No results found in {activeTab}.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals Section */}
            <UpdateDealStatusModal isOpen={!!selectedDealForUpdate} onClose={() => setSelectedDealForUpdate(null)} deal={selectedDealForUpdate} onSuccess={fetchData} />
            <AddLeadModal isOpen={modal.lead} onClose={() => setModal({...modal, lead: false})} onSuccess={fetchData} />
            <AddSiteVisitModal isOpen={!!selectedLeadForVisit} onClose={() => setSelectedLeadForVisit(null)} leadID={selectedLeadForVisit} onSuccess={fetchData} />
            <EditSiteVisitModal isOpen={!!selectedVisitForEdit} onClose={() => setSelectedVisitForEdit(null)} visit={selectedVisitForEdit} onSuccess={fetchData} />
            <AddDealModal isOpen={!!selectedLeadForDeal} onClose={() => setSelectedLeadForDeal(null)} lead={selectedLeadForDeal} onSuccess={fetchData} />
            <AddContractModal isOpen={!!selectedDeal} onClose={() => setSelectedDeal(null)} dealID={selectedDeal} onSuccess={fetchData} />
        </div>
    );
};

export default SalesManagementPage;