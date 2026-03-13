import React, { useEffect, useState } from 'react';
import { SaleService } from '../../services/dealService';
import { AddSiteVisitModal, AddLeadModal } from '../../components/Modals/SalesModel';

const SalesPipeline = () => {
    const [data, setData] = useState({ leads: [], visits: [], deals: [] });
    const [activeTab, setActiveTab] = useState('leads');
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null); // For site visit modal

    useEffect(() => {
        const fetchPipeline = async () => {
            try {
                setLoading(true);
                const [l, v, d] = await Promise.all([
                    SaleService.getLeads(),
                    SaleService.getSiteVisits(),
                    SaleService.getDeals()
                ]);
                console.log("Leads Raw:", l);

                setData({
                    leads: Array.isArray(l?.data) ? l.data : (l?.data?.items || []),
                    visits: Array.isArray(v?.data) ? v.data : (v?.data?.items || []),
                    deals: Array.isArray(d?.data) ? d.data : (d?.data?.items || [])
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchPipeline();
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-black text-gray-900">Pipeline</h1>
                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    {['leads', 'visits', 'deals'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === t ? 'bg-white shadow-md text-blue-600' : 'text-gray-400'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                        <tr>
                            {activeTab === 'leads' && (
                                <>
                                    <th className="p-6 text-xs font-black uppercase text-gray-400">Customer</th>
                                    <th className="p-6 text-xs font-black uppercase text-gray-400">Interest</th>
                                    <th className="p-6 text-xs font-black uppercase text-gray-400 text-right">Action</th>
                                </>
                            )}
                            {activeTab === 'visits' && (
                                <>
                                    <th className="p-6 text-xs font-black uppercase text-gray-400">Date</th>
                                    <th className="p-6 text-xs font-black uppercase text-gray-400">Notes</th>
                                </>
                            )}
                            {activeTab === 'deals' && (
                                <>
                                    <th className="p-6 text-xs font-black uppercase text-gray-400">Deal</th>
                                    <th className="p-6 text-xs font-black uppercase text-gray-400">Agreed Value</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data[activeTab].map((item, idx) => (
                            <tr key={idx}>
                                {activeTab === 'leads' && (
                                    <>
                                        <td className="p-6 font-bold">{item.customerName}</td>
                                        <td className="p-6 text-gray-500">{item.interestType}</td>
                                        <td className="p-6 text-right">
                                            <button onClick={() => setSelectedLead(item.leadID)} className="text-blue-600 font-bold text-xs hover:underline">Schedule Visit</button>
                                        </td>
                                    </>
                                )}
                                {activeTab === 'visits' && (
                                    <>
                                        {/* Change item.visitDate to item.visitDate (camelCase) */}
                                        <td className="p-6 font-bold">
                                            {item.visitDate ? new Date(item.visitDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-6 text-gray-500">{item.notes}</td>
                                    </>
                                )}
                                {activeTab === 'deals' && (
                                    <>
                                        <td className="p-6 font-bold">{item.dealType}</td>
                                        <td className="p-6 font-black text-green-600">${item.agreedValue}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddSiteVisitModal
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                leadID={selectedLead}
            />
        </div>
    );
};

export default SalesPipeline;