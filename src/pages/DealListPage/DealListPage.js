// import React, { useEffect, useState } from 'react';
// import { dealService } from '../../services/dealService';
// import { 
//   MagnifyingGlassIcon, 
//   ArrowPathIcon,
//   EllipsisVerticalIcon
// } from '@heroicons/react/24/outline';

// const DealListPage = () => {
//     const [deals, setDeals] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState("");

//     const statusColors = {
//         Negotiation: "bg-blue-100 text-blue-700",
//         ContractSent: "bg-purple-100 text-purple-700",
//         Signed: "bg-orange-100 text-orange-700",
//         Closed: "bg-green-100 text-green-700",
//         Cancelled: "bg-red-100 text-red-700"
//     };

//     useEffect(() => {
//         fetchDeals();
//     }, []);

//     const fetchDeals = async () => {
//         try {
//             setLoading(true);
//             const response = await dealService.getDeals();
//             // Matching your .NET API pattern: response.data.items
//             const items = response?.data?.items || [];
//             setDeals(items);
//         } catch (err) {
//             console.error("Error fetching deals:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const filteredDeals = deals.filter(deal => 
//         deal.dealType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         deal.status.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="p-2">
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
//                 <div>
//                     <h1 className="text-3xl font-black text-gray-900 tracking-tight">Deals & Transactions</h1>
//                     <p className="text-gray-500 font-medium">Monitor active negotiations and closed property sales.</p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                     <div className="relative">
//                         <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                         <input
//                             type="text"
//                             placeholder="Filter deals..."
//                             className="pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 w-64 shadow-sm"
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                     <button onClick={fetchDeals} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 text-gray-400">
//                         <ArrowPathIcon className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
//                     </button>
//                 </div>
//             </div>

//             {loading ? (
//                 <div className="flex justify-center py-40">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                 </div>
//             ) : (
//                 <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="bg-gray-50/50">
//                                 <th className="px-8 py-6 text-xs font-black uppercase text-gray-400 tracking-widest">Type</th>
//                                 <th className="px-8 py-6 text-xs font-black uppercase text-gray-400 tracking-widest">Agreed Value</th>
//                                 <th className="px-8 py-6 text-xs font-black uppercase text-gray-400 tracking-widest">Closure Date</th>
//                                 <th className="px-8 py-6 text-xs font-black uppercase text-gray-400 tracking-widest">Status</th>
//                                 <th className="px-8 py-6 text-xs font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-50">
//                             {filteredDeals.map((deal) => (
//                                 <tr key={deal.dealID} className="hover:bg-gray-50/50 transition-colors group">
//                                     <td className="px-8 py-6">
//                                         <div className="flex flex-col">
//                                             <span className="font-bold text-gray-800">{deal.dealType}</span>
//                                             <span className="text-[10px] text-gray-400 font-mono">{deal.dealID.substring(0, 8)}...</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-8 py-6">
//                                         <span className="font-black text-blue-600">
//                                             ${deal.agreedValue.toLocaleString()}
//                                         </span>
//                                     </td>
//                                     <td className="px-8 py-6">
//                                         <span className="text-sm font-medium text-gray-600">
//                                             {new Date(deal.expectedClosureDate).toLocaleDateString()}
//                                         </span>
//                                     </td>
//                                     <td className="px-8 py-6">
//                                         <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${statusColors[deal.status] || 'bg-gray-100 text-gray-600'}`}>
//                                             {deal.status}
//                                         </span>
//                                     </td>
//                                     <td className="px-8 py-6 text-right">
//                                         <button className="p-2 text-gray-400 hover:bg-white hover:shadow-sm rounded-xl">
//                                             <EllipsisVerticalIcon className="w-5 h-5" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
                    
//                     {filteredDeals.length === 0 && (
//                         <div className="text-center py-20">
//                             <p className="text-gray-400 font-bold">No deals found.</p>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DealListPage;