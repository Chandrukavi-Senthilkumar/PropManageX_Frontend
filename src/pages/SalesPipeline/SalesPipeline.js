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
                SaleService.getLeads(),
                SaleService.getSiteVisits(),
                SaleService.getDeals()
            ]);
            setData({
                leads: l?.data || l || [],
                visits: v?.data || v || [],
                deals: d?.data || d || []
            });
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const tabs = [
        { id: 'leads', name: 'Leads', icon: UserPlusIcon, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { id: 'visits', name: 'Visits', icon: CalendarIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'deals', name: 'Deals',  icon: BanknotesIcon, color: 'text-green-600', bg: 'bg-green-50' }
    ];

    return (
        <div className="p-10 space-y-10 min-h-screen bg-gray-50/30">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Pipeline</h1>
                    <p className="text-gray-400 font-bold mt-2">Track your entire sales journey from inquiry to closing.</p>
                </div>
                <button 
                    onClick={() => setModal({ ...modal, [activeTab.slice(0, -1)]: true })}
                    className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-[24px] font-black shadow-2xl hover:bg-black transition-all active:scale-95"
                >
                    <PlusIcon className="w-6 h-6" /> Add New {activeTab.slice(0, -1)}
                </button>
            </div>

            <div className="flex gap-4 p-2 bg-white border border-gray-100 rounded-[28px] w-fit shadow-sm">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-3 px-8 py-4 rounded-[22px] font-black text-sm transition-all ${activeTab === t.id ? `${t.bg} ${t.color}` : 'text-gray-400 hover:text-gray-600'}`}>
                        <t.icon className="w-5 h-5" /> {t.name}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[44px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-50">
                        <tr>
                            {activeTab === 'leads' && <><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</th><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th></>}
                            {activeTab === 'visits' && <><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Notes</th></>}
                            {activeTab === 'deals' && <><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Deal Type</th><th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Value</th></>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data[activeTab].map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/30 transition-all">
                                {activeTab === 'leads' && <><td className="p-8 font-black text-gray-800">{item.customerName}</td><td className="p-8"><span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{item.status}</span></td></>}
                                {activeTab === 'visits' && <><td className="p-8 font-black text-gray-800">{item.visitDate}</td><td className="p-8 text-gray-500 font-medium">{item.notes}</td></>}
                                {activeTab === 'deals' && <><td className="p-8 font-black text-gray-800">{item.dealType}</td><td className="p-8 font-black text-green-600">${item.agreedValue?.toLocaleString()}</td></>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddLeadModal isOpen={modal.lead} onClose={() => setModal({...modal, lead: false})} refresh={fetchAll} />
            <AddSiteVisitModal isOpen={modal.visit} onClose={() => setModal({...modal, visit: false})} refresh={fetchAll} />
            <AddDealModal isOpen={modal.deal} onClose={() => setModal({...modal, deal: false})} refresh={fetchAll} />
        </div>
    );
};

export default SalesPipeline;