import React, { useEffect, useState } from 'react';
import { SaleService } from '../../services/dealService';
import { 
    BanknotesIcon, 
    CalendarDaysIcon, 
    TagIcon, 
    HashtagIcon,
    ArrowPathIcon,
    DocumentCheckIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    ChatBubbleLeftEllipsisIcon,
    UserGroupIcon, // Added for Leads
    PhoneIcon      // Added for Leads
} from '@heroicons/react/24/outline';
import { AddContractModal } from '../../components/Modals/ContractModal';

const SalesManagementPage = () => {
    // 1. Default tab changed to 'leads'
    const [activeTab, setActiveTab] = useState('leads'); 
    const [data, setData] = useState({ leads: [], deals: [], visits: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDeal, setSelectedDeal] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 2. Fetch Leads alongside Deals and Visits
            const [leadsRes, dealsRes, visitsRes] = await Promise.all([
                SaleService.getAllLeads(),
                SaleService.getAllDeals(),
                SaleService.getAllSiteVisits()
            ]);
            
            setData({
                leads: leadsRes?.data || [],
                deals: dealsRes?.data || [],
                visits: visitsRes?.data || []
            });
        } catch (err) {
            console.error("Error fetching sales data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 3. Filter logic updated to support leads search
    const filteredItems = (
        activeTab === 'leads' ? data.leads : 
        activeTab === 'deals' ? data.deals : 
        data.visits
    ).filter(item => {
        const search = searchTerm.toLowerCase();
        if (activeTab === 'leads') {
            return item.customerName?.toLowerCase().includes(search) || item.contactInfo?.includes(search);
        } else if (activeTab === 'deals') {
            return item.dealType?.toLowerCase().includes(search) || item.dealID?.includes(search);
        } else {
            return item.notes?.toLowerCase().includes(search) || item.visitID?.includes(search);
        }
    });

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Deals Dashboard</h1>
                    <div className="flex items-center gap-4 mt-2">
                        {/* TAB SWITCHER */}
                        <div className="flex bg-gray-200/50 p-1 rounded-2xl">
                            {/* NEW: Leads Button (Placed First) */}
                            <button 
                                onClick={() => setActiveTab('leads')}
                                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'leads' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Leads
                            </button>
                            <button 
                                onClick={() => setActiveTab('deals')}
                                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'deals' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Deals
                            </button>
                            <button 
                                onClick={() => setActiveTab('visits')}
                                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'visits' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Site Visits
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder={`Search ${activeTab}...`} 
                            className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none w-72 shadow-sm focus:ring-2 focus:ring-blue-500/10 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={fetchData}
                        className="p-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <ArrowPathIcon className={`w-6 h-6 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-4">
                    <div className={`w-10 h-10 border-4 ${activeTab === 'leads' ? 'border-yellow-600' : activeTab === 'deals' ? 'border-blue-600' : 'border-purple-600'} border-t-transparent rounded-full animate-spin`}></div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Syncing {activeTab}...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                    {/* 4. Render the correct cards based on activeTab */}
                    {activeTab === 'leads' && filteredItems.map((lead) => (
                        <LeadCard key={lead.leadID} lead={lead} />
                    ))}

                    {activeTab === 'deals' && filteredItems.map((deal) => (
                        <DealCard key={deal.dealID} deal={deal} onGenerate={() => setSelectedDeal(deal.dealID)} />
                    ))}

                    {activeTab === 'visits' && filteredItems.map((visit) => (
                        <VisitCard key={visit.visitID} visit={visit} />
                    ))}
                </div>
            )}

            {!loading && filteredItems.length === 0 && (
                <div className="col-span-full py-32 bg-white rounded-[44px] border-2 border-dashed border-gray-100 text-center">
                    <p className="text-gray-400 font-bold italic">No {activeTab} records found.</p>
                </div>
            )}

            <AddContractModal 
                isOpen={!!selectedDeal} 
                onClose={() => setSelectedDeal(null)} 
                dealID={selectedDeal} 
                onSuccess={fetchData} 
            />
        </div>
    );
};

/* --- SUB-COMPONENTS: CARDS --- */

// NEW: Lead Card Component
const LeadCard = ({ lead }) => (
    <div className="bg-white rounded-[44px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group">
        <div className="p-8 flex-grow">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    <UserGroupIcon className="w-3 h-3" /> {lead.interestType || 'Buy'}
                </div>
                <span className="text-gray-300 text-[10px] font-bold">#{lead.leadID?.slice(0, 8)}</span>
            </div>

            <h3 className="text-3xl font-black text-gray-900 mb-2 truncate" title={lead.customerName}>
                {lead.customerName}
            </h3>
            
            <div className="flex items-center gap-3 text-gray-500 mb-8 mt-4">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <p className="font-bold text-sm">{lead.contactInfo}</p>
            </div>

            <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 group-hover:bg-yellow-500 transition-colors duration-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <HashtagIcon className="w-5 h-5 text-gray-400 group-hover:text-yellow-100" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-yellow-100">Status</span>
                </div>
                <span className="text-sm font-black text-gray-900 uppercase group-hover:text-white">
                    {lead.status}
                </span>
            </div>
        </div>
    </div>
);

// Existing DealCard and VisitCard below
const DealCard = ({ deal, onGenerate }) => (
    <div className="bg-white rounded-[44px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group">
        <div className="p-8 flex-grow">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    <TagIcon className="w-3 h-3" /> {deal.dealType}
                </div>
                <span className="text-gray-300 text-[10px] font-bold">#{deal.dealID.slice(0, 8)}</span>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-[32px] border border-gray-100 group-hover:bg-blue-600 transition-colors duration-500">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-100">Agreed Value</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-gray-900 group-hover:text-white">$</span>
                    <span className="text-4xl font-black text-gray-900 tracking-tighter group-hover:text-white">
                        {deal.agreedValue?.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                    <p className="text-sm font-bold text-gray-800">{deal.expectedClosureDate}</p>
                </div>
                <div className="flex items-center gap-3">
                    <HashtagIcon className="w-5 h-5 text-gray-400" />
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Status: {deal.status}</p>
                </div>
            </div>
        </div>
        <div className="p-6 bg-gray-50/50">
            <button onClick={onGenerate} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg">
                <DocumentCheckIcon className="w-5 h-5" /> Generate Contract
            </button>
        </div>
    </div>
);

const VisitCard = ({ visit }) => (
    <div className="bg-white rounded-[44px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group">
        <div className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-purple-50 text-purple-600 rounded-[24px] group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <MapPinIcon className="w-6 h-6" />
                </div>
                <span className="text-gray-300 text-[10px] font-bold">#{visit.visitID.slice(0, 8)}</span>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-2">Site Tour</h3>
            
            <div className="flex items-center gap-2 text-purple-600 mb-6">
                <CalendarDaysIcon className="w-5 h-5" />
                <p className="font-bold text-sm">{visit.visitDate}</p>
            </div>

            <div className="p-6 bg-purple-50/50 rounded-[32px] border border-purple-100 relative">
                <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-purple-300 absolute top-4 right-4" />
                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Notes</p>
                <p className="text-sm text-gray-700 font-medium italic leading-relaxed">
                    "{visit.notes || 'No specific feedback recorded for this visit.'}"
                </p>
            </div>
        </div>
        <div className="mt-auto p-6 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center">
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Lead Ref: {visit.leadID.slice(0, 12)}...</p>
             <button className="text-purple-600 font-black text-[10px] uppercase hover:underline">View Details</button>
        </div>
    </div>
);

export default SalesManagementPage;

