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
                <div className="bg-white p-3 rounded-full shadow-xl shadow-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 border border-stone-100">
                    
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
                    <div className="flex bg-stone-50 p-1.5 rounded-full border border-stone-100">
                        {['leads', 'visits', 'deals'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                                    activeTab === tab 
                                    ? 'bg-[#5B3E59] text-white shadow-md' 
                                    : 'text-stone-500 hover:text-[#5B3E59] hover:bg-stone-200/50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Refresh Button */}
                    <button onClick={fetchData} className="p-3 mr-2 bg-[#F6F1F3] text-[#5B3E59] rounded-full hover:bg-stone-200 transition-all">
                        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* METRIC STATS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Leads', val: data.leads.length, icon: CalendarIcon, color: 'text-[#5B3E59]', bg: 'bg-[#F6F1F3]' },
                        { label: 'Total Deals', val: data.deals.length, icon: BriefcaseIcon, color: 'text-orange-600', bg: 'bg-orange-50' }, 
                        { label: 'Site Visits', val: data.visits.length, icon: BuildingOfficeIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Conversion', val: 'Active', icon: ChartBarIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[28px] shadow-sm border border-stone-100 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-black text-stone-800 mt-1">{stat.val}</h3>
                            </div>
                            <div className={`p-3.5 ${stat.bg} ${stat.color} rounded-2xl`}>
                                <stat.icon className="w-6 h-6" />
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
                                            <div className="w-14 h-14 bg-gradient-to-br from-[#5B3E59] to-[#7d5d7a] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg uppercase">
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
                                    <div className="flex gap-3 pt-2">
                                        {activeTab === 'leads' && (
                                            <button 
                                                disabled={isVisited || isClosed}
                                                onClick={() => setSelectedLeadForVisit(leadId)}
                                                className="w-full bg-[#5B3E59] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#4a3248] disabled:bg-stone-100 disabled:text-stone-400 transition-all shadow-xl shadow-stone-200/50"
                                            >
                                                {isVisited ? 'VISIT ADDED' : 'ADD VISIT'}
                                            </button>
                                        )}

                                        {activeTab === 'visits' && (
                                            <>
                                                <button 
                                                    disabled={isDealed}
                                                    onClick={() => setSelectedLeadForDeal(item.fullLead || item)}
                                                    className="flex-1 bg-[#5B3E59] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#4a3248] disabled:bg-stone-100 disabled:text-stone-400 transition-all shadow-xl shadow-stone-200/50"
                                                >
                                                    {isDealed ? 'DEAL CREATED' : 'CREATE DEAL'}
                                                </button>
                                                <button 
                                                    onClick={() => setSelectedVisitForEdit(item)}
                                                    className="p-4 rounded-2xl border border-stone-200 text-stone-500 hover:bg-stone-50 transition-all"
                                                    title="Edit Visit Notes"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}

                                        {activeTab === 'deals' && (
                                            <div className="w-full flex gap-3">
                                                <button 
                                                    onClick={() => setSelectedDealForUpdate(item)}
                                                    className="flex-1 bg-[#5B3E59] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#4a3248] transition-all shadow-lg"
                                                >
                                                    Update Status
                                                </button>
                                                <button 
                                                    onClick={() => setSelectedDeal(item.dealID || item.dealId)}
                                                    className="px-6 border border-stone-200 text-stone-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-stone-50 transition-all"
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