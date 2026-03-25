import React, { useEffect, useState } from 'react';
import { SaleService } from '../../services/dealService';
import { UserPlusIcon, CalendarIcon, BanknotesIcon, PlusIcon } from '@heroicons/react/24/outline';
import { AddLeadModal, AddSiteVisitModal, AddDealModal } from '../../components/Modals/SalesModel';

const SalesPipeline = () => {
    const [activeTab, setActiveTab] = useState('leads');
    const [data, setData] = useState({ leads: [], visits: [], deals: [] });
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ lead: false, visit: false, deal: false });

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [l, v, d] = await Promise.all([
                SaleService.getAllLeads ? SaleService.getAllLeads() : Promise.resolve({ data: [] }),
                SaleService.getAllSiteVisits(),
                SaleService.getAllDeals()
            ]);
            
            // 1. Extract raw arrays safely
            const rawLeads = l?.data?.items || l?.data || l || [];
            const rawVisits = v?.data?.items || v?.data || v || [];
            const rawDeals = d?.data?.items || d?.data || d || [];

            const extractedLeads = Array.isArray(rawLeads) ? rawLeads : [];
            const safeVisits = Array.isArray(rawVisits) ? rawVisits : [];
            const safeDeals = Array.isArray(rawDeals) ? rawDeals : [];

            // 2. STITCHING LOGIC: Map the customerName from Leads to Visits and Deals
            const mappedVisits = safeVisits.map(visit => {
                const matchedLead = extractedLeads.find(lead => lead.leadID === visit.leadID);
                return { ...visit, customerName: matchedLead ? matchedLead.customerName : 'Unknown Lead' };
            });

            const mappedDeals = safeDeals.map(deal => {
                const matchedLead = extractedLeads.find(lead => lead.leadID === deal.leadID);
                return { ...deal, customerName: matchedLead ? matchedLead.customerName : 'Unknown Lead' };
            });

            // 3. Save the fully mapped data to state
            setData({
                leads: extractedLeads,
                visits: mappedVisits,
                deals: mappedDeals
            });

        } catch (err) { 
            console.error("Error fetching pipeline data:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { 
        fetchAll(); 
    }, []);

    const tabs = [
        { id: 'leads', name: 'Leads', icon: UserPlusIcon, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { id: 'visits', name: 'Visits', icon: CalendarIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'deals', name: 'Deals',  icon: BanknotesIcon, color: 'text-green-600', bg: 'bg-green-50' }
    ];

    const getButtonText = () => {
        if (activeTab === 'leads') return 'Add New Lead';
        if (activeTab === 'visits') return 'Schedule Visit';
        return 'Create Deal';
    };

    return (
        <div className="p-10 space-y-10 min-h-screen bg-gray-50/30">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Deals Dashboard</h1>
                    <p className="text-gray-400 font-bold mt-2">Track your entire sales journey from inquiry to closing.</p>
                </div>
                <button 
                    onClick={() => setModal({ ...modal, [activeTab.slice(0, -1)]: true })}
                    className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-[24px] font-black shadow-2xl hover:bg-black transition-all active:scale-95"
                >
                    <PlusIcon className="w-6 h-6" /> {getButtonText()}
                </button>
            </div>

            <div className="flex gap-4 p-2 bg-white border border-gray-100 rounded-[28px] w-fit shadow-sm">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-3 px-8 py-4 rounded-[22px] font-black text-sm transition-all ${activeTab === t.id ? `${t.bg} ${t.color}` : 'text-gray-400 hover:text-gray-600'}`}>
                        <t.icon className="w-5 h-5" /> {t.name}
                    </button>
                ))}
            </div>

            {loading ? (
                 <div className="py-20 text-center text-gray-400 font-bold animate-pulse">Loading data...</div>
            ) : (
                <div className="bg-white rounded-[44px] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-50">
                            <tr>
                                {activeTab === 'leads' && <><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</th><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th></>}
                                {/* UPDATED: Replaced Lead Reference with Customer Name for Visits */}
                                {activeTab === 'visits' && <><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</th><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Notes</th></>}
                                {/* UPDATED: Replaced Deal Type with Customer/Deal Info for Deals */}
                                {activeTab === 'deals' && <><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer / Deal</th><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Expected Close</th><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Value</th></>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data[activeTab].length > 0 ? data[activeTab].map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/30 transition-all">
                                    
                                    {/* LEADS TAB */}
                                    {activeTab === 'leads' && (
                                        <>
                                            <td className="p-8 font-black text-gray-800">
                                                {item.customerName || 'Unnamed Lead'}
                                                <div className="text-xs text-gray-400 font-normal mt-1">{item.contactInfo}</div>
                                            </td>
                                            <td className="p-8">
                                                <span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{item.status || 'NEW'}</span>
                                            </td>
                                        </>
                                    )}

                                    {/* VISITS TAB (Now showing mapped Customer Name) */}
                                    {activeTab === 'visits' && (
                                        <>
                                            <td className="p-8 font-black text-gray-800">{item.visitDate || 'N/A'}</td>
                                            <td className="p-8">
                                                <div className="font-bold text-gray-900 text-base">{item.customerName}</div>
                                                {/* <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ref: #{item.leadID?.slice(0,8) || 'Unknown'}</div> */}
                                            </td>
                                            <td className="p-8 text-gray-500 font-medium italic">"{item.notes || 'No notes'}"</td>
                                        </>
                                    )}

                                    {/* DEALS TAB (Now showing mapped Customer Name) */}
                                    {activeTab === 'deals' && (
                                        <>
                                            <td className="p-8">
                                                <div className="font-black text-gray-900 text-lg">{item.customerName}</div>
                                                <div className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{item.dealType || 'Sale'}</div>
                                            </td>
                                            <td className="p-8 text-gray-500 font-bold">{item.expectedClosureDate || 'TBD'}</td>
                                            <td className="p-8 font-black text-green-600 text-xl">${item.agreedValue?.toLocaleString() || '0'}</td>
                                        </>
                                    )}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="p-10 text-center text-gray-400 italic font-bold">No {activeTab} found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <AddLeadModal isOpen={modal.lead} onClose={() => setModal({...modal, lead: false})} onSuccess={fetchAll} />
            <AddSiteVisitModal isOpen={modal.visit} onClose={() => setModal({...modal, visit: false})} onSuccess={fetchAll} />
            <AddDealModal isOpen={modal.deal} onClose={() => setModal({...modal, deal: false})} onSuccess={fetchAll} />
        </div>
    );
};

export default SalesPipeline;