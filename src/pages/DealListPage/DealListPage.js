import React, { useEffect, useState } from 'react';
import { SaleService } from '../../services/dealService';
import { propertyService } from '../../services/propertyService';
import { 
    ArrowPathIcon,
    MagnifyingGlassIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    FireIcon,
    CalendarIcon,
    ChartBarIcon,
    PhoneIcon,
    MapPinIcon,
    PencilSquareIcon,
    BriefcaseIcon 
} from '@heroicons/react/24/outline';
import { AddContractModal } from '../../components/Modals/ContractModal';
import { 
    AddLeadModal, 
    AddSiteVisitModal, 
    AddDealModal, 
    EditSiteVisitModal, 
    UpdateDealStatusModal 
} from '../../components/Modals/SalesModel';
import Toast from '../../components/Toast/Toast';

const SalesManagementPage = () => {
    const [activeTab, setActiveTab] = useState('leads'); 
    const [data, setData] = useState({ leads: [], deals: [], visits: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [selectedLeadForVisit, setSelectedLeadForVisit] = useState(null); 
    const [selectedLeadForDeal, setSelectedLeadForDeal] = useState(null);
    const [selectedVisitForEdit, setSelectedVisitForEdit] = useState(null); 
    const [selectedDealForUpdate, setSelectedDealForUpdate] = useState(null); 
    const [modal, setModal] = useState({ lead: false, visit: false, deal: false });

    const [toast, setToast] = useState({ 
        visible: false, 
        message: '', 
        type: 'success' 
    });

    const showToast = (message, type = 'success') => {
        setToast({ visible: true, message, type });
    };

    const hasExistingVisit = (leadId) => {
        if (!leadId || !data.visits) return false;
        return data.visits.some(v => (v.leadID || v.leadId || v.LeadID)?.toLowerCase() === leadId.toLowerCase());
    };

    const hasExistingDeal = (leadId) => {
        if (!leadId || !data.deals) return false;
        return data.deals.some(d => (d.leadID || d.leadId || d.LeadID)?.toLowerCase() === leadId.toLowerCase());
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [leadsRes, dealsRes, visitsRes, propsRes] = await Promise.all([
                SaleService.getAllLeads().catch(err => null),
                SaleService.getAllDeals().catch(err => null),
                SaleService.getAllSiteVisits().catch(err => null),
                propertyService.getProperties().catch(err => null) 
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

            const getLeadId = (obj) => {
                const id = obj?.leadID || obj?.leadId || obj?.LeadID || obj?.id || obj?.Id;
                return id ? String(id).toLowerCase() : null;
                };

            const mappedLeads = rawLeads.map(lead => {
                const leadId = getLeadId(lead);
                const matchedProp = rawProps.find(p => String(p.propertyID || p.id).toLowerCase() === String(lead.propertyID || lead.propertyId).toLowerCase());
                const leadDeal = rawDeals.find(d => getLeadId(d) === leadId);
                const dealStatus = (leadDeal?.status || '').toLowerCase();
                let finalStatus = lead.status;
                if (dealStatus === 'booked' || dealStatus === 'cancelled') finalStatus = 'Closed';
                return { 
                    ...lead, 
                    status: finalStatus,
                    propertyName: matchedProp ? (matchedProp.propertyName || matchedProp.name) : 'Unknown Property' 
                };
            });

            const mappedVisits = rawVisits.map(visit => {
                const visitLeadId = getLeadId(visit);
                const matchedLead = mappedLeads.find(l => getLeadId(l) === visitLeadId);
    
                return { 
                    ...visit, 
                    customerName: matchedLead ? matchedLead.customerName : 'Unknown Lead', 
                    propertyName: matchedLead ? matchedLead.propertyName : 'Unknown Property',
                    contactInfo: matchedLead ? matchedLead.contactInfo : 'N/A',
                    interestType: matchedLead ? matchedLead.interestType : 'BUY',
                    
                    // This is the crucial line: Inherit the dynamic status from the Lead
                    status: matchedLead ? matchedLead.status : 'NEW', 
                    
                    fullLead: matchedLead 
                };
            });

            const mappedDeals = rawDeals.map(deal => {
                const dealLeadId = getLeadId(deal);
                const matchedLead = mappedLeads.find(l => getLeadId(l) === dealLeadId);
                return { 
                    ...deal, 
                    customerName: matchedLead ? matchedLead.customerName : 'Unknown Lead', 
                    propertyName: matchedLead ? matchedLead.propertyName : 'Unknown Property',
                    contactInfo: matchedLead ? matchedLead.contactInfo : 'N/A',
                    interestType: matchedLead ? matchedLead.interestType : 'BUY'
                };
            });
            
            setData({ leads: mappedLeads, deals: mappedDeals, visits: mappedVisits });
        } catch (err) { 
            console.error(err); 
            showToast('Failed to load dashboard data', 'error');
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

    const getStatusStyles = (status) => {
        const s = (status || '').toLowerCase();
        switch(s) {
            case 'closed': return 'bg-red-50 text-red-600 border border-red-100';
            case 'negotiating': return 'bg-orange-50 text-orange-600 border border-orange-100';
            case 'visitscheduled': return 'bg-green-50 text-green-600 border border-green-100';
            case 'new': return 'bg-blue-50 text-blue-600 border border-blue-100';
            default: return 'bg-stone-50 text-stone-600 border border-stone-200';
        }
    };

    return (
        <div className="bg-[#fcfaf8] min-h-screen font-sans pb-20">
            
            {/* HERO SECTION - Matched to the dark charcoal of the reference image */}
            <div className="bg-[#FAF6F9] px-8 pt-16 pb-24 text-center rounded-b-[40px] relative shadow-lg">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Deals Dashboard</h1>
                <p className="text-slate-300 text-sm font-medium mt-4 max-w-2xl mx-auto">
                    Monitor, manage, and convert your real-estate prospects seamlessly — all in one place.
                </p>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 space-y-12">
                
                {/* FLOATING FILTER BAR */}
                <div className="bg-[#EFE9F0] p-3 rounded-full shadow-md shadow-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 border border-stone-100">
                    
                    {/* Search Input */}
                    <div className="relative w-full md:w-1/3 ml-2">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input 
                            type="text" 
                            placeholder="Search by entity name..." 
                            className="pl-12 pr-4 py-3 bg-transparent outline-none w-full text-sm font-medium text-slate-700 placeholder:text-stone-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                
            {/* Tab Navigation Pill */}
                    <div className="flex items-center justify-center flex-1 gap-1">
                        {['leads', 'visits', 'deals'].map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    // Use a standard style for the active state to guarantee it applies
                                    style={isActive ? { color: '#ffffff', backgroundColor: '#5B3E59' } : {}}
                                    className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all border-none ${
                                        isActive 
                                        ? 'shadow-md' // Removed text and bg classes here since inline styles handle them
                                        : 'bg-transparent text-[#1c1c1e] hover:bg-gray-100/80'
                                    }`}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>

                    
                </div>

                {/* METRIC STATS */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Leads', val: data.leads.length, icon: UserGroupIcon },
                        { label: 'Total Deals', val: data.deals.length, icon: BriefcaseIcon }, 
                        { label: 'Total Visits', val: data.visits.length, icon: MapPinIcon },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-7 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all border-none">
                            <div>
                                {/* Text color matched to sidebar theme with slight opacity for label */}
                                <p className="text-[#5B3E59] text-[10px] font-black uppercase tracking-[0.15em] mb-1 opacity-60">
                                    {stat.label}
                                </p>
                                <h3 className="text-[32px] leading-none font-black text-[#1c1c1e]">
                                    {stat.val}
                                </h3>
                            </div>
                            
                            <div className="w-14 h-14 flex items-center justify-center bg-transparent">
                                {/* Icon color matched exactly to your sidebar primary purple */}
                                <stat.icon className="w-7 h-7 text-[#5B3E59]" strokeWidth={1.5} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* CONTENT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {!loading && filteredItems.map((item, idx) => {
                        const leadId = item.leadID || item.leadId;
                        const isVisited = hasExistingVisit(leadId);
                        const isDealed = hasExistingDeal(leadId);
                        const isClosed = (item.status || '').toLowerCase() === 'closed';

                        return (
                            <div key={idx} className="bg-white rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
                                {/* Top Accent Bar */}
                                <div className={`h-1.5 w-full ${isClosed ? 'bg-stone-300' : 'bg-[#5B3E59]'}`} />
                                
                                <div className="p-8 space-y-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-[#5B3E59] to-[#7d5d7a] rounded-2xl flex items-center justify-center font-black text-xl shadow-lg uppercase border-none"
                                                    style={{ color: '#ffffff' }} >
                                                    {item.customerName?.charAt(0)}
                                                </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-lg font-black text-stone-900 leading-tight tracking-tight truncate max-w-[140px]">{item.customerName}</h4>
                                                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-[9px] font-black uppercase rounded-lg border border-stone-200">
                                                        {item.interestType || 'BUY'}
                                                    </span>
                                                </div>
                                                <p className="text-stone-500 text-[11px] font-bold flex items-center gap-1.5 mt-1.5 uppercase tracking-widest">
                                                    <BuildingOfficeIcon className="w-3.5 h-3.5 text-stone-400" /> {item.propertyName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Panel */}
                                    <div className="bg-[#fcfbf9] p-5 rounded-2xl border border-stone-100 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5 text-stone-600">
                                                <PhoneIcon className="w-4 h-4 text-stone-400" />
                                                <span className="text-sm font-black tracking-tight">{item.contactInfo}</span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider ${getStatusStyles(item.status)}`}>
                                                {item.status || 'NEW'}
                                            </span>
                                        </div>
                                        {activeTab === 'visits' && (
                                            <div className="pt-3 border-t border-stone-200/60">
                                                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Visit Notes</p>
                                                <p className="text-xs text-stone-700 font-medium mt-1.5 line-clamp-2 leading-relaxed">"{item.notes || 'No notes appended yet'}"</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                   <div className="mt-10 flex gap-3 mt-auto border-none">
    
                                {/* LEADS TAB BUTTON */}
                                {activeTab === 'leads' && (
                                    <button 
                                        disabled={isVisited || isClosed}
                                        onClick={() => setSelectedLeadForVisit(leadId)}
                                        // This forces the colors to change dynamically
                                        style={
                                            (isVisited || isClosed) 
                                            ? { backgroundColor: '#F4F4F5', color: '#A1A1AA', boxShadow: 'none' } // Light greyish background, grey text
                                            : { backgroundColor: '#5B3E59', color: '#ffffff' } // Active purple background, white text
                                        }
                                        className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer disabled:cursor-not-allowed border-none"
                                    >
                                        {isVisited ? 'VISIT ADDED' : 'ADD VISIT'}
                                    </button>
                                )}


                      {activeTab === 'visits' && (
                                <>
                                    <button 
                                        disabled={isDealed}
                                        onClick={() => setSelectedLeadForDeal(item.fullLead || item)}
                                        // This forces the colors to change dynamically
                                        style={
                                            isDealed 
                                            ? { backgroundColor: '#F4F4F5', color: '#A1A1AA', boxShadow: 'none' } // Light greyish background, grey text
                                            : { backgroundColor: '#5B3E59', color: '#ffffff' } // Active purple background, white text
                                        }
                                        className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer disabled:cursor-not-allowed border-none"
                                    >
                                        {isDealed ? 'DEAL CREATED' : 'CREATE DEAL'}
                                    </button>
                                    <button 
                                        onClick={() => setSelectedVisitForEdit(item)}
                                        className="p-4 rounded-2xl bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-all border-none"
                                        title="Edit Visit Notes"
                                    >
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                </>
                            )}

                           {/* DEALS TAB BUTTONS */}
                                    {activeTab === 'deals' && (
                                        <div className="w-full flex gap-3 border-none">
                                            <button 
                                                onClick={() => setSelectedDealForUpdate(item)}
                                                style={{ backgroundColor: '#5B3E59', color: '#ffffff' }}
                                                className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-[#5B3E59]/20 border-none"
                                            >
                                                Update Status
                                            </button>
                                            <button 
                                                onClick={() => setSelectedDeal(item.dealID || item.dealId)}
                                                // Style changed to match Update Status button
                                                style={{ backgroundColor: '#5B3E59', color: '#ffffff' }}
                                                className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-[#5B3E59]/20 border-none"
                                            >
                                                Contract
                                            </button>
                                        </div>
                                    )}

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filteredItems.length === 0 && !loading && (
                        <div className="col-span-full py-20 text-center text-stone-400 font-bold italic">No matching records in {activeTab} phase.</div>
                    )}
                </div>
            </div>

            {/* Modals Section */}
            <UpdateDealStatusModal isOpen={!!selectedDealForUpdate} onClose={() => setSelectedDealForUpdate(null)} deal={selectedDealForUpdate} onSuccess={fetchData} showToast={showToast} />
            <AddLeadModal isOpen={modal.lead} onClose={() => setModal({...modal, lead: false})} onSuccess={fetchData} showToast={showToast} />
            <AddSiteVisitModal isOpen={!!selectedLeadForVisit} onClose={() => setSelectedLeadForVisit(null)} leadID={selectedLeadForVisit} onSuccess={fetchData} showToast={showToast} />
            <EditSiteVisitModal isOpen={!!selectedVisitForEdit} onClose={() => setSelectedVisitForEdit(null)} visit={selectedVisitForEdit} onSuccess={fetchData} showToast={showToast} />
            <AddDealModal isOpen={!!selectedLeadForDeal} onClose={() => setSelectedLeadForDeal(null)} lead={selectedLeadForDeal} onSuccess={fetchData} showToast={showToast} />
            <AddContractModal isOpen={!!selectedDeal} onClose={() => setSelectedDeal(null)} dealID={selectedDeal} onSuccess={fetchData} showToast={showToast} />
            
            {/* TOAST RENDER */}
            {toast.visible && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, visible: false })} 
                />
            )}
        </div>
    );
};

export default SalesManagementPage;